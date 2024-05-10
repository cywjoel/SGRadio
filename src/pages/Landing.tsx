import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Landing = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const logout = urlParams.get("logout");
    const error = urlParams.get("error");

    useEffect(() => {
        const notify = () => {
            if (logout) {
                localStorage.clear();
                toast.success("Logged out successfully.");
            } else if (error) {
                toast.error("Login failed, please try again. Error: " + error);
            }
        }
        notify();
    }, []);
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
            <div className="flex h-screen">
				<div className="w-full md:w-3/6 p-8 m-auto text-center space-y-12">
					<div className="space-y-2">
                        <h2 className="text-3xl">mePlaylist</h2>
                        <p>Create a Spotify playlist from recent songs on Mediacorp radio stations</p>
                    </div>
                    <div>
                        <Link to="/app" className="text-xl">
                            <button className="border-2 border-solid rounded-full px-16 py-4 bg-green-800">
                                Get started
                            </button>
                        </Link>
                    </div>
				</div>
			</div>
        </>
    )
}