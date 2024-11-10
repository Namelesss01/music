import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import User from "../../assets/icon/user-icon.svg";
import { Link } from "react-router-dom";
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

  useEffect(() => {
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
    });

    return () => unsubscribe();
  }, []);

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
  };

  const toggleAccountEdit = () => {
    setIsAccountEditing((prev) => !prev);
  };

  const updateAccountInfo = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userUid = user ? user.uid : null; // Ensure userUid is defined

    if (userUid) {
      try {
        // Proceed with your update logic here using userUid
      } catch (error) {
        console.error("Error updating account info:", error);
      }
    } else {
      console.error("User is not logged in.");
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row justify-center items-start md:items-end gap-8 bg-white p-6 rounded-lg">
        <div className="bg-gray-300 w-full md:w-[300px] h-[300px] md:h-[400px] rounded-md flex items-center justify-center mb-4 md:mb-0">
          <img src={User} alt="User Icon" />
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

      {/* Students Table Section */}
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
                    {student.fullName}
                  </TableCell>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={vocalAccess[student.id] || false}
                      disabled={!isEditing}
                      onChange={async () => {
                        const newVocalAccess = !vocalAccess[student.id];
                        setVocalAccess((prev) => ({
                          ...prev,
                          [student.id]: newVocalAccess,
                        }));
                        const studentDocRef = doc(db, "users", student.id);
                        try {
                          await updateDoc(studentDocRef, {
                            vocalAccess: newVocalAccess,
                          });
                        } catch (error) {
                          console.error("Error updating vocal access:", error);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={guitarAccess[student.id] || false}
                      disabled={!isEditing}
                      onChange={async () => {
                        const newGuitarAccess = !guitarAccess[student.id];
                        setGuitarAccess((prev) => ({
                          ...prev,
                          [student.id]: newGuitarAccess,
                        }));
                        const studentDocRef = doc(db, "users", student.id);
                        try {
                          await updateDoc(studentDocRef, {
                            guitarAccess: newGuitarAccess,
                          });
                        } catch (error) {
                          console.error("Error updating guitar access:", error);
                        }
                      }}
                    />
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
