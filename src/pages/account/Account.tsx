import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Input } from "../../components/ui/input";
import GitareIcon from "../../assets/icon/gitare-icon.svg";
import Microphone from "../../assets/icon/microphone-icon.svg";
import User from "../../assets/icon/user-icon.svg";
import { Button } from "../../components/ui/button";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserUid(user.uid); 
    } else {
      navigate("/login"); // Redirect to login if no user is logged in
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userUid) {
        try {
          const userDoc = await getDoc(doc(db, "users", userUid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullName(userData.fullName || "");
            setPhoneNumber(userData.phoneNumber || "");
          } else {
            console.error("No user data found.");
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [userUid]);

  const handleSave = async () => {
    if (!userUid) {
      console.error("User UID is not set. Cannot save data.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", userUid), {
        fullName,
        phoneNumber,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-start py-[70px] bg-[--white]">
      <div className="flex flex-col md:flex-row gap-[30px] px-4 md:px-24 w-full">
        <div className="bg-gray-300 w-[200px] h-[250px] md:w-[300px] md:h-[400px] rounded-md flex justify-center items-center mb-6 md:mb-0">
          <img src={User} alt="User" />
        </div>
        <div className="flex flex-col gap-4 w-full md:w-[500px]">
          <div>
            <Input
              type="text"
              className="rounded-md h-12 text-lg bg-[--light-blue] w-full p-2 mb-4"
              placeholder="ФИО"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Input
              type="text"
              className="rounded-md h-12 text-lg bg-[--light-blue] w-full p-2 mb-6"
              placeholder="Номер:"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          {isEditing ? (
            <Button onClick={handleSave} className="text-white w-full">
              Сохранить данные аккаунта
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="text-white w-full"
            >
              Редактировать данные аккаунта
            </Button>
          )}
          <div className="text-center mt-6">
            <p className="text-[--brown] text-xl mb-3">Доступ к курсам</p>
            <div className="flex justify-center gap-6">
              <div className="relative flex items-center bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
                <img
                  src={Microphone}
                  className="absolute left-4 top-[7px]"
                  alt="Microphone Icon"
                />
                <span className="text-[--white] font-bold py-3 px-10 ml-14 text-xl">
                  Вокал
                </span>
              </div>
              <div className="relative flex items-center bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
                <img
                  src={GitareIcon}
                  className="absolute top-[3px]"
                  alt="Guitar Icon"
                />
                <span className="text-[--white] font-bold py-3 px-10 ml-14 text-xl">
                  Гитара
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
