import { useState } from "react";
import { SquarePlus, CheckCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { storage, db } from "../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const AddFile = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setShowConfirmation(false);

    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {
        setIsLoading(true); // Show spinner during upload
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "files"), {
          name,
          description,
          destination,
          category,
          url: downloadURL,
          createdAt: Timestamp.now(),
        });

        setIsLoading(false);
        setUploadSuccess(true); // Show success message
        setFile(null);
        setName("");
        setDescription("");
        setDestination("");
      }
    );
  };

  return (
    <div className="flex justify-center my-[100px]">
      <form onSubmit={(e) => e.preventDefault()} className="md:flex px-16">
        <div className="max-w-[750px] md:w-[700px] border-2 border-dashed border-[#AFAFAF] bg-white/50 p-6 rounded-lg text-center min-h-[300px] md:mx-[50px]">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center mt-11 mb-3 space-y-2"
          >
            {file ? (
              <CheckCircle className="text-center text-green-500" size={30} />
            ) : (
              <SquarePlus className="text-center text-[#1875F0]" size={30} />
            )}
            <span className="text-[#333333] text-base fond-medium">
              {file ? "Файл выбран" : "Добавить фото или видео"}
            </span>
            <span className="text-[#333333] text-xs fond-medium pt-4">
              Формат файла:
            </span>
            <span className="text-[#a2a2a2] text-xs">AVI, MP4, JPG, PNG</span>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="sr-only"
              accept="video/*,image/*"
            />
          </label>
        </div>
        <div className="min-w-[350px] mt-4">
          <Input
            placeholder="Наименование"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg bg-[--light-blue] px-3 mb-8"
          />
          <Select
            onValueChange={(value) => setCategory(value)}
            className="rounded-lg mb-8"
          >
            <SelectTrigger className="bg-[--light-blue] text-black px-3 py-2 rounded-lg border border-gray-300">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
              <SelectGroup>
                <SelectItem
                  value="vocals"
                  className="px-4 py-2 hover:bg-[--light-blue] cursor-pointer"
                >
                  Vocals
                </SelectItem>
                <SelectItem
                  value="guitar"
                  className="px-4 py-2 hover:bg-[--light-blue] cursor-pointer"
                >
                  Guitar
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Краткое описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg bg-[--light-blue] px-3 mt-8 resize-y min-h-[100px]"
          />
          <div className="flex justify-center mt-8">
            <Button onClick={handleAddClick}>Добавить</Button>
          </div>
        </div>
      </form>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] text-center">
            <h2 className="text-xl font-bold mb-4">Подтвердите загрузку</h2>
            <p>Наименование: {name}</p>
            <p>Категория: {category}</p>
            <p>Описание: {description}</p>
            {file && <p>Файл: {file.name}</p>}
            <div className="flex justify-center mt-4 space-x-4">
              <Button onClick={handleConfirmUpload} disabled={isLoading}>
                Подтвердить
              </Button>
              <Button onClick={() => setShowConfirmation(false)}>Отмена</Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[200px] text-center">
            <div className="loader spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
            <p className="mt-4">Загрузка...</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[300px] text-center">
            <h2 className="text-xl font-bold text-green-500 mb-4">Успешно!</h2>
            <p>Файл успешно загружен.</p>
            <Button onClick={() => setUploadSuccess(false)} className="mt-4">
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFile;
