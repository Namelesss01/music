import Logo from "../../assets/img/Logo.svg";
import { LINKS_ITEM } from "../header/const";
import { Link } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { ICONS_ITEM } from "./const";

const Footer = () => {
  return (
    <div
      id="footer"
      className="bg-[--dark-blue] w-full flex justify-center items-center mt-[50px] overflow-hidden px-4 py-6"
    >
      <div className="flex flex-col justify-center md:flex-row items-center w-full max-w-screen-lg">
        {/* Logo */}
        <div className="flex justify-center mb-4 md:mb-0 mr-0 md:mr-10">
          <img className="w-[97px] h-[50px]" src={Logo} alt="Logo" />
        </div>

        {/* Separator */}
        <div className="flex justify-center md:block w-full md:w-auto">
          <Separator
            className="w-[130px] h-[2px] md:w-[2px] md:h-[130px] md:mx-6 mb-5 md:mb-0 ml-0 md:mr-12"
            orientation="vertical"
          />
        </div>

        {/* Links and Text */}
        <div className="text-center md:text-left w-full md:w-auto mb-4 md:mb-0">
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
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

        {/* Contact and Icons */}
        <div className="flex flex-col items-center mt-4 md:mt-0 md:ml-[150px]">
          <div className="flex gap-3 mb-3">
            {ICONS_ITEM.map((icon) => (
              <img
                key={icon.icon}
                src={icon.icon}
                alt="icon"
                className="w-6 h-6 text-[--white]"
              />
            ))}
          </div>
          <p className="text-[--white] text-base">Email: qwerty@gmail.com</p>
          <p className="text-[--white] text-base">Phone: +1234567890</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
