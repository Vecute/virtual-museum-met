// fetchPlaceOfOrigin.js
import { createAsyncThunk } from "@reduxjs/toolkit";

// Интерфейс для объекта PlaceOfOrigin
export interface PlaceOfOrigin {
  value: string; // Значение места происхождения
}

// Ключ для хранения данных в localStorage
const placeOfOriginCacheKey = "placeOfOriginCache";

// Создание асинхронного thunk для получения мест происхождения
export const fetchPlaceOfOrigin = createAsyncThunk(
  "placeOfOrigin/fetchPlaceOfOrigin",
  async () => {
    let cachedData;
    try {
      // Попытка получить данные из localStorage
      cachedData = localStorage.getItem(placeOfOriginCacheKey);
    } catch (error) {
      console.error("Ошибка чтения из localStorage:", error);
    }

    // Если данные есть в localStorage
    if (cachedData) {
      try {
        // Попытка распарсить данные из JSON
        return JSON.parse(cachedData);
      } catch (error) {
        console.error("Ошибка парсинга данных из localStorage:", error);
      }
    }

    // Отправка POST запроса к API Art Institute of Chicago
    const response = await fetch(
      "https://api.artic.edu/api/v1/artworks/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Тело запроса с агрегацией для получения мест происхождения
        body: JSON.stringify({
          aggs: {
            places_of_origin: {
              // Агрегация по полю place_of_origin.keyword (assuming you have a keyword field)
              terms: {
                field: "place_of_origin.keyword", 
                // Получаем все place_of_origin (до 10000)
                size: 10000,
              },
            },
          },
          // Не нужно запрашивать _source для всего документа
          _source: [],
        }),
      }
    );

    // Проверка, был ли ответ успешным
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    // Парсинг JSON ответа
    const data = await response.json();

    // Извлечение данных о местах происхождения
    const placesOfOrigin = data.aggregations.places_of_origin.buckets.map(
      (bucket: any) => ({
        value: bucket.key, // Значение места происхождения
      })
    );

    try {
      // Попытка сохранить данные в localStorage
      localStorage.setItem(placeOfOriginCacheKey, JSON.stringify(placesOfOrigin));
    } catch (error) {
      console.error("Ошибка записи в localStorage:", error);
    }

    // Возвращение массива мест происхождения
    return placesOfOrigin;
  }
);