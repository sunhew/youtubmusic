import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? '라이트 모드' : '다크 모드'}
        </button>
    );
};

export default DarkModeToggle;
