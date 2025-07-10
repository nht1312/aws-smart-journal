import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { YouTubePlayer } from "./youtube-player";
import { SpotifyPlaylistPlayer } from "./spotify-playlist-player";
import { getYoutubeSong, getSpotifyPlaylist } from "../api/externalApi";
import { useFetchTrack } from "../hooks/useFetchTrack";
import { removeNullItems } from "../utils/commonUtils";
import { searchType } from "../const";
import { SpotifyTrackPlayer } from "./spotify-track-player";
import Spinner from "./spinner";

export const PlayerContainer = ({ title, detail, emojies, delay = 0 }) => {
    const sectionRef = useRef(null);
    const lastKeywordRef = useRef(null);
    const [tracks, setTracks] = useState({
        id: {
            videoId: "ZbZSe6N_BXs",
        },
        snippet:  {
            title: "Test",
        },
    });
    const [playlists, setPlaylists] = useState(null);
    const [loading, setLoading] = useState(false);

    const { keywords, song } = detail;
    const { youtubeTitle , spotifyTitle } = title;
    const { youtubeEmoji , spotifyEmoji } = emojies;

    const handleSetPlaylist = (items) => {
        const data = removeNullItems(items);
        setPlaylists(data);
    };

    // const {isDoneFetchData: isDoneFetchPlaylist } = useFetchTrack({
    //     handleGetData: getSpotifyPlaylist,  
    //     flag: keywords,                    
    //     setData: handleSetPlaylist,     
    //     type:  searchType.PLAYLIST
    // });

    // const {isDoneFetchData: isDoneFetchVideo } = useFetchTrack({
    //     handleGetData: getYoutubeSong,  
    //     flag: song,                    
    //     setData: setTracks,     
    // });

    // useEffect(() => {
    //   if(isDoneFetchPlaylist && isDoneFetchVideo) {
    //     setLoading(false);
    //   }
    //   else {
    //     setLoading(true);
    //   }
    // }, [isDoneFetchPlaylist, isDoneFetchVideo]);

    // const fetchData = async (song) => {
    //     try {
    //         const result = await getYoutubeSong(song);
            
    //         setTracks(result.items[1]);
    //         console.log(result);
    //     } catch (error) {
    //         console.error("Get data error:", error);
    //     }
    // };

//     useEffect(() => {
//     if (!song || song === "") {
//       setTracks(null);
//       lastKeywordRef.current = null;
//       return;
//     }

//     if (lastKeywordRef.current === song) {
//       return;
//     }

//     fetchData(song); 
//     lastKeywordRef.current = song;  
//   }, [song]);

    useEffect(() => {
        gsap.fromTo(
            sectionRef.current,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay,
                ease: "power2.out",
            }
        );
    }, [delay]);



  return (
    <div
      ref={sectionRef}
      className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 mb-8"
    >
      {loading ? <Spinner /> : (
        <>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <span className="text-3xl">{youtubeEmoji}</span>
            {youtubeTitle}
          </h2>

          <YouTubePlayer tracks={tracks} />

          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 mt-20">
            <span className="text-3xl">{spotifyEmoji}</span>
            {spotifyTitle}
          </h2>

          {/* <SpotifyPlaylistPlayer playlists={playlists}/> */}
        </>
      )}

    </div>
  );
};