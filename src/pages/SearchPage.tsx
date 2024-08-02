import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchPagination from "../utilities/SearchPagination";

const API_BASE_URL = "https://api.artic.edu/api/v1/artworks/search";

interface Artwork {
    id: string;
    title: string;
    image_id: string;
    department_title: string;
  }

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query[term][department_id]") || ""
  );
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const [totalPages, setTotalPages] = useState(1);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    setSearchParams({
      "query[term][department_id]": event.target.value,
      page: "1", // Передаем страницу как строку
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ ...searchParams, page: page.toString() }); // Преобразуем страницу в строку
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const url = new URL(API_BASE_URL)
      url.searchParams.set('limit', '20')
      url.searchParams.set('page', currentPage.toString())
      url.searchParams.set('fields', 'id,title,image_id,department_title')
      if (searchTerm) {
        url.searchParams.set('query[term][department_id]', searchTerm)
      }
      

      try {
        const response = await fetch(url.toString());
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
  }, [searchTerm, currentPage, searchParams]);

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleSearchChange} />

      {isLoading && <p>Загрузка...</p>}

      <div className="search__results">
        {results.map((result: Artwork) => (
          <div key={result.id}>
            {result.title}
            {result.image_id && (
              <div className="exhibit__image-wrapper">
                <img
                  src={`https://www.artic.edu/iiif/2/${result.image_id}/full/843,/0/default.jpg`}
                  alt={result.title}
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
