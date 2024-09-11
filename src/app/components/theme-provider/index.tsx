import React from "react";

type ThemeContextType = {
	theme: 'dark' | 'light',
	toggleTheme: () => void
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const storedTheme = localStorage.getItem("theme");
	const currentTheme = storedTheme ? storedTheme as 'dart' | 'light' : 'dark';

	return (
		<></>
	)
}