export const searchTrack = async (artist: string, track: string): Promise<any> => {
    const accessToken = localStorage.getItem("access_token");
    const url = "https://api.spotify.com/v1/search?";
    const params = new URLSearchParams();
    params.append("q", queryBuilder(artist, track));
    params.append("type", "track");
    params.append("limit", "1");
    console.log(params.toString());
    const result = await fetch(url + params.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return await result.json();
}

export const searchTitleAsQuery = async (track: string): Promise<JSON> => {
    const accessToken = localStorage.getItem("access_token");
    const url = "https://api.spotify.com/v1/search?";
    const params = new URLSearchParams();
    params.append("q", track);
    params.append("type", "track");
    console.log(params.toString());
    const result = await fetch(url + params.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return await result.json();
}

const queryBuilder = (artist: string, track: string): string => {
    return "artist:" + artist + " track:" + track;
}