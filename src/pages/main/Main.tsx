import Main_bg from "@/assets/img/main-bg.jpg";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import GitarLink from "../../assets/img/link-gitar.png";
import VocalLink from "../../assets/img/link-vocal.png";
import gitare from "../../assets/img/gitare.png";
import People from "../../assets/img/people.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Input } from "../../components/ui/input";
import { db } from "../../firebase/config"; // Импортируем db
import { collection, addDoc } from "firebase/firestore"; // Импортируем Firestore функции

const Main = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Слайды для карусели
  const slides = [
    { id: 1, content: "Слайд 1", bgColor: "bg-red-500" },
    { id: 2, content: "Слайд 2", bgColor: "bg-green-500" },
    { id: 3, content: "Слайд 3", bgColor: "bg-blue-500" },
    { id: 4, content: "Слайд 4", bgColor: "bg-yellow-500" },
    { id: 5, content: "Слайд 5", bgColor: "bg-purple-500" },
  ];

  const totalSlides = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault(); // предотвращаем перезагрузку страницы
    setIsSubmitting(true); // начинаем отправку

    try {
      // Добавляем данные в коллекцию Firestore
      await addDoc(collection(db, "applications"), formData);
      alert("Заявка успешно отправлена!");

      // Очищаем форму после отправки
      setFormData({ name: "", phone: "", course: "" });
    } catch (error) {
      console.error("Ошибка при отправке заявки: ", error);
      alert("Ошибка при отправке заявки. Попробуйте снова.");
    }

    setIsSubmitting(false); // завершаем отправку
  };

  return (
    <div className="max-w-[1920px] mx-auto">
      <div className="relative">
        <img className="w-full max-h-[675px] mx-auto" src={Main_bg} alt="main" />
        <h1 className="absolute top-[210px] left-[50%] translate-x-[-50%] text-6xl font-extrabold text-[--white]">
          Школа Музыки
        </h1>
        <h2 className="font-medium absolute top-[390px] left-[50%] translate-x-[-50%] text-3xl text-[--white]">
          Почувствуй магию музыки прямо сейчас
        </h2>
        <Button className="absolute top-[450px] left-[50%] translate-x-[-50%] text-lg font-medium px-10 py-5">
          Начать
        </Button>
      </div>

      <div className="flex justify-center my-14 relative">
        <div className="w-[700px] ml-20 transform transition-transform duration-300 hover:scale-125">
          <img src={GitarLink} alt="" />
          <p className="absolute top-7 left-7 text-3xl font-bold text-[--white]">Уроки игры на гитаре</p>
        </div>
        <div className="w-[700px] mr-20 transform transition-transform duration-300 hover:scale-125">
          <img src={VocalLink} alt="" />
          <p className="absolute bottom-8 right-28 text-3xl font-bold text-[--white]">Уроки вокала</p>
        </div>
      </div>

      <h2 className="text-4xl text-left ml-[50px] mt-10">Часто задаваемые вопросы</h2>
      <div className="flex justify-between mb-[50px]">
        <div>
          <Accordion className="min-w-[850px] mt-[50px] ml-[50px] rounded-lg" type="single" collapsible>
            {/* Accordion items */}
          </Accordion>
        </div>
        <div>
          <img className="-mt-24 mr-20 rotate-[17deg] h-[600px]" src={gitare} alt="" />
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <img className="ml-[50px] w-[700px]" src={People} alt="People" />
        </div>
        <div className="px-10 mr-[50px] min-w-[600px] rounded-xl bg-[--white] shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(0,0,0,0.25)]">
          <h3 className="text-3xl pt-14 pb-8 font-semibold text-center">Оставить заявку</h3>
          <form onSubmit={handleSubmit}>
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Имя"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Номер тел:"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Курс"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            />
            <div className="flex justify-center">
              <Button type="submit" className="mt-8" disabled={isSubmitting}>
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Main;
