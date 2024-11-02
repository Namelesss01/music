import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import User from "../../assets/icon/user-icon.svg";


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
import { Button } from "../../components/ui/button";

type Student = {
  id: string;
  name: string;
};

const AdminAccount = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Create a query to fetch only students with the status of "student"
    const studentQuery = query(
      collection(db, "users"),
      where("status", "==", "student")
    );

    // Listen to Firestore updates in real time
    const unsubscribe = onSnapshot(studentQuery, (snapshot) => {
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name as string, // Ensure name is a string
      }));
      setStudents(studentList);
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  return (
    <div>
      <div className="flex justify-center items-end my-[70px] bg-[--white]">
        <div className="flex items-center gap-[70px]">
          <div className="bg-gray-300 w-[300px] h-[400px] rounded-md flex items-center justify-center">
            <img src={User} alt="" />
          </div>

          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              className="rounded-md h-12 text-lg bg-[--light-blue] w-[500px] p-2 mb-4"
              placeholder="ФИО"
            />
            <Input
              type="text"
              className="rounded-md h-12 text-lg bg-[--light-blue] w-[500px] p-2 mb-6"
              placeholder="Номер:"
            />
            <Textarea
              className="rounded-md h-12 text-lg bg-[--light-blue] w-[500px] p-2 mb-6"
              placeholder="Информация:"
            />
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
            {students.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{student.name}</TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-center">
                    <Checkbox id={`vocal-access-${student.id}`} />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox id={`guitar-access-${student.id}`} />
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
