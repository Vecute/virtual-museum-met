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

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for search and filter values
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [departmentFilter, setDepartmentFilter] = useState(
    searchParams.get("query[term][department_id]") || ""
  );
  const [placeOfOriginFilter, setPlaceOfOriginFilter] = useState(
    searchParams.get("query[term][place_of_origin.keyword]") || ""
  );
  const [dateStartFilter, setDateStartFilter] = useState(
    searchParams.get("query[range][date_start][gte]") || ""
  );
  const [dateEndFilter, setDateEndFilter] = useState(
    searchParams.get("query[range][date_end][lte]") || ""
  );

  // State for results and loading
  const [results, setResults] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const [totalPages, setTotalPages] = useState(1);

  // Redux
  const dispatch = useAppDispatch();
  const departments = useSelector(
    (state: RootState) => state.departmentsReducer.departments
  );
  const placesOfOrigin = useSelector(
    (state: RootState) => state.placeOfOriginReducer.placeOfOrigin
  );

  // Function to update search params and navigate
  const updateSearchParams = (newParams: {
    [key: string]: string | undefined;
  }) => {
    setSearchParams((prevParams) => {
      const mergedParams = new URLSearchParams(prevParams);
      for (const key in newParams) {
        if (newParams[key] !== undefined) {
          mergedParams.set(key, newParams[key]);
        }
      }
      navigate(`?${mergedParams.toString()}`);
      return mergedParams;
    });
  };

  // Generic function to handle filter changes
  const handleFilterChange = (
    newValue: string,
    paramKey: string,
    setState: (value: string) => void
  ) => {
    setState(newValue);
    setCurrentPage(1); // Reset to page 1 when filter changes
    updateSearchParams({ [paramKey]: newValue, page: "1" });
  };

  // Handlers for individual filter changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange(event.target.value, "q", setSearchTerm);
  };

  const handleDepartmentFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleFilterChange(
      event.target.value,
      "query[term][department_id]",
      setDepartmentFilter
    );
  };

  const handlePlaceOfOriginFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleFilterChange(
      event.target.value,
      "query[term][place_of_origin.keyword]",
      setPlaceOfOriginFilter
    );
  };

  const handleDateStartFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStartDate = event.target.value;
    // Ensure start date is not greater than end date
    if (
      dateEndFilter &&
      parseInt(newStartDate, 10) > parseInt(dateEndFilter, 10)
    ) {
      setDateEndFilter(newStartDate);
    }
    handleFilterChange(newStartDate, "query[range][date_start][gte]", setDateStartFilter);
  };

  const handleDateEndFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEndDate = event.target.value;
    // Ensure end date is not less than start date
    if (
      dateStartFilter &&
      parseInt(newEndDate, 10) < parseInt(dateStartFilter, 10)
    ) {
      setDateStartFilter(newEndDate);
    }
    handleFilterChange(newEndDate, "query[range][date_end][lte]", setDateEndFilter);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams({ page: page.toString() });
  };

  // Fetch data from API
  useEffect(() => {
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
          term: { "place_of_origin.keyword": placeOfOriginFilter },
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
          headers: { "Content-Type": "application/json" },
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
  ]);

  // Fetch departments and places of origin on mount
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchPlaceOfOrigin());
  }, [dispatch]);

  const sortedPlacesOfOrigin = placesOfOrigin.slice().sort((a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });

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
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.title}
            </option>
          ))}
        </select>

        {/* Place of Origin Filter */}
        <select
          value={placeOfOriginFilter}
          onChange={handlePlaceOfOriginFilterChange}
        >
          <option value="">All Places of Origin</option>
          {sortedPlacesOfOrigin.map((place) => (
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