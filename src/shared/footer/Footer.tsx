import Logo from "../../assets/img/Logo.svg";
import { LINKS_ITEM } from "../header/const";
import { Link } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { ICONS_ITEM } from "./const";

const Footer = () => {
  return (
    <div
      id="footer"
      className="bg-[--dark-blue] h-[200px] w-full flex justify-center items-center mt-[50px]"
    >
      <div>
        <img className="" src={Logo} alt="" />
      </div>
      <div>
        <Separator
          className="w-[2px] h-[130px] ml-[150px]"
          orientation="vertical"
        />
      </div>
      <div className="ml-[150px]">
        <div className="flex gap-4">
          {LINKS_ITEM.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[--white] text-base"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-[--white] text-base">© 2024 Music. Just do it.</p>
      </div>
      <div>
        <div className="ml-[150px]">
          <div className="flex gap-3">
            {ICONS_ITEM.map((icon) => (
              <img
                key={icon.icon}
                src={icon.icon}
                alt="icon"
                className="w-6 h-6 text-[--white]"
              />
            ))}
          </div>
          <p className="text-[--white] text-base my-3">
            Email: qwerty@gmail.com
          </p>
          <p className="text-[--white] text-base">Phone: +1234567890</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
