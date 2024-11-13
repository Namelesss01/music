        import { useEffect, useState } from "react";
        import { db, storage } from "../../firebase/config";
        import { doc, getDoc, updateDoc } from "firebase/firestore";
        import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
        import { Input } from "../../components/ui/input";
        import GitareIcon from "../../assets/icon/gitare-icon.svg";
        import Microphone from "../../assets/icon/microphone-icon.svg";
        import User from "../../assets/icon/user.svg";
        import { Button } from "../../components/ui/button";
        import { getAuth } from "firebase/auth";
        import { useNavigate } from "react-router-dom";

        const Account = () => {
          const [fullName, setFullName] = useState("");
          const [phoneNumber, setPhoneNumber] = useState("");
          const [isEditing, setIsEditing] = useState(false);
          const [loading, setLoading] = useState(true);
          const [userUid, setUserUid] = useState<string | null>(null);
          const [userType, setUserType] = useState<string | null>(null);
          const [vocalAccess, setVocalAccess] = useState(false);
          const [gitareAccess, setGitareAccess] = useState(false);
          const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
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
                    setUserType(userData.userType || null);
                    setVocalAccess(userData.VocalAccess || false);
                    setGitareAccess(userData.GitareAccess || false);
                    setProfileImageUrl(userData.profileImageUrl || null);
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

          const handleImageUpload = async (
            event: React.ChangeEvent<HTMLInputElement>
          ) => {
            if (event.target.files && event.target.files[0] && userUid) {
              const file = event.target.files[0];
              const storageRef = ref(storage, `profileImages/${userUid}`);

              try {
                // Upload the file to Firebase Storage
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);

                // Save the download URL in the Firestore database
                await updateDoc(doc(db, "users", userUid), {
                  profileImageUrl: downloadURL,
                });

                setProfileImageUrl(downloadURL);
              } catch (error) {
                console.error("Error uploading image:", error);
              }
            }
          };

          if (loading) return <p>Loading...</p>;

          return (
            <div className="flex justify-center items-start py-[70px] bg-[--white] md:mx-auto">
              <div className="flex flex-col md:flex-row gap-[30px] px-4 md:px-24 w-full">
                <div className="relative bg-gray-300 w-[200px] h-[250px] md:w-[300px] md:h-[400px] rounded-md flex justify-center items-center mb-6 md:mb-0">
                  <img
                    src={profileImageUrl || User}
                    alt="User"
                    className="object-cover w-full h-full rounded-md"
                  />
                  {isEditing && (
                    <label className="absolute bottom-2 bg-[--dark-blue] text-white py-1 px-3 rounded-md cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      Загрузить фото
                    </label>
                  )}
                </div>
                <div className="flex flex-col gap-4 w-full md:w-[500px]">
                  <Input
                    type="text"
                    className="rounded-md h-12 text-lg bg-[--light-blue] w-full p-2 mb-4"
                    placeholder="ФИО"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing}
                  />
                  <Input
                    type="text"
                    className="rounded-md h-12 text-lg bg-[--light-blue] w-full p-2 mb-6"
                    placeholder="Номер:"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!isEditing}
                  />
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
                      <div
                        className={`relative flex items-center py-2 px-4 rounded-lg ${
                          userType === "student" && vocalAccess
                            ? "bg-[--dark-blue]"
                            : "bg-[--light-grey]"
                        } text-gray-700`}
                      >
                        <img
                          src={Microphone}
                          className="absolute left-4 top-[7px]"
                          alt="Microphone Icon"
                        />
                        <span className="text-[--white] font-bold py-3 px-10 ml-14 text-xl">
                          Вокал
                        </span>
                      </div>
                      <div
                        className={`relative flex items-center py-2 px-4 rounded-lg ${
                          userType === "student" && gitareAccess
                            ? "bg-[--dark-blue]"
                            : "bg-[--light-grey]"
                        } text-gray-700`}
                      >
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
