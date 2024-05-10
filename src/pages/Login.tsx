import { useEffect } from "react";
import { redirectToAuthCodeFlow } from "../spotifyapi/auth";
import { useNavigate } from "react-router";

export const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const createEndpoint = async () => {
            const clientId = import.meta.env.VITE_APP_CLIENT_ID;
            const accessToken = localStorage.getItem("access_token");
            if (accessToken === null) {
                await redirectToAuthCodeFlow(clientId);
            } else {
                navigate("/app", { replace: true });
            }
        };
        createEndpoint();
    }, []);
    return (
        <>
            <div className="flex h-screen">
				<div className="w-full md:w-3/6 p-8 m-auto text-center space-y-4">
					<div>
                        <h2 className="text-2xl">Redirecting to Spotify login flow...</h2>
                    </div>
				</div>
			</div>
        </>
    )
}