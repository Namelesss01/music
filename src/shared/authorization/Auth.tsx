import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { useLogin } from "../../hooks/useLogin";
import Spinner from "../../components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { setDoc, doc } from "firebase/firestore"; // Import setDoc and doc
import { getDoc } from "firebase/firestore";

interface LayoutProps {
  children: React.ReactNode;
}

interface UserData {
  displayName: string;
  email: string;
  userType: string;
  fullName: string;
  VocalAccess?: boolean; // Only for students
  GitareAccess?: boolean; // Only for students
  Number?: string; // Only for admins
  Info?: string; // Only for admins
}

export function Auth(props: LayoutProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>(""); // New state for full name
  const [userType, setUserType] = useState<string>("student");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("auth");
  const [error, setError] = useState<string>("");
  const { signup, error: signupError } = useSignup();
  const { login, resetPassword, error: loginError } = useLogin();
  const navigate = useNavigate();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const res = await login(email, password);
    setError(loginError);

    if (res) {
      const userDocRef = doc(db, "users", res.user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (userData) {
        setUserUid(res.user.uid); // Store UID in state
        navigate(userData.userType === "admin" ? "/account-admin" : "/account");
      }
      handleClose();
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const res = await signup({ displayName, email, password, userType });
    setError(signupError as string);

    if (res) {
      setUserUid(res.user.uid); // Store UID in state

      const userData: UserData = {
        displayName,
        email,
        userType,
        fullName,
      };

      if (userType === "student") {
        userData.VocalAccess = false;
        userData.GitareAccess = false;
      }

      if (userType === "admin") {
        userData.Number = "";
        userData.Info = "";
      }

      await setDoc(doc(db, "users", res.user.uid), userData);
      handleClose();
    }
    setIsLoading(false);
  };

  const handlePasswordReset = async () => {
    if (email) {
      await resetPassword(email);
      alert(
        "Если email существует в системе, вы получите письмо для сброса пароля."
      );
    } else {
      setError("Пожалуйста, введите ваш email.");
    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setFullName(""); // Reset full name
    setError("");
  }, [activeTab]);

  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={handleOpen} asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent
        ref={dialogRef}
        className="flex justify-center items-center mx-auto bg-white rounded-lg shadow-lg p-6 max-w-sm"
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 text-xl"
        >
          X
        </button>

        <Tabs defaultValue="auth" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="auth" onClick={() => setActiveTab("auth")}>
              Авторизация
            </TabsTrigger>
            <TabsTrigger
              value="registration"
              onClick={() => setActiveTab("registration")}
            >
              Регистрация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auth">
            <DialogTitle className="text-center mb-4">Авторизация</DialogTitle>
            <Card className="rounded-lg shadow-md">
              <CardContent className="space-y-5">
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="username"
                  placeholder="Почта"
                  type="email"
                  className="border rounded-md p-2 w-full mt-6"
                />
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder="Пароль"
                  type="password"
                  className="border rounded-md p-2 w-full"
                />
                {loginError && <p className="text-red-500">{error}</p>}
                <div className="flex items-center justify-between pt-4 pb-2">
                  <div className="flex items-center gap-x-2">
                    <Checkbox />
                    <Label>Запомнить меня</Label>
                  </div>
                  <a
                    onClick={handlePasswordReset}
                    className="text-blue-500 cursor-pointer"
                  >
                    Забыли пароль?
                  </a>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={handleLogin}
                >
                  {isLoading ? <Spinner /> : "Войти"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="registration">
            <DialogTitle className="text-center mb-4">Регистрация</DialogTitle>
            <Card className="rounded-lg shadow-md">
              <CardContent className="space-y-5">
                <Input
                  onChange={(e) => setFullName(e.target.value)}
                  id="fullName"
                  placeholder="Ф.И.О."
                  type="text"
                  className="border rounded-md p-2 w-full mt-6"
                />
                <Input
                  onChange={(e) => setDisplayName(e.target.value)}
                  id="displayName"
                  placeholder="Имя пользователя"
                  type="text"
                  className="border rounded-md p-2 w-full"
                />
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="Почта"
                  type="email"
                  className="border rounded-md p-2 w-full"
                />
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder="Пароль"
                  type="password"
                  className="border rounded-md p-2 w-full"
                />
                <div className="flex justify-between">
                  <Button
                    className="w-1/2"
                    onClick={() => setUserType("admin")}
                    variant={userType === "admin" ? "solid" : "outline"}
                  >
                    Админ
                  </Button>
                  <Button
                    className="w-1/2"
                    onClick={() => setUserType("student")}
                    variant={userType === "student" ? "solid" : "outline"}
                  >
                    Студент
                  </Button>
                </div>
                {signupError && <p className="text-red-500">{error}</p>}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={handleSignUp}
                >
                  {isLoading ? <Spinner /> : "Зарегистрироваться"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default Auth;
