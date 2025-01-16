import React from 'react'

import VideoPlayer from "../../components/VideoPlayer";

const TeacherPreview = () => {
     const videoUrl =  "http://localhost:4000/uploads/courses/68540c10-a68a-429b-9a7a-795ebce08365/index.m3u8";
  return (
    <div>
      <VideoPlayer videoUrl={videoUrl}/>
    </div>
  )
}

export default TeacherPreview
