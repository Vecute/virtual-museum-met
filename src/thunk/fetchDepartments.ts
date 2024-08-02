import { createAsyncThunk } from '@reduxjs/toolkit';

export interface Department {
  id: string;
  title: string;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

interface ApiResponse {
  data: Department[];
  pagination: Pagination;
}

export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    let allDepartments: Department[] = [];
    let currentPage = 1;
    const limit = 100;
    let totalPages = 1 // Добавляем переменную для хранения общего количества страниц

    while (currentPage <= totalPages) { // Используем totalPages в условии цикла
      const response = await fetch(
        `https://api.artic.edu/api/v1/category-terms/search?q=&query[term][subtype]=department&limit=${limit}&page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }

      const data: ApiResponse = await response.json();
      totalPages = data.pagination.total_pages; // Обновляем totalPages

      // Создаем массив промисов для проверок департаментов
      const departmentPromises = data.data.map(async (department) => {
        const artworksResponse = await fetch(
          `https://api.artic.edu/api/v1/artworks/search?query[term][department_id]=${department.id}`
        );
        const artworksData = await artworksResponse.json();

        return artworksData.pagination.total !== 0 ? department : null;
      });

      // Дожидаемся выполнения всех проверок
      const departmentResults = await Promise.all(departmentPromises);

      // Добавляем непустые департаменты в результирующий массив
      allDepartments = allDepartments.concat(
        departmentResults.filter((department) => department !== null)
      );

      currentPage++;
    }

    return allDepartments;
  }
);