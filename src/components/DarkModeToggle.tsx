import React, { useEffect } from "react";
import "../styles/darkMode.scss";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeReducer";
import { RootState } from "../redux/store";

// Определение констант для светлой и тёмной темы
const lightTheme = "light";
const darkTheme = "dark";

// Компонент для переключения темы
const DarkModeToggle: React.FC = () => {
  const dispatch = useDispatch(); // Использование хука useDispatch для вызова действий Redux
  const isDarkMode = useSelector(
    (state: RootState) => state.themeReducer.darkMode
  ); // Использование хука useSelector для доступа к текущему состоянию темы в хранилище Redux

  const handleToggleTheme = () => {
    // Функция для переключения темы, которая вызывает действие toggleTheme
    dispatch(toggleTheme());
  };

  useEffect(() => {
    // Хук useEffect, который выполняется при изменении isDarkMode
    const theme = isDarkMode ? darkTheme : lightTheme; // Определение текущей темы на основе состояния isDarkMode
    document.documentElement.setAttribute("data-theme", theme); // Установка атрибута data-theme корневого элемента документа для применения CSS-стилей темы
    localStorage.setItem("theme", theme);
  }, [isDarkMode]); // Сохранение текущей темы в localStorage, чтобы она сохранялась при перезагрузке страницы

  return (
      <button
        className="theme-button"
        onClick={handleToggleTheme}
      >
        {isDarkMode ? (
          <svg
            viewBox="0 0 32 32"
            width="18px"
            height="18px"
            fill="var(--icon-color)"
          >
            <path d="M30.9,20.8c-2.2,6.1-8,10.2-14.5,10.2C7.9,31,1,24.2,1,15.8C1,8.7,5.9,2.6,12.9,1c0.3-0.1,0.7,0,1,0.3     c0.2,0.3,0.3,0.7,0.2,1c-0.5,1.4-0.8,2.9-0.8,4.4c0,7.3,6,13.2,13.4,13.2c1,0,2.1-0.1,3.1-0.4c0.3-0.1,0.7,0,1,0.3     C31,20.1,31.1,20.5,30.9,20.8z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="18px"
            height="18px"
            fill="var(--icon-color)"
          >
            <path d="M 11 0 L 11 3 L 13 3 L 13 0 L 11 0 z M 4.2226562 2.8085938 L 2.8085938 4.2226562 L 4.9296875 6.34375 L 6.34375 4.9296875 L 4.2226562 2.8085938 z M 19.777344 2.8085938 L 17.65625 4.9296875 L 19.070312 6.34375 L 21.191406 4.2226562 L 19.777344 2.8085938 z M 12 5 A 7 7 0 0 0 5 12 A 7 7 0 0 0 12 19 A 7 7 0 0 0 19 12 A 7 7 0 0 0 12 5 z M 0 11 L 0 13 L 3 13 L 3 11 L 0 11 z M 21 11 L 21 13 L 24 13 L 24 11 L 21 11 z M 4.9296875 17.65625 L 2.8085938 19.777344 L 4.2226562 21.191406 L 6.34375 19.070312 L 4.9296875 17.65625 z M 19.070312 17.65625 L 17.65625 19.070312 L 19.777344 21.191406 L 21.191406 19.777344 L 19.070312 17.65625 z M 11 21 L 11 24 L 13 24 L 13 21 L 11 21 z" />
          </svg>
        )}
      </button>
  );
};

export default DarkModeToggle;