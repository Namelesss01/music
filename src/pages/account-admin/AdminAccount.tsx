import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import User from "../../assets/icon/user.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Student {
  id: string;
  fullName: string;
  vocalAccess: boolean;
  guitarAccess: boolean;
}

const AdminAccount = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAccountEditing, setIsAccountEditing] = useState(false);
  const [vocalAccess, setVocalAccess] = useState<Record<string, boolean>>({});
  const [guitarAccess, setGuitarAccess] = useState<Record<string, boolean>>({});
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [info, setInfo] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;
  const userUid = user ? user.uid : null;
  const userType = user
    ? user.email === "admin@example.com"
      ? "admin"
      : "student"
    : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.error("User not authenticated");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchAccountInfo = async () => {
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFullName(userData.fullName || "");
        setPhoneNumber(userData.phoneNumber || "");
        setInfo(userData.info || "");
        setProfileImage(userData.profileImage || null);
      }
    };

    fetchAccountInfo();

    const studentQuery = query(
      collection(db, "users"),
      where("userType", "==", "student")
    );

    const unsubscribe = onSnapshot(studentQuery, (snapshot) => {
      const studentList: Student[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        fullName: doc.data().fullName,
        vocalAccess: doc.data().vocalAccess || false,
        guitarAccess: doc.data().guitarAccess || false,
      }));
      setStudents(studentList);
      const vocalState: Record<string, boolean> = {};
      const guitarState: Record<string, boolean> = {};
      studentList.forEach((student) => {
        vocalState[student.id] = student.vocalAccess;
        guitarState[student.id] = student.guitarAccess;
      });
      setVocalAccess(vocalState);
      setGuitarAccess(guitarState);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userUid, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updates = students.map((student) => {
      const studentDocRef = doc(db, "users", student.id);
      return updateDoc(studentDocRef, {
        vocalAccess: vocalAccess[student.id],
        guitarAccess: guitarAccess[student.id],
      });
    });

    await Promise.all(updates);
    setIsEditing(false);
    setIsAccountEditing(false);
  };

  const navigateToAccount = (studentId: string) => {
    if (userType === "admin") {
      navigate(`/account-admin/${studentId}`);
    } else {
      navigate("/account");
    }
  };

  const toggleAccountEdit = () => {
    setIsAccountEditing((prev) => !prev);
  };

  const updateAccountInfo = async () => {
    if (userUid) {
      try {
        const userDocRef = doc(db, "users", userUid);

        let profileImageUrl = profileImage;
        if (imageFile) {
          const storage = getStorage();
          const storageRef = ref(storage, `profileImages/${userUid}`);
          await uploadBytes(storageRef, imageFile);
          profileImageUrl = await getDownloadURL(storageRef);
        }

        await updateDoc(userDocRef, {
          fullName,
          phoneNumber,
          info,
          profileImage: profileImageUrl,
        });
        alert("Данные аккаунта обновлены успешно!");
      } catch (error) {
        console.error("Error updating account info:", error);
      }
    } else {
      console.error("User is not logged in.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${userUid}`);

      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setProfileImage(downloadURL);
        });
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-center items-start md:items-end gap-8 bg-white p-6 rounded-lg">
        <div className="relative">
          <div className="relative bg-gray-300 w-[300px] h-[400px] rounded-md flex justify-center items-center mb-6 md:mb-0">
            <img
              src={profileImage || User}
              alt="User"
              className="object-cover object-center w-full h-full rounded-md"
            />
            {isEditing && (
              <label className="absolute bottom-2 bg-[--dark-blue] text-white py-1 px-3 rounded-md cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                Загрузить фото
              </label>
            )}
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col w-full md:w-[500px] space-y-4">
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-md h-12 text-lg bg-[--light-blue] p-2"
            placeholder="ФИО"
            disabled={!isAccountEditing}
          />
          <Input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="rounded-md h-12 text-lg bg-[--light-blue] p-2 mb-6"
            placeholder="Номер:"
            disabled={!isAccountEditing}
          />
          <Textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="rounded-md h-12 text-lg bg-[--light-blue] p-2 mb-6"
            placeholder="Информация:"
            disabled={!isAccountEditing}
          />
          {isAccountEditing ? (
            <Button onClick={updateAccountInfo}>
              Сохранить данные аккаунта
            </Button>
          ) : (
            <Button onClick={toggleAccountEdit}>
              Редактировать данные аккаунта
            </Button>
          )}
          <Link to="/add-file">
            <Button className="w-full">Добавить видео</Button>
          </Link>
        </div>
      </div>

      <div className="my-10">
        <p className="text-4xl text-center mb-6">
          Список учеников и доступ к урокам
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              {isEditing ? (
                <Button onClick={handleSave}>Сохранить данные</Button>
              ) : (
                <Button onClick={handleEdit}>Изменить данные</Button>
              )}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">ФИО Учеников</TableHead>
                <TableHead className="text-center">Вокал</TableHead>
                <TableHead className="text-center">Гитара</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    {/* Make the student's name clickable */}
                    <span
                      className="cursor-pointer text-blue-500"
                      onClick={() => navigateToAccount(student.id)}
                    >
                      {student.fullName}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={vocalAccess[student.id]}
                      disabled={!isEditing}
                      onChange={() =>
                        setVocalAccess((prev) => ({
                          ...prev,
                          [student.id]: !prev[student.id],
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={guitarAccess[student.id]}
                      disabled={!isEditing}
                      onChange={() =>
                        setGuitarAccess((prev) => ({
                          ...prev,
                          [student.id]: !prev[student.id],
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {/* Remove the button, since clicking on the name will handle navigation */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
