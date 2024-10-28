import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/Checkbox";
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

interface LayoutProps {
  children: React.ReactNode;
}

export function Auth(props: LayoutProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [avatar, setAvatar] = useState<File>();
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
      navigate("/account");
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
    });

    setError(signupError as string);

    if (res) {
      navigate("/account");
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
        className="flex justify-center items-center min-w-[462px] min-h-[380px] sm:max-w-[328px] max-h-[366px] mx-auto"
      >
        <Tabs defaultValue="auth">
          <TabsList className="grid w-full grid-cols-2">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-center font-semibold text-[22px]">
                  Авторизация
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    id="username"
                    placeholder="Логин"
                    type="email"
                  />
                </div>
                <div>
                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    placeholder="Пароль"
                    type="password"
                  />
                </div>
                {loginError && <p className="text-red-500">{error}</p>}
                <div className="flex items-center justify-between pt-6 pb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="terms" className="border-[#A0A0A2]" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Запомнить меня
                    </label>
                  </div>
                  <a href="#" className="text-xs font-medium text-[#1875F0]">
                    Забыли пароль?
                  </a>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  type="submit"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                    </>
                  ) : (
                    "Войти"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Здесь Регистрация */}

          <TabsContent value="registration">
            <Card>
              <CardHeader>
                <CardTitle className="text-center font-semibold text-[22px]">
                  Регистрация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label htmlFor="displayName"></Label>
                  <Input
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                    placeholder="Имя"
                  />
                </div>
                <div>
                  <Label htmlFor="email"></Label>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Почта"
                  />
                </div>
                <div>
                  <Label htmlFor="password"></Label>
                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Пароль"
                  />
                </div>
                {signupError && <p className="text-red-500">{signupError}</p>}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  type="button" // изменено с 'submit' на 'button'
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
