import React, { createContext, useContext, useEffect, useState } from 'react';

export const SettingsContext = createContext();

export const SettingsContextProvider = ({ children }) => {
    const [language, setLanguage] = useState('English');
    const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];
    const [darkMode, setDarkMode] = useState(true);
    const [profanityFilter, setProfanityFilter] = useState(false);
    const [textSize, setTextSize] = useState(0);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const toggleProfanityFilter = () => setProfanityFilter(!profanityFilter);
    const changeLanguage = (newLanguage) => setLanguage(newLanguage);

    const translations = {
        "Text Size": {
            English: "Text Size",
            Spanish: "Tamaño del Texto",
            French: "Taille du Texte",
            German: "Textgröße",
            Chinese: "文字大小"
        },
        // Add other translatable strings here
    };

    return (
        <SettingsContext.Provider value={{ language, languages, changeLanguage, darkMode, toggleDarkMode, profanityFilter, toggleProfanityFilter, textSize, setTextSize }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const value = useContext(SettingsContext);

    if (!value) {
        throw new Error('useSettings must be wrapped inside SettingsContextProvider');
    }
    return value;
}
