export const createPlaylist = async (playlistName: string, isPublic: boolean = true) => {
    const accessToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
    const url = "https://api.spotify.com/v1/users/" + userId + "/playlists";
    const result = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": playlistName,
            "public": isPublic
        })
    });
    return await result.json();
}

export const addItemsToPlaylist = async (playlistId: string, idArray: Array<string>) => {
    const accessToken = localStorage.getItem("access_token");
    const url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
    const result = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
            "uris": idArray
        })
    })
    return await result.json();
}