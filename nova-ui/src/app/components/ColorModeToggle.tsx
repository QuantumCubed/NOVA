// // src/app/components/ColorModeToggle.tsx
// import { useEffect, useState } from 'react';

// const ColorModeToggle = () => {
//     const [darkMode, setDarkMode] = useState(false); // Default to light mode

//     useEffect(() => {
//         const currentTheme = window.localStorage.getItem('theme'); // Check theme from local storage
//         if (currentTheme === 'dark') {
//             setDarkMode(true);
//             document.documentElement.classList.add('dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//         }
//     }, []);

//     const toggleDarkMode = () => {
//         const newDarkMode = !darkMode;
//         setDarkMode(newDarkMode);
//         document.documentElement.classList.toggle('dark', newDarkMode);
//         window.localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
//     };

//     return (
//         <div className="color-mode-toggle-container">
//             <span className="color-mode-label">Dark Mode</span>
//             <div className="switch">
//                 <input
//                     id="dark-mode-switch"
//                     type="checkbox"
//                     checked={darkMode}
//                     onChange={toggleDarkMode}
//                     className="color-mode-input"
//                 />
//                 <span className="slider round"></span>
//             </div>
//         </div>
//     );
// };

// export default ColorModeToggle;










// src/app/components/ColorModeToggle.tsx
import { useEffect, useState } from 'react';

const ColorModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false); // Default to light mode

    useEffect(() => {
        const currentTheme = window.localStorage.getItem('theme'); // Check theme from local storage
        if (currentTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false); // Set light mode as the default if no preference is found
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        document.documentElement.classList.toggle('dark', newDarkMode);
        window.localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    };

    return (
        <div className="color-mode-toggle-container">
            <span className="color-mode-label">Dark Mode</span>
            <div className="switch">
                <input
                    id="dark-mode-switch"
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    className="color-mode-input"
                />
                <span className="slider round"></span>
            </div>
        </div>
    );
};

export default ColorModeToggle;
