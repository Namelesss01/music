import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Input } from "../../components/ui/input";
import GitareIcon from "../../assets/icon/gitare-icon.svg";
import Microphone from "../../assets/icon/microphone-icon.svg";
import User from "../../assets/icon/user-icon.svg";
import { Button } from "../../components/ui/button";

const Account = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userUid) {
        // Ensure userUid is set
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
          setLoading(false); // Set loading to false after data is fetched
        }
      }
    };
    fetchUserData();
  }, [userUid]);

  const handleSave = async () => {
    if (!userUid) {
      console.error("User UID is not set. Cannot save data.");
      return; // Exit if userUid is not available
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

  if (loading) return <p>Loading...</p>; // Show loading indicator

  return (
    <div className="flex justify-center items-end my-[70px] bg-[--white]">
      <div className="md:flex gap-[70px]">
        <div className="bg-gray-300 w-[300px] h-[400px] rounded-md flex ml-24 md:ml-0 items-center justify-center mb-10">
          <img src={User} alt="" />
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <Input
              type="text"
              className="rounded-md h-12 text-lg bg-[--light-blue] w-[500px] p-2 mb-4"
              placeholder="ФИО"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Input
              type="text"
              className="rounded-md h-12 text-lg bg-[--light-blue] w-[500px] p-2 mb-6"
              placeholder="Номер:"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          {isEditing ? (
            <Button onClick={handleSave} className=" text-white">
              Сохранить данные аккаунта
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="text-white">
              Редактировать данные аккаунта
            </Button>
          )}
          <div className="text-center">
            <p className="text-[--brown] text-xl mb-3">Доступ к курсам</p>
            <div className="flex justify-center gap-7">
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
          <div className="flex justify-end gap-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Account;
