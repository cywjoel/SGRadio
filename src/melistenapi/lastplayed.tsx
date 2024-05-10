export const getLastPlayedSongs = async (stationName: string, count: number = 50): Promise<any> => {
    const url = "https://np.tritondigital.com/public/nowplaying?";
    const params = new URLSearchParams();
    params.append("mountName", stationName);
    params.append("numberToFetch", count.toString());
    params.append("eventType", "track");
    const result = await fetch(url + params.toString());
    const response = await result.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "text/xml");
    return doc;
}