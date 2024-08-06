import { createAsyncThunk } from "@reduxjs/toolkit";

export interface Department {
  id: string;
  title: string;
}

const departmentsCacheKey = "departmentsCache";

export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    try {
      const cachedData = await localStorage.getItem(departmentsCacheKey);
      if (cachedData) {
        const parsedData: Department[] = JSON.parse(cachedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Ошибка парсинга данных из localStorage:", error);
    }

    try {
      const response = await fetch(
        "https://api.artic.edu/api/v1/artworks/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "aggs": {
              "departments": {
                "terms": {
                  "field": "department_id",
                  "size": 10000,
                },
                "aggs": { // Добавляем вложенный агрегатор top_hits
                  "top_hit": {
                    "top_hits": {
                      "size": 1,
                      "_source": ["department_title"],
                    },
                  },
                },
              },
            },
            "_source": [], // Не нужно запрашивать _source для всего документа
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }

      const data = await response.json();

      // Извлекаем данные о departments, используя top_hits для получения department_title
      const departments: Department[] = data.aggregations.departments.buckets.map(
        (bucket: any) => ({
          id: bucket.key,
          title: bucket.top_hit.hits.hits[0]._source.department_title,
        })
      );

      try {
        localStorage.setItem(departmentsCacheKey, JSON.stringify(departments));
      } catch (error) {
        console.error("Ошибка сохранения данных в localStorage:", error);
      }

      return departments;
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      throw error;
    }
  }
);