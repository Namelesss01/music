import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { db } from "../../firebase/config"; // Ensure the path is correct
import { doc, getDoc } from "firebase/firestore";
import ReactPlayer from "react-player"; // Import ReactPlayer
import "./video.css";

const VideoPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the video ID from the URL
  const [video, setVideo] = useState<any>(null); // Change type to any for flexibility
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        if (id) { // Check if id is not undefined
          const docRef = doc(db, "files", id); // Reference to the video document
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            setVideo({ id: docSnap.id, ...docSnap.data() }); // Set the video data
          } else {
            console.error("Video not found");
          }
        } else {
          console.error("Video ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching video: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return <div className="loader">Loading...</div>; // Optional loading state
  }

  if (!video) {
    return <p>Video not found</p>; // Display error message
  }

  return (
    <div className="video-page max-w-[1920px] mx-auto p-6">
      <div className="video-container mb-6 relative flex justify-center">
        <ReactPlayer
          url={video.url} // Use the URL from Firestore
          className="react-player"
          width="100%"
          height="450px"
          controls // Show native controls
          playing={false} // Set to true if you want to autoplay
          muted={true} // Required for autoplay in most browsers
          onReady={() => console.log("Player is ready")}
          onEnded={() => console.log("Video has ended")}
          config={{
            youtube: {
              playerVars: { showinfo: 1 }, // Show YouTube info
            },
            file: {
              tracks: [
                {
                  kind: "subtitles",
                  src: "subs/subtitles.en.vtt",
                  srcLang: "en",
                  label: "English subtitles", // Add a label property
                  default: true,
                },
              ],
            },
          }}
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
