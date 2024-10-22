import React, { useContext } from 'react';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'

import { ThemeContext } from '../theme-provider';
import { FaRegMoon } from 'react-icons/fa';
import { LuSunMedium } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectIsAuthenticated } from '../../../features/user/userSlice'
import { useNavigate } from 'react-router-dom';
import { CiLogout } from 'react-icons/ci';

export const Header = () => {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const isAuthentificated = useSelector(selectIsAuthenticated);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		localStorage.removeItem('token');
		navigate('/auth');
	}

	return (
		<Navbar>
			<NavbarBrand>
				<p className='font-bold text-inherit'>
					Network Social
				</p>
			</NavbarBrand>
			<NavbarContent justify='end'>
				<NavbarItem
					className='lg:flex text-3xl cursor-pointer'
					onClick={() => toggleTheme()}
				>
					{ theme === 'light' ? <FaRegMoon /> : <LuSunMedium /> }
				</NavbarItem>
				<NavbarItem>
					{isAuthentificated &&
					  <Button variant='flat' className='gap-2' onClick={handleLogout}>
					    <CiLogout />
					    Logout
					</Button>
					}
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	)
}
