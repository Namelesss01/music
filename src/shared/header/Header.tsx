import { LINKS_ITEM } from "./const";
import Logo from "@/assets/img/Logo-head.svg";
import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../authorization/Auth";
import { useAuthStatus } from "../../hooks/useAuthStatus";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useState } from "react"; // Импортируем useState

const Header = () => {
  const { isLoggedIn, userType, isCheckingStatus } = useAuthStatus();
  const navigate = useNavigate();

  // Состояние для бургер-меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Выход из аккаунта
      navigate("/"); // Перенаправление на главную страницу
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      if (userType === "admin") {
        navigate("/account-admin"); // Редирект на аккаунт администратора
      } else {
        navigate("/account"); // Редирект на аккаунт пользователя
      }
    }
  };

  // Функция для плавной прокрутки к футеру
  const scrollToFooter = () => {
    const footerElement = document.getElementById("footer");
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: "smooth" }); // Прокрутка с анимацией
    }
  };

  // Обработчик клика по ссылке
  const handleLinkClick = (label) => {
    if (label === "Контакты") {
      scrollToFooter(); // Плавная прокрутка к футеру
    }
    setIsMenuOpen(false); // Закрытие бургер-меню после клика
  };

  return (
    <div className="bg-[--dark-blue] overflow-hidden">
      <div className="flex justify-between items-center w-full py-5 px-10">
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>

        {/* Меню для экранов размером md и больше */}
        <div className="hidden md:flex gap-12">
          {LINKS_ITEM.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[--white] text-xl"
              onClick={() => handleLinkClick(link.label)} // Обработчик клика
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Контейнер для бургер-меню и иконки аккаунта */}
        <div className="flex items-center gap-4">
          {/* Бургер меню для мобильных устройств */}
          <div className="md:hidden">
            <button
              className="text-white text-3xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Управление состоянием меню
            >
              {isMenuOpen ? (
                // Cross icon (X) when menu is open
                <span>&#10005;</span>
              ) : (
                // Hamburger menu icon when menu is closed
                <span>&#9776;</span>
              )}
            </button>
          </div>

          {/* Иконки пользователя и выхода */}
          {!isCheckingStatus && (
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {userType === "admin" ? (
                    <button
                      onClick={handleUserClick}
                      className="font-medium text-base text-[#999999]"
                    >
                      <User className="text-blue-500 w-8 h-8 cursor-pointer" />
                    </button>
                  ) : (
                    <button
                      onClick={handleUserClick}
                      className="font-medium text-base text-[#999999]"
                    >
                      <User className="text-green-500 w-8 h-8 cursor-pointer" />
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="font-medium text-base text-[#999999]"
                  >
                    <LogOut className="text-[--white] w-8 h-8 cursor-pointer" />
                  </button>
                </>
              ) : (
                <Auth>
                  <User className="text-[--white] w-8 h-8 cursor-pointer" />
                </Auth>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Бургер-меню для мобильных устройств */}
      {isMenuOpen && (
        <>
          {/* Overlay background to dim the rest of the content */}
          <div
            onClick={() => setIsMenuOpen(false)} // Close the menu when clicking outside
            className="fixed inset-0 bg-black opacity-50 z-40"
          ></div>

          <div className="md:hidden flex flex-col items-center py-4 bg-[--dark-blue] fixed top-20 left-0 right-0 z-50">
            {LINKS_ITEM.map((link) => (
              <Link
                key={link.label}
                to={link.href === "contacts" ? "#footer" : link.href} // Проверка для контактов
                className="text-[--white] text-xl py-2"
                onClick={() => handleLinkClick(link.label)} // Обработчик клика
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
