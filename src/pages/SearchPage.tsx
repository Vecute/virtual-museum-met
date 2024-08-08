import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import SearchPagination from "../utilities/SearchPagination";
import TemplatePage from "./TemplatePage";
import { fetchDepartments } from "../thunk/fetchDepartments";
import { fetchPlaceOfOrigin } from "../thunk/fetchPlaceOfOrigin";
import { RootState, useAppDispatch } from "../redux/store";
import { useSelector } from "react-redux";

const API_BASE_URL = "https://api.artic.edu/api/v1/artworks/search";

interface Artwork {
  id: string;
  title: string;
  image_id: string;
  department_title: string;
  place_of_origin: string;
  date_start: number;
  date_end: number;
}

interface DepartmentOption {
  id: string;
  title: string;
}

interface PlaceOfOriginOption {
  value: string;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [placeOfOriginFilter, setPlaceOfOriginFilter] = useState(
    searchParams.get("query[term][place_of_origin.keyword]") || ""
  );
  const [dateStartFilter, setDateStartFilter] = useState(
    searchParams.get("query[range][date_start][gte]") || ""
  );
  const [dateEndFilter, setDateEndFilter] = useState(
    searchParams.get("query[range][date_end][lte]") || ""
  );
  const [results, setResults] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [departmentOptions, setDepartmentOptions] = useState<DepartmentOption[]>(
    []
  );
  const [placeOfOriginOptions, setPlaceOfOriginOptions] =
    useState<PlaceOfOriginOption[]>([]);
  const dispatch = useAppDispatch();
  const departments = useSelector(
    (state: RootState) => state.departmentsReducer.departments
  );
  const placesOfOrigin = useSelector(
    (state: RootState) => state.placeOfOriginReducer.placeOfOrigin
  );

  // Устанавливаем initialDepartmentId из URL
  const initialDepartmentId = searchParams.get("query[term][department_id]");

  // Инициализируем departmentFilter с initialDepartmentId
  const [departmentFilter, setDepartmentFilter] = useState(
    initialDepartmentId || ""
  );

  const updateSearchParams = (newParams: {
    [key: string]: string | undefined;
  }) => {
    setSearchParams((prevParams) => {
      const mergedParams = { ...prevParams, ...newParams };

      // Remove undefined values to avoid issues with URLSearchParams
      Object.keys(mergedParams).forEach((key) => {
        if (mergedParams[key] === undefined) {
          delete mergedParams[key];
        }
      });

      navigate(`?${new URLSearchParams(mergedParams).toString()}`);
      return mergedParams;
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    updateSearchParams({
      q: event.target.value,
      page: "1",
      "query[term][department_id]": departmentFilter,
      "query[term][place_of_origin.keyword]": placeOfOriginFilter,
      "query[range][date_start][gte]": dateStartFilter,
      "query[range][date_end][lte]": dateEndFilter,
    });
  };

  const handleDepartmentFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDepartmentFilter(event.target.value);
    setCurrentPage(1);
    updateSearchParams({
      "query[term][department_id]": event.target.value,
      page: "1",
    });
  };

  const handlePlaceOfOriginFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setPlaceOfOriginFilter(selectedValue);
    updateSearchParams({
      "query[term][place_of_origin.keyword]": selectedValue,
      page: "1",
    });
  };

  const handleDateStartFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateStartFilter(event.target.value);
    setCurrentPage(1);
    updateSearchParams({
      "query[range][date_start][gte]": event.target.value,
      page: "1",
    });
  };

  const handleDateEndFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateEndFilter(event.target.value);
    setCurrentPage(1);
    updateSearchParams({
      "query[range][date_end][lte]": event.target.value,
      page: "1",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    // Устанавливаем initialDepartmentId из URL
    const initialDepartmentId = searchParams.get("query[term][department_id]");

    // Инициализируем departmentFilter с initialDepartmentId
    if (initialDepartmentId) {
      setDepartmentFilter(initialDepartmentId);
    }

    // Диспатчим fetchDepartments
    dispatch(fetchDepartments());

    // Диспатчим fetchPlaceOfOrigin
    dispatch(fetchPlaceOfOrigin());
  }, [dispatch, searchParams]);

  useEffect(() => {
    // Выполняем fetchData после загрузки департаментов
    const fetchData = async () => {
      setIsLoading(true);
      const url = new URL(API_BASE_URL);
      url.searchParams.set("limit", "20");
      url.searchParams.set("page", currentPage.toString());
      url.searchParams.set(
        "fields",
        "id,title,image_id,department_title,place_of_origin,date_start,date_end"
      );

      // Construct filter parameters for Elasticsearch query
      const filter = [];
      if (searchTerm) {
        filter.push({ match: { title: searchTerm } });
      }
      if (departmentFilter) {
        filter.push({ term: { department_id: departmentFilter } });
      }
      if (placeOfOriginFilter) {
        filter.push({
          term: {
            "place_of_origin.keyword": placeOfOriginFilter,
          },
        });
      }
      if (dateStartFilter) {
        filter.push({ range: { date_start: { gte: dateStartFilter } } });
      }
      if (dateEndFilter) {
        filter.push({ range: { date_end: { lte: dateEndFilter } } });
      }

      // Construct the request body with filter
      const requestBody = {
        query: { bool: { must: filter } },
      };

      try {
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        setResults(data.data);
        setTotalPages(data.pagination.total_pages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    searchTerm,
    departmentFilter,
    placeOfOriginFilter,
    dateStartFilter,
    dateEndFilter,
    currentPage,
    searchParams,
    departments,
  ]);

  useEffect(() => {
    setDepartmentOptions(departments);
  }, [departments]);

  useEffect(() => {
    setPlaceOfOriginOptions(placesOfOrigin);
  }, [placesOfOrigin]);

  return (
    <TemplatePage title="Search through the collection">
      <div>
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
        />

        {/* Department Filter */}
        <select value={departmentFilter} onChange={handleDepartmentFilterChange}>
          <option value="">All Departments</option>
          {isLoading ? (
            <option value="">Загрузка...</option>
          ) : (
            departmentOptions.map((department) => (
              <option key={department.id} value={department.id}>
                {department.title}
              </option>
            ))
          )}
        </select>

        {/* Place of Origin Filter */}
        <select
          value={placeOfOriginFilter}
          onChange={handlePlaceOfOriginFilterChange}
        >
          <option value="">All Places of Origin</option>
          {placeOfOriginOptions.map((place) => (
            <option key={place.value} value={place.value}>
              {place.value}
            </option>
          ))}
        </select>

        {/* Start Date Filter */}
        <input
          type="number"
          value={dateStartFilter}
          onChange={handleDateStartFilterChange}
          placeholder="Start Date"
        />

        {/* End Date Filter */}
        <input
          type="number"
          value={dateEndFilter}
          onChange={handleDateEndFilterChange}
          placeholder="End Date"
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