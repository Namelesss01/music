import Main_bg from "@/assets/img/main-bg.jpg";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import GitarLink from "../../assets/img/link-gitar.png";
import VocalLink from "../../assets/img/link-vocal.png";
import People from "../../assets/img/people.png";
import gitare from "../../assets/img/gitare.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Input } from "../../components/ui/input";
import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Link } from "react-router-dom";
import { FormEvent } from "react";

const Main = () => {
  const formRef = useRef<HTMLDivElement>(null); // Указываем тип HTMLDivElement

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

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
    <div className="max-w-[1920px] mx-auto overflow-hidden">
      <div
        className="relative h-[400px] md:h-[675px] bg-cover bg-center "
        style={{ backgroundImage: `url(${Main_bg})` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[--white]">
          <h1 className="text-5xl md:text-6xl font-extrabold">Школа Музыки</h1>
          <h2 className="mt-4 text-xl md:text-3xl font-medium">
            Почувствуй магию музыки прямо сейчас
          </h2>
          <Button
            className="mt-8 text-lg font-medium px-10 py-5"
            onClick={handleScrollToForm}
          >
            Начать
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center my-14 space-y-10 md:space-y-0 md:space-x-10 relative">
        {/* Уроки игры на гитаре */}
        <Link to="/gitare">
          <div className="w-full md:w-[700px] transform transition-transform duration-300 hover:scale-125">
            <img src={GitarLink} alt="Гитара" className="w-full" />
            <p className="absolute top-7 left-7 text-3xl font-bold text-[--white]">
              Уроки игры на гитаре
            </p>
          </div>
        </Link>
        {/* Уроки вокала */}
        <Link to="/vocal">
          <div className="w-full md:w-[700px] transform transition-transform duration-300 hover:scale-125">
            <img src={VocalLink} alt="Вокал" className="w-full" />
            <p className="absolute bottom-8 right-28 text-3xl font-bold text-[--white]">
              Уроки вокала
            </p>
          </div>
        </Link>
      </div>
      <div className="bg-[--dark-blue] h-[575px] w-full flex items-center justify-center relative overflow-hidden">
        <Carousel className="w-full max-w-[1200px] max-h-[500px]">
          <CarouselContent>
            {[
              "https://avatars.mds.yandex.net/i?id=9c0c7e3cfb343bd161dc1169947b49ec_l-4766454-images-thumbs&n=13",
              "https://avatars.mds.yandex.net/i?id=9c0c7e3cfb343bd161dc1169947b49ec_l-4766454-images-thumbs&n=13",
              "https://avatars.mds.yandex.net/i?id=9c0c7e3cfb343bd161dc1169947b49ec_l-4766454-images-thumbs&n=13",
              "https://avatars.mds.yandex.net/i?id=9c0c7e3cfb343bd161dc1169947b49ec_l-4766454-images-thumbs&n=13",
              "https://avatars.mds.yandex.net/i?id=9c0c7e3cfb343bd161dc1169947b49ec_l-4766454-images-thumbs&n=13",
            ].map((url, index) => (
              <CarouselItem key={index}>
                <div className="p-1 flex relative">
                  <img
                    src={url}
                    alt="Почему музыка важна"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <h2 className="text-white text-3xl md:text-4xl font-bold text-center">
                      Почему музыка важна
                    </h2>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between w-full absolute bottom-1 transform -translate-y-1/2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>

      <h2 className="text-4xl text-left ml-[50px] mt-10">
        Часто задаваемые вопросы
      </h2>
      <div className="flex flex-col md:flex-row justify-between mb-[50px]">
        <div>
          <Accordion
            className="min-w-full mt-[50px] md:ml-[50px] rounded-lg"
            type="single"
            collapsible
          >
            {[
              {
                question:
                  "Я совсем новичок. Смогу ли я освоить вокал/гитару с нуля на этом курсе?",
                answer:
                  "Да, курс подходит для начинающих. Мы начинаем с основ и постепенно переходим к более сложным техникам. Вам не обязательно иметь музыкальный опыт — главное, это желание учиться и практика.",
              },
              {
                question:
                  "Как проходит обучение: это онлайн-курс или живые занятия?",
                answer:
                  "Курс проходит онлайн, поэтому вы можете учиться из любого места с доступом к интернету. Уроки будут в виде живых трансляций или записей, а также будут доступны дополнительные материалы, чтобы можно было повторять пройденное в удобное время.",
              },
              {
                question:
                  "Нужен ли мне профессиональный инструмент или можно начать с бюджетного?",
                answer:
                  "Для начинающих подойдет и недорогая гитара, главное, чтобы инструмент был настроен и удобен для вас. Также, если вы занимаетесь вокалом, профессиональное оборудование не обязательно — достаточно наушников с микрофоном для обратной связи с преподавателем.",
              },
              {
                question:
                  "Сколько времени нужно заниматься, чтобы увидеть результаты?",
                answer:
                  "Прогресс зависит от вашей практики. Обычно заметные улучшения можно увидеть через 2-3 недели регулярных занятий. Рекомендуется уделять практике хотя бы 20–30 минут в день для достижения стабильных результатов.",
              },
              {
                question: "Получим ли мы сертификат по окончании курса?",
                answer:
                  "Да, по завершении курса вы получите сертификат, подтверждающий ваши навыки и успехи в вокале или игре на гитаре. Сертификат будет отличным дополнением к вашему портфолио или резюме.",
              },
            ].map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="rounded-lg bg-[--light-blue] px-8 mb-5 max-w-[800px]"
              >
                <AccordionTrigger className="text-xl">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-xl max-h-[150px] overflow-y-auto">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="hidden md:flex w-full md:w-[500px] -mt-10 transform md:rotate-[17deg]">
          <div className="relative perspective-1000">
            <img
              className="h-[400px] md:h-[600px] transform transition-all duration-300 ease-in-out hover:rotate-x-12 hover:rotate-y-12 hover:scale-110"
              src={gitare}
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-4" ref={formRef}>
        {" "}
        {/* Присваиваем форму ссылке formRef */}
        <div className="hidden md:flex">
          <img className="ml-[50px] w-[700px]" src={People} alt="People" />
        </div>
        <div className="px-10 mr-[10px] min-w-[300px] md:min-w-[600px] rounded-xl bg-[--white] shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(0,0,0,0.25)] ml-3 md:ml-0">
          <h3 className="text-3xl pt-14 pb-8 font-semibold text-center">
            Оставить заявку
          </h3>
          <form onSubmit={handleSubmit}>
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Имя"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Номер тел:"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Курс"
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
            />
            <div className="flex justify-center mb-4">
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
