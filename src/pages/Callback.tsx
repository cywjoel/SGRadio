import { Navigate, useNavigate } from "react-router";
import { getToken } from "../spotifyapi/auth";
import { useEffect } from "react";
import { fetchProfile } from "../spotifyapi/profile";
import { generateCurrentTimestampInSeconds } from "../utils/utils";

export const Callback = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    if (!code) {
        localStorage.clear();
        const errorRedirect = "/?error=" + error;
        return <Navigate to={errorRedirect} />;
    } else {
        useEffect(() => {
            const fetchAccessToken = async () => {
                const clientId = import.meta.env.VITE_APP_CLIENT_ID;
                const token = await getToken(clientId, code);
                const { access_token, expires_in, refresh_token, scope } = token;
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("expires_at", (generateCurrentTimestampInSeconds() + Number(expires_in)).toString());
                localStorage.setItem("refresh_token", refresh_token);
                localStorage.setItem("scope", scope);
            };

            const fetchDisplayName = async () => {
                const profile = await fetchProfile();
                localStorage.setItem("display_name", profile.display_name);
                localStorage.setItem("user_id", profile.id);
            }

            const fetchTokenAndName = async () => {
                await fetchAccessToken();
                await fetchDisplayName();
                navigate("/app", { replace: true })
            }
            fetchTokenAndName();
        }, []);
    }
}