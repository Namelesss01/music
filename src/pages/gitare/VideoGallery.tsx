// Import necessary dependencies
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config"; // Import Firestore database
import Play from "@/assets/icon/play.svg"; // Import your play icon

// Define a type for video items
type VideoItem = {
  id: string;
  video: string;
  icon: string;
  title: string;
};

const VideoGallery = () => {
  // Initialize videos state with the VideoItem type
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    // Subscribe to Firestore collection updates
    const unsubscribe = onSnapshot(collection(db, "videos"), (snapshot) => {
      const videoList: VideoItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        video: doc.data().url as string, // Explicitly cast URL to string
        icon: Play,
        title: (doc.data().title as string) || "Untitled", // Explicitly cast title to string
      }));
      setVideos(videoList);
      console.log(snapshot.docs.map((doc) => doc.data()));
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="video-gallery">
      {videos.map((video) => (
        <div key={video.id} className="video-item">
          <h3>{video.title}</h3>
          <video src={video.video} controls width="300" />
        </div>
      ))}
    </div>
  );
};

export default VideoGallery;
