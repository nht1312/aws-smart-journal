import React from "react";

export const SpotifyPlaylistPlayer = ({ playlists }) => {

  if (!playlists || playlists.length === 0) return <p>Không có bài nhạc phù hợp.</p>;

  return (
    <div className="space-y-6 mt-10">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="space-y-2">
          <div className="flex items-center space-x-3">
            <img
              src={playlist.images?.[2]?.url || playlist.images?.[0]?.url}
              alt={playlist.name}
              className="w-12 h-12 rounded-md object-cover"
            />
            <h4 className="font-semibold text-base">{playlist.name}</h4>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
            width="100%"
            height="380"
            style={{ border: "none" }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      ))}
    </div>
  );
};
