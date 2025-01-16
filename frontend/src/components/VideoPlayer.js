// import React, { useRef, useEffect } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";


// export const VideoPlayer = (props) => {
//     const videoRef = useRef(null);
//     const playerRef = useRef(null);
//     const { options, onReady } = props;
  
//     useEffect(() => {
//       // Make sure Video.js player is only initialized once
//       if (!playerRef.current) {
//         // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
//         const videoElement = document.createElement("video-js");
  
//         videoElement.classList.add("vjs-big-play-centered");
//         videoRef.current.appendChild(videoElement);
  
//         const player = (playerRef.current = videojs(videoElement, options, () => {
//           videojs.log("player is ready");
//           onReady && onReady(player);
//         }));
  
//         // You could update an existing player in the `else` block here
//         // on prop change, for example:
//       } else {
//         const player = playerRef.current;
  
//         player.autoplay(options.autoplay);
//         player.src(options.sources);
//       }
//     }, [options, videoRef]);
  
//     // Dispose the Video.js player when the functional component unmounts
//     useEffect(() => {
//       const player = playerRef.current;
  
//       return () => {
//         if (player && !player.isDisposed()) {
//           player.dispose();
//           playerRef.current = null;
//         }
//       };
//     }, [playerRef]);
  
//     return (
//       <div
//         data-vjs-player
//         style={{ width: "600px" }}
//       >
//         <div ref={videoRef} />
//       </div>
//     );
// };

// export default VideoPlayer;



import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      // Create a Video.js player instance
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-default-skin", "vjs-big-play-centered");

      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        responsive: true,
      });

      playerRef.current.src({
        src: videoUrl,
        type: "application/x-mpegURL", // MIME type for HLS
      });
    } else {
      // Update the player if videoUrl changes
      playerRef.current.src({
        src: videoUrl,
        type: "application/x-mpegURL",
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose(); // Dispose the player instance
        playerRef.current = null;
      }
    };
  }, [videoUrl]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }} />
    </div>
  );
};

export default VideoPlayer;
