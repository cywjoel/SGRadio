import { Link } from "react-router-dom"; 
import { useState, useRef, useEffect } from "react";
import { Loader } from "../components/Loader";
import { Playlist } from "../components/Playlist";
import { generateCurrentTimestampInSeconds } from "../utils/utils";
import { getRefreshedToken } from "../spotifyapi/auth";
import { getLastPlayedSongs } from "../melistenapi/lastplayed";
import { searchTrack } from "../spotifyapi/search";

export const SGRadio = () => {
    const processPlaylist = async () => {
        setIsPlaylistView(false);
        setIsHidden(false);
        setTimeout(() => {                          // setting timeout allows the loader div to load
            doScroll();
        }, 0);
        await generatePlaylistHandler();
        setIsPlaylistView(true);
    };

    const generatePlaylistHandler = async () => {
        const expiry = Number(localStorage.getItem("expires_at"));
        if ((generateCurrentTimestampInSeconds() >= expiry) || (isNaN(expiry))) {
            setLoaderMsg("Refreshing token...");
            await getRefreshedToken();
        }
        setLoaderMsg("Retrieving tracks from radio... Please be patient.");
        const doc = await getLastPlayedSongs(stationName);
        let tracklist: any = new Object;
        let songCount = 0;
        for (let i = 0; i < doc.childNodes[0].childNodes.length; i++) {
            let song: any = new Object;
            for (let j = 0; j < doc.childNodes[0].childNodes[i].childNodes.length; j++) {
                let attrName: string = doc.childNodes[0].childNodes[i].childNodes[j].getAttribute("name")!;          // ignore the IDE error/warning
                let attrValue: string = doc.childNodes[0].childNodes[i].childNodes[j].childNodes[0].textContent!;
                song[attrName] = attrValue;
            }
            if (("track_artist_name" in song) && ("cue_title" in song)) {
                tracklist[songCount] = song;
                songCount += 1;
            }
            // console.log("-----------------------");                                                         // clean this up
        }
        // console.log(tracklist);
        let playlist: any = new Object;
        let successfulCount = 0;
        for (let i = 0; i < Object.keys(tracklist).length; i++) {
            // console.log(tracklist[i])
            let item: any = new Object;
            const artist = tracklist[i]["track_artist_name"];
            const track = tracklist[i]["cue_title"];
            const res = await searchTrack(artist, track);
            if (res.tracks.items.length > 0) {
                item["album"] = res.tracks.items[0].album.name;
                item["cover_url"] = res.tracks.items[0].album.images[1].url;
                item["artists"] = "";
                for (let i = 0; i < res.tracks.items[0].artists.length; i++) {
                    if (i > 0) {
                        item["artists"] += ", ";
                    }
                    item["artists"] += (res.tracks.items[0].artists[i].name);
                }
                item["title"] = res.tracks.items[0].name;
                item["spotify_uri"] = res.tracks.items[0].uri;
                playlist[successfulCount + 1] = item;
                successfulCount += 1;
            }
        }
        console.log("Searched " + successfulCount.toString() + " out of " + songCount.toString() + " songs successfully.");
        console.log(playlist);
        setRadioPlaylist(playlist);
        console.log(radioPlaylist);
    };

    const doScroll = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const [stationName, setStationName] = useState<string>("INDIEGO_S01AAC_48");
    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [isPlaylistView, setIsPlaylistView] = useState<boolean>(false);
    const [loaderMsg, setLoaderMsg] = useState<string>("");
    const [radioPlaylist, setRadioPlaylist] = useState<any>();
    const displayName: string = localStorage.getItem("display_name")!;
    const scrollRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const refreshTokenIfNeeded = async () => {
            const expiry = Number(localStorage.getItem("expires_at"));
            if ((generateCurrentTimestampInSeconds() >= expiry) || (isNaN(expiry))) {
                console.log("is token refreshing");
                setLoaderMsg("Refreshing token...");
                await getRefreshedToken();
            }
        };
        refreshTokenIfNeeded();
    }, []);

    return (
        <div className="h-screen">
            <div className="flex justify-center items-center h-screen">
                <div className="w-full md:w-3/6 p-8 m-auto text-center space-y-16">
                    <div>
                        <h1 className="text-5xl">Hi, {displayName}.</h1>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl">Choose a radio station</h2>
                        <select name="radio-station" id="radioStation" className="text-lg bg-zinc-900" onChange={e => {setStationName(e.target.value)}}>
                            <option value="INDIEGO_S01AAC_48">indiego</option>
                            <option value="CLASS95AAC">Class 95</option>
                            <option value="GOLD905AAC">Gold 90.5</option>
                            <option value="987FMAAC">987FM</option>
                        </select>
                    </div>
                    <div>
                        <button className="border-2 border-solid border-white rounded-full hover:bg-white hover:text-zinc-900" onClick={processPlaylist}>
                            <div className="py-2 px-8 text-lg">
                                Generate my playlist
                            </div>
                        </button>
                    </div>
                    <div>
                        <Link to='/?logout=success' className="underline">Log out</Link>
                    </div>
                </div>
            </div>
            <div ref={scrollRef} className={isHidden ? "hidden" : "bg-zinc-900 flex justify-center items-center min-h-screen"}>
                {isPlaylistView ? <Playlist radioPlaylist={radioPlaylist} /> : <Loader message={loaderMsg} />}
            </div>
        </div>
    );
}