import Main_bg from "@/assets/img/main-bg.jpg";
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

const Main = () => {
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
          Почувстуй магию музыки прямо сейчас
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

      <div className="bg-[--dark-blue] h-[575px] w-full"></div>
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
            <AccordionItem
              value="item-1"
              className="rounded-lg bg-[--light-blue] px-8 mb-5"
            >
              <AccordionTrigger className="text-xl">
                Is it accessible?
              </AccordionTrigger>
              <AccordionContent className="text-xl">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              className="rounded-lg bg-[--light-blue] px-8 mb-5"
            >
              <AccordionTrigger className="text-xl">
                Is it accessible?
              </AccordionTrigger>
              <AccordionContent className="text-xl">
                no. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-3"
              className="rounded-lg bg-[--light-blue] px-8 mb-5"
            >
              <AccordionTrigger className="text-xl">
                Is it accessible?
              </AccordionTrigger>
              <AccordionContent className="text-xl">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-4"
              className="rounded-lg bg-[--light-blue] px-8 mb-5"
            >
              <AccordionTrigger className="text-xl">
                Is it accessible?
              </AccordionTrigger>
              <AccordionContent className="text-xl">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-5"
              className="rounded-lg bg-[--light-blue] px-8 mb-5"
            >
              <AccordionTrigger className="text-xl">
                Is it accessible?
              </AccordionTrigger>
              <AccordionContent className="text-xl">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
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
            ></Input>
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Номер тел:"
            ></Input>
            <Input
              className="bg-[--light-blue] mb-5 p-6 text-lg"
              placeholder="Курс"
            ></Input>
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
