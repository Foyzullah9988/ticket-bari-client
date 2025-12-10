import React, { useEffect } from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';

const Theme = () => {
    const [theme, setTheme] = React.useState(() => {
        // Get theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const html = document.documentElement;
        
        // Remove both classes first
        html.classList.remove('light', 'dark');
        
        // Add current theme class
        html.classList.add(theme);
        
        // Also set data-theme attribute for DaisyUI
        html.setAttribute("data-theme", theme);
        
        // Save to localStorage
        localStorage.setItem("theme", theme);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
    }, [theme]);

    const handleTheme = (isDark) => {
        setTheme(isDark ? "dark" : "light");
    };

    return (
        <div className="flex items-center">
            <label className="swap swap-rotate">
                <input
                    type="checkbox"
                    onChange={(e) => handleTheme(e.target.checked)}
                    checked={theme === 'dark'}
                    className="theme-controller"
                />
                
                <IoSunny className="swap-on w-5 h-5 text-amber-500" />
                <IoMoon className="swap-off w-5 h-5 text-gray-600 dark:text-gray-400" />
            </label>
        </div>
    );
};

export default Theme;