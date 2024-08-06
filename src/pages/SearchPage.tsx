import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import SearchPagination from "../utilities/SearchPagination";
import TemplatePage from "./TemplatePage";

const API_BASE_URL = "https://api.artic.edu/api/v1/artworks/search";

interface Artwork {
  id: string;
  title: string;
  image_id: string;
  department_title: string;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query[term][department_id]") || ""
  );
  const [results, setResults] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const [totalPages, setTotalPages] = useState(1);

  // Функция для обновления параметров поиска
  const updateSearchParams = (newParams: { [key: string]: string }) => {
    setSearchParams((prevParams) => { // Используем setSearchParams с колбэком
      navigate(`?${new URLSearchParams({...prevParams, ...newParams }).toString()}`);
      return { ...prevParams, ...newParams }; 
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    updateSearchParams({
      "query[term][department_id]": event.target.value,
      page: "1",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const url = new URL(API_BASE_URL);
      url.searchParams.set("limit", "20");
      url.searchParams.set("page", currentPage.toString());
      url.searchParams.set("fields", "id,title,image_id,department_title");
      if (searchTerm) {
        url.searchParams.set("query[term][department_id]", searchTerm);
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
  }, [searchTerm, currentPage]); 

  return (
    <TemplatePage title="Search through the collection">
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by department..."
        />

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        <div className="search__results">
          {results.map((result) => (
            <Link key={result.id} to={`/exhibits/${result.id}`}>
              <div>
                <h3>{result.title}</h3>
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
            </Link>
          ))}
        </div>
        {!isLoading && (
          <SearchPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </TemplatePage>
  );
};

export default SearchPage;
