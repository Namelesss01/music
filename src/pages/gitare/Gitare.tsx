import { useEffect, useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import Gitar from "../../assets/img/gitar.jpg";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

const ITEMS_PER_PAGE = 12;

const Gitare = () => {
  const { documents: videos } = useCollection("files", undefined, undefined);

  const [currentPage, setCurrentPage] = useState(1);

  // Filter only videos with the "guitar" category
  const guitarVideos =
    videos?.filter((video) => video.category === "guitar") || [];
  const totalPages = Math.ceil(guitarVideos.length / ITEMS_PER_PAGE);

  const changePage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get videos for the current page
  const currentVideos = guitarVideos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-[1920px] mx-auto">
      <div className="relative">
        <img
          className="w-full h-[750px] mx-auto object-cover md:max-h-[750px] max-h-[500px]"
          src={Gitar}
          alt="Guitar"
        />
      </div>
      <h2 className="text-4xl font-extrabold text-center my-[50px] px-2">
        Уроки игры на гитаре
      </h2>

      <div className="md:flex flex-wrap justify-end gap-6">
        {currentVideos.map((video, index) => (
          <div key={video.id} className="w-full md:w-[calc(33.333%-16px)] p-4">
            <Link to={`/videos/${video.id}`}>
              <img
                src={video.thumbnail || Gitar}
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

export default Gitare;
