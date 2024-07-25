import { createSlice } from "@reduxjs/toolkit";

// Определение константы для темной темы
const darkTheme = 'dark';

// Чтение сохраненной темы из localStorage
const storedTheme = localStorage.getItem('theme');
// Определение, предпочитает ли пользователь темную тему с помощью настроек браузера
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
// Определение начальной темы на основе сохраненной темы или настроек браузера
const initialTheme = storedTheme ? storedTheme === darkTheme : prefersDark;

// Определение типа для начального состояния редюсера
type InitialStateType = {
    darkMode: boolean
}

// Определение начального состояния редюсера
const initialState: InitialStateType = {
    darkMode: initialTheme
  };

// Создание редюсера с помощью функции createSlice
const themeReducer = createSlice(
    {
        // Имя редюсера
        name: 'theme',
        // Начальное состояние редюсера
        initialState,
        // Определение действий (actions) и обработчиков действий (reducers)
        reducers: {
            // Действие для переключения темы
            toggleTheme: (state) => {
                // Переключение состояния darkMode на противоположное значение
                state.darkMode = !state.darkMode
            }
        }
    }
)

// Экспорт действия и редюсера
export const {toggleTheme} = themeReducer.actions
export default themeReducer.reducer