import { useState } from "react";
import { createPlaylist, addItemsToPlaylist } from "../spotifyapi/playlists";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Playlist = (radioPlaylist: any) => {

    const notify = () => {
        toast.success("Playlist created successfully.");
    }

    const createPlaylistHandler = async (e: any) => {
        e.preventDefault();
        setIsSubmitDisabled(true);
        const createResponse = await createPlaylist(playlistName);
        const playlistId = createResponse.id;
        const addItemsResponse = await addItemsToPlaylist(playlistId, spotifyIdArray);
        setIsSubmitDisabled(false);
        if (addItemsResponse.snapshot_id) {
            notify();
            console.log("added items to playlist successfully");
        }
    }

    const [playlistName, setPlaylistName] = useState<string>("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);
    let spotifyIdArray: Array<string> = [];

    let songs: Array<JSX.Element> = [];
    for (const key in radioPlaylist.radioPlaylist) {
        const index = Number(key);
        const artists = radioPlaylist.radioPlaylist[key].artists;
        const title = radioPlaylist.radioPlaylist[key].title;
        const albumName = radioPlaylist.radioPlaylist[key].album;
        const albumCoverUrl = radioPlaylist.radioPlaylist[key].cover_url;
        const spotifyId = radioPlaylist.radioPlaylist[key].spotify_uri;
        songs.push(<PlaylistItem index={index} artists={artists} title={title} albumName={albumName} albumCoverUrl={albumCoverUrl} spotifyId={spotifyId} />);
        spotifyIdArray.push(spotifyId);
    };

    return (
        <>
            <div>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
            <form onSubmit={createPlaylistHandler}>
                <div className="flex flex-col h-screen justify-center items-center flex-grow space-y-8">
                    <div className="text-center space-y-2 w-2/3">
                        <span className="text-sm">Give your playlist a name! (Required, max 100 characters)</span>
                        <div className="w-full border-b-4">
                            <textarea
                                name="playlistName"
                                className="bg-zinc-900 hover:bg-zinc-700 text-4xl text-center font-bold w-full"
                                placeholder="(Playlist created from SGRadio)"
                                maxLength={100}
                                required
                                onChange={e => setPlaylistName(e.target.value)} />
                        </div>  
                    </div>
                    <div className="md:rounded-xl bg-zinc-800 w-full md:w-3/4 divide-y divide-zinc-600 h-1/2 overflow-y-auto">
                        <PlaylistHeader />
                        {songs}
                    </div>
                    <input type="submit" value="Save playlist" className="border-2 border-solid rounded-full px-16 py-4 font-bold bg-green-800 hover:bg-green-700 active:bg-green-900 disabled:bg-slate-500 hover:cursor-pointer disabled:cursor-not-allowed" disabled={isSubmitDisabled} />
                </div>
            </form>
        </>
    )
}

const PlaylistHeader = () => {
    return (
        <div className="sticky z-10 top-0 bg-zinc-800 flex items-center border-b border-zinc-400">
            <div className="basis-1/10">
                <div className="flex items-center gap-4 p-4">
                    <strong className="text-zinc-200 text-md font-medium">No.</strong>
                </div>
            </div>
            <div className="basis-9/10 md:basis-5/10">
                <div className="flex items-center gap-4 p-4">
                    <strong className="text-zinc-200 text-md font-medium">Title</strong>
                </div>
            </div>
            <div className="hidden md:block basis-4/10">
                <div className="flex items-center gap-4 p-4">
                    <span className="text-zinc-200 text-md font-medium">Album</span>
                </div>
            </div>
        </div>
    )
}

const PlaylistItem = ({ index, artists, title, albumName, albumCoverUrl, spotifyId }: {index: number, artists: string, title: string, albumName: string, albumCoverUrl: string, spotifyId: string}) => {
    return (
        <div key={spotifyId} className="flex items-center">
            <div className="basis-1/10">
                <div className="flex items-center gap-4 p-4">
                    <strong className="text-slate-400 text-md font-medium">{index}</strong>
                </div>
            </div>
            <div className="basis-9/10 md:basis-5/10">
                <div className="flex items-center gap-4 p-4">
                    <img className="w-12 h-12 rounded-full" src={albumCoverUrl} />
                    <div className="flex flex-col">
                        <strong className="text-slate-200 text-sm font-medium">{title}</strong>
                        <span className="text-slate-400 text-sm font-medium">{artists}</span>
                    </div>
                </div>
            </div>
            <div className="hidden md:block basis-4/10">
                <div className="flex items-center gap-4 p-4">
                    <span className="text-slate-400 text-sm font-medium">{albumName}</span>
                </div>
            </div>
        </div>
    );
}