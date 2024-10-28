import { SquarePlus } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";

const AddFile = () => {
  return (
    <div>
      <div className="flex justify-center my-[100px]">
        <div className="border-2 border-dashed border-[#AFAFAF] bg-white/50 p-6 rounded-lg text-center w-[700px] min-h-[300px] mx-[50px]">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center mt-11 mb-3 space-y-2"
          >
            <SquarePlus className="text-center text-[#1875F0]" size={30} />
            <span className="text-[#333333] text-base fond-medium">
              Добавить фото или видео
            </span>
            <span className="text-[#333333] text-xs fond-medium pt-4">
              Формат файла:
            </span>
            <span className="text-[#a2a2a2] text-xs">AVI, MP4, JPG, PNG</span>
            <input id="file-upload" type="file" className="sr-only" />
          </label>
        </div>
        <div className="min-w-[350px]">
          <Input
            placeholder="Наименование"
            className="rounded-lg bg-[--light-blue] px-3 mb-8"
          ></Input>
          <Select>
            <SelectTrigger className="rounded-lg bg-[--light-blue] text-muted-foreground px-3 mb-8">
              <SelectValue placeholder="Выберите куда будет направлен файл " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Выберите куда будет направлен файл </SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Краткое описание"
            className="rounded-lg bg-[--light-blue] px-3 mb-8 resize-y min-h-[100px]"
          ></Textarea>
          <div className="flex justify-center">
            <Button className="">Добавить</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFile;
