import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchPagination from "../utilities/SearchPagination";

const API_BASE_URL = "https://api.artic.edu/api/v1/artworks/search";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query[term][department_id]") || "" // Извлекаем из URL или ставим дефолтное значение
  );
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  ); // Читаем страницу из URL
  const [totalPages, setTotalPages] = useState(1);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Сбрасываем страницу на 1 при новом поиске
    setSearchParams({ search: event.target.value, page: 1 }); // Обновляем URL
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ ...searchParams, page }); // Обновляем URL
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}?query[term][department_id]=${searchTerm}&limit=20&page=${currentPage}&fields=id,title,image_id,department_title`
        );
        const data = await response.json();

        setResults(data.data);
        setTotalPages(data.pagination.total_pages);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, currentPage, searchParams]); // Добавляем searchParams в зависимости

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleSearchChange} />

      {isLoading && <p>Загрузка...</p>}

      <div className="search__results">
        {results.map((result) => (
          <div key={result.id}>
            {/* Отображение результатов поиска */}
            {result.title}
            {result.image_id && ( // Проверяем, есть ли image_id
              <div className="exhibit__image-wrapper">
                <img
                  src={`https://www.artic.edu/iiif/2/${result.image_id}/full/843,/0/default.jpg`}
                  alt={result.title} // Добавляем alt для изображения
                  className="exhibit__image"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <SearchPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SearchResults;
