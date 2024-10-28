import { LINKS_ITEM } from "./const";
import Logo from "@/assets/img/Logo-head.svg";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
const Header = () => {
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
        <Link to="/account-admin">
          <User className="w-8 h-8 text-[--white]" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
