import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import Vocals from "@/assets/img/vocal.jpg";
import { Link } from "react-router-dom";
import Play from "@/assets/icon/play.svg";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

const ITEMS_PER_PAGE = 12;

interface Video {
  id: string;
  url: string;
  name: string;
  category: string;
  thumbnail?: string;
  description?: string;
}

const Vocal = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchVideos = () => {
      const videosRef = collection(db, "files");
      const q = query(videosRef, where("category", "==", "vocals"));

      onSnapshot(q, (snapshot) => {
        const loadedVideos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[];
        setVideos(loadedVideos);
      });
    };

    fetchVideos();
  }, []);

  const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);
  const currentVideos = videos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto">
      <div className="relative">
        <img
          className="w-full h-[750px] mx-auto object-cover"
          src={Vocals}
          alt="Vocal"
        />
      </div>
      <h2 className="text-4xl font-extrabold text-center my-[50px]">
        Уроки вокальной музыки
      </h2>

      <div className="flex flex-wrap justify-start gap-6">
        {currentVideos.map((video, index) => (
          <div key={video.id} className="w-full md:w-[calc(33.333%-16px)] p-4">
            <Link to={`/videos/${video.id}`}>
              <img
                src={video.thumbnail || Vocals}
                alt={video.name}
                className="w-full h-auto"
              />
              <h3 className="text-lg font-bold mt-2 text-center">
                {video.name}
              </h3>
              <p className="text-center">{video.description}</p>
            </Link>
          </div>
        ))}

        {/* Placeholder if only 2 videos are in the row */}
        {currentVideos.length % 3 === 2 && (
          <div className="w-full md:w-[calc(33.333%-16px)] p-4 invisible">
            {/* Empty div for spacing */}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-10">
        <Pagination>
          <PaginationContent className="flex gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => changePage(currentPage - 1)}
                size="md"
                className="text-white bg-[--light-blue] py-2 px-4 rounded-md hover:bg-[--dark-blue] transition-colors hover:text-white"
              />
            </PaginationItem>
            {[...Array(totalPages).keys()].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => changePage(index + 1)}
                  size="md"
                  className={`py-2 px-4 rounded-md transition-colors ${
                    currentPage === index + 1
                      ? "bg-[--light-blue] text-white"
                      : "text-black bg-[--white] hover:bg-[--light-blue] hover:text-white"
                  }`}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => changePage(currentPage + 1)}
                size="md"
                className="text-white bg-[--light-blue] py-2 px-4 rounded-md hover:bg-[--dark-blue] transition-colors hover:text-white"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Vocal;
