import React from "react";

export const SpotifyTrackPlayer = ({ track} ) => {

  if (!track ) return <p>Không có bài nhạc phù hợp.</p>;

  return (
    <div className="space-y-6 mt-10">
      <div className="flex items-center space-x-3">
        <img
          src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
          alt={track.name}
          className="w-12 h-12 rounded-md object-cover"
        />
        <div>
          <h4 className="font-semibold text-base">{track.name}</h4>
          <p className="text-sm text-gray-500">
            {track.artists.map(artist => artist.name).join(", ")}
          </p>
        </div>
      </div>

      <iframe
        src={`https://open.spotify.com/embed/track/${track.id}`}
        width="100%"
        height="80"
        style={{ border: "none" }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};
