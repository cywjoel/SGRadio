import { generateCurrentTimestampInSeconds } from "../utils/utils";

export const getRefreshedToken = async () => {
    const url = "https://accounts.spotify.com/api/token?";
    const refreshToken = localStorage.getItem("refresh_token")!;
    const clientId = import.meta.env.VITE_APP_CLIENT_ID;
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);
    params.append("client_id", clientId);
    const result = await fetch(url + params.toString(), {
        method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const response = await result.json();
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
    localStorage.setItem("expires_at", (generateCurrentTimestampInSeconds() + Number(response.expires_in)).toString());
    console.log(response.expires_in);
}

export const redirectToAuthCodeFlow = async (clientId: string) => {

    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

	const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://" + location.host + "/callback");
    params.append("scope", "playlist-read-private playlist-modify-private playlist-modify-public");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export const getToken = async (clientId: string, code: string) => {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://" + location.host + "/callback");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    // token properties; access_token, expires_in, refresh_token, scope
    const token = await result.json();
    return token;
}

const generateCodeVerifier = (length: number) => {
	let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const generateCodeChallenge = async (codeVerifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}