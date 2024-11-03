import { Input } from "../../components/ui/input";
import GitareIcon from "../../assets/icon/gitare-icon.svg";
import Microphone from "../../assets/icon/microphone-icon.svg";
import User from "../../assets/icon/user-icon.svg";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"; // Import radio group components
import { Button } from "../../components/ui/button";

const students = [
  { id: 1, name: "Иванова Анна Игоревна" },
  { id: 2, name: "Галкин Адам Станиславович" },
  { id: 3, name: "Злобина Маргарита Георгиевна" },
  { id: 4, name: "Николаев Тимофей Даниилович" },
];

const AdminAccount = () => {
  return (
    <div>
      <div className="flex justify-center items-end my-[70px] bg-[--white]">
        <div className="md:flex items-center gap-[70px]">
          <div className="bg-gray-300 w-[300px] h-[400px] rounded-md ml-24 md:ml-0 flex items-center justify-center mb-10">
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

            <div>
              <Textarea
                className="rounded-md h-12 text-lg bg-[--light-blue] w-[500px] p-2 mb-6"
                placeholder="Инормация:"
              ></Textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <p className="text-4xl mb-10">Список учеников и доступ и урокам</p>
      </div>
      <div>
        <Table>
          <TableCaption>
            <Button>Сохранить изменения</Button>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Номер</TableHead>
              <TableHead className="text-center">ФИО Учеников</TableHead>
              <TableHead className="text-center">Вокал</TableHead>
              <TableHead className="text-center">Гитара</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="text-center">{student.id}</TableCell>
                <TableCell className="text-center">{student.name}</TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-center">
                    <Checkbox id="terms" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox id="terms" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAccount;
