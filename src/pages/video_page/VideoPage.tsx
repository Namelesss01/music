import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import ReactPlayer from "react-player";
import { useAuthStatus } from "../../hooks/useAuthStatus";
import "./video.css";

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, userType, loading, userUid } = useAuthStatus();
  const [video, setVideo] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!isLoggedIn || loading) return; // Wait until user status is loaded
      try {
        if (!id) {
          setError("Invalid video ID");
          return;
        }

        // Получение данных о видео
        const videoRef = doc(db, "files", id);
        const videoSnap = await getDoc(videoRef);
        if (!videoSnap.exists()) {
          setError("Video not found");
          return;
        }

        const videoData = videoSnap.data();
        setVideo({ id: videoSnap.id, ...videoData });

        // Получение данных о пользователе для проверки доступа
        const userRef = doc(db, "users", userUid || "");
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          setUserNotFound(true);
          return;
        }

        const userData = userSnap.data();
        const hasGeneralAccess = userData?.videoAccess || false;
        const hasVocalAccess = userData?.vocalAccess || false;
        const hasGuitarAccess = userData?.guitarAccess || false;

        // Проверка доступа в зависимости от типа пользователя и категории видео
        const videoCategory = videoData.category || "";
        if (
          userType === "admin" ||
          hasGeneralAccess ||
          (videoCategory === "vocals" && hasVocalAccess) ||
          (videoCategory === "guitar" && hasGuitarAccess)
        ) {
          setAccessDenied(false); // Доступ разрешен
        } else {
          setAccessDenied(true); // Доступ запрещен
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        setError("An error occurred while fetching the video.");
      }
    };

    fetchVideo();
  }, [id, isLoggedIn, userUid, userType, loading]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (userNotFound) {
    return (
      <div className="user-not-found text-center text-red-500 font-bold text-xl">
        User not found, please check your login status or contact support.
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="access-denied text-center text-red-500 font-bold text-xl">
        НЕТ ДОСТУПА
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message text-center text-red-500">{error}</div>
    );
  }

  if (!video) {
    return <p className="text-center">Щя щя погоди щя ищу</p>;
  }

  return (
    <div className="video-page max-w-[1920px] mx-auto p-6">
      <div className="video-container mb-6 relative flex justify-center">
        <ReactPlayer
          url={video.url}
          className="react-player"
          width="100%"
          height="450px"
          controls
          playing={false}
          muted={true}
        />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">{video.name}</h1>
      <p className="text-lg text-center">
        Описание видео: {video.description || "Описание отсутствует."}
      </p>
    </div>
  );
};

export default VideoPage;
