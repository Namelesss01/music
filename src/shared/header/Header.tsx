import { LINKS_ITEM } from "./const";
import Logo from "@/assets/img/Logo-head.svg";
import { User, LogOut } from "lucide-react"; // Import LogOut icon
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../authorization/Auth";
import { useAuthStatus } from "../../hooks/useAuthStatus";
import { signOut } from "firebase/auth"; // Import signOut function
import { auth } from "../../firebase/config"; // Import Firebase auth instance

const Header = () => {
  const { isLoggedIn, userType, isCheckingStatus } = useAuthStatus(); // Get userType from auth status
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out user
      navigate("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      if (userType === "admin") {
        navigate("/account-admin"); // Redirect to admin account
      } else {
        navigate("/account"); // Redirect to user account
      }
    }
  };

  return (
    <div className="bg-[--dark-blue]">
      <div className="flex justify-between items-center w-full py-5 px-10">
        <div>
          <img src={Logo} alt="logo" />
        </div>
        <div className="flex gap-12">
          {LINKS_ITEM.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[--white] text-xl"
            >
              {link.label}
            </Link>
          ))}
        </div>

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
  );
};

export default Header;
