import Main_bg from "@/assets/img/main-bg.jpg";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import GitarLink from "../../assets/img/link-gitar.png";
import VocalLink from "../../assets/img/link-vocal.png";
import gitare from "../../assets/img/gitare.png";
import People from "../../assets/img/people.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Input } from "../../components/ui/input";

import { Card, CardContent } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";

const Main = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    { id: 1, content: "Слайд 1", bgColor: "bg-red-500" },
    { id: 2, content: "Слайд 2", bgColor: "bg-green-500" },
    { id: 3, content: "Слайд 3", bgColor: "bg-blue-500" },
    { id: 4, content: "Слайд 4", bgColor: "bg-yellow-500" },
    { id: 5, content: "Слайд 5", bgColor: "bg-purple-500" },
  ];

  const totalSlides = slides.length;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  return (
    <div className="max-w-[1920px] mx-auto">
      <div className="relative">
        <img
          className="w-full max-h-[675px] mx-auto"
          src={Main_bg}
          alt="main"
        />
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
          <p className="absolute top-7 left-7 text-3xl font-bold text-[--white]">
            Уроки игры на гитаре
          </p>
        </div>
        <div className="w-[700px] mr-20 transform transition-transform duration-300 hover:scale-125">
          <img src={VocalLink} alt="" />
          <p className="absolute bottom-8 right-28 text-3xl font-bold text-[--white]">
            Уроки вокала
          </p>
        </div>
      </div>

      <div className="bg-[--dark-blue] h-[575px] w-full flex items-center justify-center relative overflow-hidden">
        <Carousel className="w-full max-w-[1200px] max-h-[500px]">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1 flex justify-center">
                  <Card>
                    <CardContent className="flex h-[500px] w-[1200px] items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <h2 className="text-4xl text-left ml-[50px] mt-10">
        Часто задаваемые вопросы
      </h2>
      <div className="flex justify-between mb-[50px]">
        <div>
          <Accordion
            className="min-w-[850px] mt-[50px] ml-[50px] rounded-lg"
            type="single"
            collapsible
          >
            {["item-1", "item-2", "item-3", "item-4", "item-5"].map(
              (item, index) => (
                <AccordionItem
                  key={item}
                  value={item}
                  className="rounded-lg bg-[--light-blue] px-8 mb-5"
                >
                  <AccordionTrigger className="text-xl">
                    Вопрос {index + 1}
                  </AccordionTrigger>
                  <AccordionContent className="text-xl">
                    Ответ на вопрос {index + 1}.
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        </div>
        <div>
          <img
            className="-mt-24 mr-20 rotate-[17deg] h-[600px]"
            src={gitare}
            alt=""
          />
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <img className="ml-[50px] w-[700px]" src={People} alt="People" />
        </div>
        <div className="px-10 mr-[50px] min-w-[600px] rounded-xl bg-[--white] shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(0,0,0,0.25)]">
          <div className="">
            <h3 className="text-3xl pt-14 pb-8 font-semibold text-center">
              Оставить заявку
            </h3>
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Имя"
            />
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Номер тел:"
            />
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Курс"
            />
          </div>
          <div className="flex justify-center">
            <Button className="mt-8">Отправить</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
