export const fetchProfile = async () => {
    const url = "https://api.spotify.com/v1/me";
    const accessToken = localStorage.getItem("access_token");
    const result = await fetch(url, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return await result.json();
}