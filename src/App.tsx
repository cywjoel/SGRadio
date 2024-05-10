import React, { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { SGRadio } from './pages/SGRadio';
import { Callback } from './pages/Callback'
import { Login } from './pages/Login';
import { Playlist } from './components/Playlist';


// This is the workaround for the children props error message
interface Props {
    children?: ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }: Props) => {
	const accessToken = localStorage.getItem("access_token");
	return accessToken ? children : <Navigate to="/login" />;
};

const App = () => {
	return (
		<>
			<Routes>
				<Route path='/' element={<Landing />} />
				<Route path='/login' element={<Login />} />
				<Route path='/app' element={
					<PrivateRoute>
						<SGRadio />
					</PrivateRoute>
				} />
				<Route path='/callback' element={<Callback />} />
				<Route path="/playlist" element={<Playlist />} />
			</Routes>
		</>
	);
}

export default App
