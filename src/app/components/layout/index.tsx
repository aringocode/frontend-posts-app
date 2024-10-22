import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Header } from '../header';
import { Container } from '../container';
import { NavBar } from '../nav-bar';
import { Outlet, useNavigate } from "react-router-dom"
import { selectIsAuthenticated, selectUser } from "../../../features/user/userSlice"
import { Profile } from "../profile";


export const Layout = () => {
	const isAuthentificated = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthentificated) {
			navigate('/auth');
		}
	}, []);

	return (
		<>
			<Header />
			<Container>
				<div className='flex-2 p-4'>
					<NavBar />
				</div>
				<div className='flex-1 p-4'>
					<Outlet />
				</div>
				<div className="flex-2 p-4">
					<div className="flex-col flex gap-5">
						{!user && <Profile />}
					</div>
				</div>
			</Container>
		</>
	)
};
