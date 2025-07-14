import React from "react";

export const YouTubePlayer = ({ tracks }) => {
  if (!tracks || tracks.length === 0) return <p>Không có bài nhạc phù hợp.</p>;

  const { id, snippet } = tracks;
  const { title } = snippet
  return (
    <div className="space-y-6">
        <div key={id}>
          <h4 className="font-semibold text-base mb-2">{title}</h4>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${id.videoId}?autoplay=1&controls=1`}
            title={`YouTube Player - ${title}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: "none" }}  
          ></iframe>
        </div>
    </div>
  );
};
