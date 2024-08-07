import { createAsyncThunk } from "@reduxjs/toolkit";

// Определение интерфейса для объекта Department
export interface Department {
  id: string;
  title: string;
}

// Ключ для хранения данных в localStorage
const departmentsCacheKey = "departmentsCache";

// Создание асинхронного thunk с помощью createAsyncThunk
export const fetchDepartments = createAsyncThunk(
  // Тип действия для thunk
  "departments/fetchDepartments",
  // Асинхронная функция, которая будет вызываться
  async () => {
    let cachedData;
    try {
      // Попытка получить данные из localStorage
      cachedData = localStorage.getItem(departmentsCacheKey);
    } catch (error) {
      // Логирование ошибки чтения из localStorage
      console.error("Ошибка чтения из localStorage:", error);
    }

    // Если данные есть в localStorage
    if (cachedData) {
      try {
        // Попытка распарсить данные из JSON
        return JSON.parse(cachedData);
      } catch (error) {
        // Логирование ошибки парсинга данных из localStorage
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
        // Тело запроса с агрегацией для получения departments
        body: JSON.stringify({
          aggs: {
            departments: {
              // Агрегация по полю department_id
              terms: {
                field: "department_id",
                // Получаем все department_id (до 10000)
                size: 10000,
              },
              // Вложенный агрегатор top_hits для получения department_title
              aggs: {
                top_hit: {
                  top_hits: {
                    // Получаем только один результат
                    size: 1,
                    // Запрашиваем только поле department_title
                    _source: ["department_title"],
                  },
                },
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
      // Если ответ не успешный, выбрасываем ошибку
      throw new Error("Ошибка загрузки данных");
    }

    // Парсинг JSON ответа
    const data = await response.json();

    // Извлечение данных о departments, используя top_hits для получения department_title
    const departments = data.aggregations.departments.buckets.map(
      (bucket: any) => ({
        // id department
        id: bucket.key,
        // title department, с использованием опциональной цепочки для безопасного доступа
        title: bucket.top_hit.hits.hits[0]?._source?.department_title,
      })
    );

    try {
      // Попытка сохранить данные в localStorage
      localStorage.setItem(departmentsCacheKey, JSON.stringify(departments));
    } catch (error) {
      // Логирование ошибки записи в localStorage
      console.error("Ошибка записи в localStorage:", error);
    }

    // Возвращение массива departments
    return departments;
  }
);