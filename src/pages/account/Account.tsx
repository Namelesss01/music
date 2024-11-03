import { Input } from "../../components/ui/input";
import GitareIcon from "../../assets/icon/gitare-icon.svg";
import Microphone from "../../assets/icon/microphone-icon.svg";
import  User  from "../../assets/icon/user-icon.svg";
const Account = () => {
  return (
    <div className="flex justify-center items-end my-[70px] bg-[--white]">
      <div className="md:flex gap-[70px]">
        <div className="bg-gray-300 w-[300px] h-[400px] rounded-md flex ml-24 md:ml-0 items-center justify-center mb-10">
          <img src={User} alt="" />
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <Input
              type="text"
              className="rounded-md h-12 text-lg bg-[--light-blue] w-[500px] p-2 mb-4"
              placeholder="ФИО"
            ></Input>
          </div>

          <div>
            <Input
              type="text"
              className="rounded-md h-12 text-lg bg-[--light-blue] w-[500px] p-2 mb-6"
              placeholder="Номер:"
            ></Input>
          </div>

          <div className="text-center">
            <p className="text-[--brown] text-xl mb-3">Доступ к курсам</p>
            <div className="flex justify-center gap-7">
              <div className="relative flex items-center bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
                <img
                  src={Microphone}
                  className="absolute left-4 top-[7px]"
                  alt=""
                />
                <span className="text-[--white] font-bold py-3 px-10 ml-14 text-xl">
                  Вокал
                </span>
              </div>

              <div className="relative flex items-center bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
                <img src={GitareIcon} className="absolute top-[3px]" alt="" />
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
