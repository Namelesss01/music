import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
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
import { DialogTitle } from "../../components/ui/dialog";
import { CardFooter } from "../../components/ui/card";
import { db } from "../../firebase/config";
import { getFirestore, collection } from "firebase/firestore";

interface LayoutProps {
  children: React.ReactNode;
}

export function Auth(props: LayoutProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userType, setUserType] = useState<string>("student");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("auth");
  const [error, setError] = useState<string>("");

  const { signup, error: signupError } = useSignup();
  const { login, error: loginError } = useLogin();
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
      // Check user role after login
      const userDoc = await db.collection("users").doc(res.user.uid).get();
      const userData = userDoc.data();
      if (userData) {
        if (userData.userType === "admin") {
          navigate("/account-admin");
        } else {
          navigate("/account");
        }
      }
      return handleClose();
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);

    const res = await signup({
      displayName,
      email,
      password,
      userType,
    });

    setError(signupError as string);

    if (res) {
      // Redirect based on userType is handled in the signup hook
      handleClose();
      return;
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setError("");
  }, [activeTab]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={handleOpen} asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent
        ref={dialogRef}
        className="flex justify-center items-center mx-auto bg-white rounded-lg shadow-lg p-6 max-w-sm"
      >
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
                  placeholder="Логин"
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
                {loginError && <p className="text-red-500">{error}</p>}
                <div className="flex items-center justify-between pt-4 pb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="terms" className="border-gray-300" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none"
                    >
                      Запомнить меня
                    </label>
                  </div>
                  <a href="#" className="text-xs font-medium text-blue-500">
                    Забыли пароль?
                  </a>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  {isLoading ? <Spinner /> : "Войти"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="registration">
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="text-center mb-2">Регистрация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label htmlFor="displayName">Имя</Label>
                  <Input
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                    placeholder="Имя"
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Почта</Label>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Почта"
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Пароль"
                    className="border rounded-md p-2 w-full"
                  />
                </div>

                {/* User Type Selection */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setUserType("student")}
                    variant={userType === "student" ? "primary" : "default"}
                    className={`w-full ${
                      userType === "student"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    } rounded-md transition duration-200`}
                  >
                    Студент
                  </Button>
                  <Button
                    onClick={() => setUserType("admin")}
                    variant={userType === "admin" ? "primary" : "default"}
                    className={`w-full ${
                      userType === "admin"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    } rounded-md transition duration-200`}
                  >
                    Админ
                  </Button>
                </div>

                {signupError && <p className="text-red-500">{error}</p>}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
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
