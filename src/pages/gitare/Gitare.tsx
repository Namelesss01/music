import Gitar from "../../assets/img/gitar.jpg";

import { useState } from "react";
import { VIDEO_ITEM } from "./const";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

const ITEMS_PER_PAGE = 12; 

const Gitare = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(VIDEO_ITEM.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVideos = VIDEO_ITEM.slice(startIndex, endIndex);

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
          src={Gitar}
          alt="Vocal"
        />
      </div>
      <h2 className="text-4xl font-extrabold text-center my-[50px]">
        Уроки игры на гитаре
      </h2>

      <div className="flex flex-wrap justify-between gap-6">
        {currentVideos.map((video) => (
          <div
            key={video.title}
            className="flex flex-col items-center w-[calc(30%-12px)]"
          >
            <iframe
              width="100%"
              height="315"
              src={video.video}
              title="video player"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
            <p className="text-center mt-3">{video.title}</p>
          </div>
        ))}
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
              <PaginationEllipsis className="py-2 px-4 text-[--black] font-bold rounded-md border border-[--light-blue]"></PaginationEllipsis>
            </PaginationItem>
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
