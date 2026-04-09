import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('poultry-theme');
    return saved ? saved === 'dark' : true; // default to dark
  });

  useEffect(() => {
    localStorage.setItem('poultry-theme', isDarkMode ? 'dark' : 'light');
    // Update body classes for CSS
    document.body.classList.toggle('light', !isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
    // Also update html attribute
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = (isLight) => {
    if (typeof isLight === 'boolean') {
      setIsDarkMode(!isLight);
    } else {
      setIsDarkMode(prev => !prev);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}