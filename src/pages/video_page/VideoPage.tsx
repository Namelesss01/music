import { useParams } from "react-router-dom";
import { VIDEO_ITEM } from "../vocal/const"; 

const VideoPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const videoIndex = parseInt(id, 10);
  const video = VIDEO_ITEM[videoIndex];

  if (!video) {
    return <p>Video not found</p>;
  }

  return (
    <div className="max-w-[1920px] mx-auto p-6">
      <div className="video-container mb-6 flex justify-center">
        <iframe
          width="1920px"
          height="450px"
          src={video.video}
          title={video.title}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">{video.title}</h1>
      <p className="text-lg text-center">
        Описание видео: Это описание видео, которое вы выбрали.
      </p>
    </div>
  );
};

export default VideoPage;
