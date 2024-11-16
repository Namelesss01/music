import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStatus } from "../../hooks/useAuthStatus";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { LINKS_ITEM } from "./const";
import Logo from "@/assets/img/Logo-head.svg";
import { User, LogOut } from "lucide-react";
import { Auth } from "../authorization/Auth";

const Header = () => {
  const { isLoggedIn, userType, loading } = useAuthStatus();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUserClick = () => {
    navigate(userType === "admin" ? "/account-admin" : "/account");
  };

  const scrollToFooter = () => {
    const footerElement = document.getElementById("footer");
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLinkClick = (label: string) => {
    if (label === "Контакты") scrollToFooter();
    setIsMenuOpen(false);
  };

  const handleProtectedNavigation = (path: string) => {
    if (!isLoggedIn) {
      setShowPopup(true);
    } else {
      navigate(path);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      closePopup();
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showPopup]);

  return (
    <div className="bg-[--dark-blue] overflow-hidden">
      <div className="flex justify-between items-center w-full py-5 px-10">
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>

        <div className="hidden md:flex gap-12">
          {LINKS_ITEM.map((link) =>
            ["Вокал", "Гитара"].includes(link.label) ? (
              <button
                key={link.label}
                onClick={() => handleProtectedNavigation(link.href)}
                className="text-[--white] text-xl"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-[--white] text-xl"
                onClick={() => handleLinkClick(link.label)}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <button
              className="text-white text-3xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <span>&#10005;</span> : <span>&#9776;</span>}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="spinner border-t-4 border-white w-8 h-8 rounded-full animate-spin"></div>
            ) : isLoggedIn ? (
              <>
                <button
                  onClick={handleUserClick}
                  className="font-medium text-base"
                >
                  <User
                    className={`w-8 h-8 cursor-pointer ${
                      userType === "admin" ? "text-blue-500" : "text-green-500"
                    }`}
                  />
                </button>
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
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black opacity-50 z-40"
          ></div>

          <div className="md:hidden flex flex-col items-center py-4 bg-[--dark-blue] fixed top-20 left-0 right-0 z-50">
            {LINKS_ITEM.map((link) =>
              ["Вокал", "Гитара"].includes(link.label) ? (
                <button
                  key={link.label}
                  onClick={() => handleProtectedNavigation(link.href)}
                  className="text-[--white] text-xl py-2"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href === "contacts" ? "#footer" : link.href}
                  className="text-[--white] text-xl py-2"
                  onClick={() => handleLinkClick(link.label)}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={popupRef}
            className="bg-white p-6 rounded-lg shadow-lg relative"
          >
            <h2 className="text-xl font-bold ">
              Пожалуйста, зарегистрируйтесь
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
