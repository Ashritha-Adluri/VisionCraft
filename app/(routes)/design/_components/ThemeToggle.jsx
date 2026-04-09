// app/_components/ThemeToggle.jsx
'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
}