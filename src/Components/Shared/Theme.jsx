import React from 'react';
import { useEffect, useState } from 'react';


const Theme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || "light")
    useEffect(() => {
        const html = document.querySelector('html')
        html.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])
    const handleTheme = (checked) => {
        setTheme(checked ? "dark" : "light")
    }
    return (
        <input
            onChange={(e) => handleTheme(e.target.checked)}
            type="checkbox"
            defaultChecked={localStorage.getItem('theme') === "dark"}
            className="toggle" />
    );
};

export default Theme;