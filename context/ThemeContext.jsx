'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const ThemeContext = createContext();

export function ThemeProvider({ children, userId }) {
    const [theme, setTheme] = useState('light');
    const [isLoaded, setIsLoaded] = useState(false); // Track if theme is loaded
    const userTheme = useQuery(api.users.getTheme, userId ? { userId } : 'skip');
    const setUserTheme = useMutation(api.users.setTheme);

    // Load theme from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Priority: User preference > saved theme > system preference
        const initialTheme = userTheme === 'system'
            ? (systemPrefersDark ? 'dark' : 'light')
            : userTheme || savedTheme || (systemPrefersDark ? 'dark' : 'light');

        setTheme(initialTheme);
        setIsLoaded(true); // Mark theme as loaded
    }, [userTheme]);

    // Apply theme class and save preference
    useEffect(() => {
        if (!isLoaded) return; // Don't apply until theme is loaded

        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
        if (userId) {
            setUserTheme({ userId, theme });
        }
    }, [theme, userId, setUserTheme, isLoaded]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Don't render children until theme is loaded to avoid flash
    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);