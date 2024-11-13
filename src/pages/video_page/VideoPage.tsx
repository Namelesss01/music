import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import ReactPlayer from "react-player";
import { useAuthStatus } from "../../hooks/useAuthStatus";
import "./video.css";

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, userType, loading, userUid } = useAuthStatus(); // Get auth status
  const [video, setVideo] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userNotFound, setUserNotFound] = useState(false); // New state for user not found error

  useEffect(() => {
    const fetchVideo = async () => {
      if (!isLoggedIn) return; // Don't proceed if user is not logged in
      try {
        if (id) {
          const videoRef = doc(db, "files", id);
          const videoSnap = await getDoc(videoRef);

          if (videoSnap.exists()) {
            const videoData = videoSnap.data();
            setVideo({ id: videoSnap.id, ...videoData });

            // Correctly use user.uid to reference the Firestore document for the logged-in user
            const userRef = doc(db, "users", userUid); // Use userUid here instead of userType
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();
              const hasAccess = userData?.videoAccess || false;
              const hasVocalAccess = userData?.VocalAccess || false; // Check for VocalAccess

              // Admins always have access
              if (
                userType === "admin" ||
                hasAccess ||
                (userType === "student" && hasVocalAccess)
              ) {
                setAccessDenied(false); // Grant access if admin, videoAccess is true, or student with VocalAccess
              } else {
                setAccessDenied(true); // Deny access if not admin, no videoAccess, and student without VocalAccess
              }
            } else {
              console.error("User not found for UID:", userUid);
              setUserNotFound(true); // Set error state if user is not found
            }
          } else {
            console.error("Video not found");
            setError("Video not found");
          }
        } else {
          console.error("Invalid video ID");
          setError("Invalid video ID");
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        setError("An error occurred while fetching the video.");
      }
    };

    fetchVideo();
  }, [id, isLoggedIn, userUid, userType]); // Trigger fetch when login status changes

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
    return <div>{error}</div>;
  }

  if (!video) {
    return <p>Video not found</p>;
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
