import { createAsyncThunk } from "@reduxjs/toolkit";

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

const departmentsCacheKey = "departmentsCache";

export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    try {
      const cachedData = await localStorage.getItem(departmentsCacheKey);
      if (cachedData) {
        const parsedData: { id: string; title: string }[] = JSON.parse(
          cachedData
        );
        return parsedData;
      }
    } catch (error) {
      console.error("Ошибка парсинга данных из localStorage:", error);
    }

    let allDepartments: Department[] = [];
    let currentPage = 1;
    const limit = 100;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const response = await fetch(
        `https://api.artic.edu/api/v1/category-terms/search?q=&query[term][subtype]=department&limit=${limit}&page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }

      const data: ApiResponse = await response.json();
      totalPages = data.pagination.total_pages;

      const departmentPromises = data.data.map(async (department) => {
        const artworksResponse = await fetch(
          `https://api.artic.edu/api/v1/artworks/search?query[term][department_id]=${department.id}`
        );
        const artworksData = await artworksResponse.json();

        return artworksData.pagination.total !== 0
          ? { id: department.id, title: department.title }
          : null;
      });

      const departmentResults = await Promise.all(departmentPromises);

      allDepartments = allDepartments.concat(
        departmentResults.filter(
          (department): department is Department => department !== null
        )
      );

      currentPage++;
    }


    try {
      localStorage.setItem(
        departmentsCacheKey,
        JSON.stringify(allDepartments)
      );
    } catch (error) {
      console.error("Ошибка сохранения данных в localStorage:", error);
    }

    return allDepartments;
  }
);