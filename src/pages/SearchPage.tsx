import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TemplatePage from "./TemplatePage";
import { fetchExhibitById } from "../thunk/fetchExhibitById";
import { RootState, useAppDispatch } from "../redux/store";
import { clearExhibits } from "../redux/exhibitReducer";
import SearchPagination from "../utilities/SearchPagination";
import { fetchDepartments } from "../thunk/fetchDepartments";
import { Department } from "../redux/departmentsReducer";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({ q: "*" });
  const dispatch = useAppDispatch();
  const exhibits = useSelector(
    (state: RootState) => state.exhibitReducer.exhibits
  );
  const isLoading = useSelector(
    (state: RootState) => state.exhibitReducer.isLoading
  );
  const [filters, setFilters] = useState({
    departmentId: "",
    geoLocation: "",
    dateBegin: "",
    dateEnd: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const exhibitsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [exhibitIdsToDisplay, setExhibitIdsToDisplay] = useState<number[]>([]);

  const departments = useSelector(
    (state: RootState) => state.departmentsReducer.departments
  );

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);

    const params: { [key: string]: string } = {
      q: searchParams.get("q") || "*",
      hasImages: "true",
    };

    if (filters.departmentId) {
      params.departmentId = filters.departmentId;
    }
    if (filters.geoLocation) {
      params.geoLocation = filters.geoLocation;
    }
    if (filters.dateBegin) {
      params.dateBegin = filters.dateBegin;
    }
    if (filters.dateEnd) {
      params.dateEnd = filters.dateEnd;
    }

    setSearchParams(params);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.total) {
        setTotalPages(Math.ceil(data.total / exhibitsPerPage));
      }

      if (data.objectIDs && data.objectIDs.length > 0) {
        const startIndex = (currentPage - 1) * exhibitsPerPage;
        const endIndex = Math.min(
          startIndex + exhibitsPerPage,
          data.objectIDs.length
        );
        const exhibitIdsToLoad = data.objectIDs.slice(startIndex, endIndex);

        setExhibitIdsToDisplay(exhibitIdsToLoad);

        await Promise.all(
          exhibitIdsToLoad.map((id: number) => dispatch(fetchExhibitById(id)))
        );
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  }, [searchParams, currentPage, dispatch]);

  useEffect(() => {
    dispatch(clearExhibits());
    fetchData();
  }, [fetchData, dispatch]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <TemplatePage title="Search">
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="q"
            placeholder="Поиск..."
            value={searchParams.get("q") || ""}
            onChange={(e) => setSearchParams({ q: e.target.value })}
          />
          <button type="submit">Искать</button>

          <div>
            <label htmlFor="departmentId">Департамент:</label>
            <select
              name="departmentId"
              id="departmentId"
              value={filters.departmentId}
              onChange={handleInputChange}
            >
              <option value="">Все</option>
              {/* Отображаем опции департаментов */}
              {departments.map(
                (
                  department: Department // Уточните тип department, если знаете
                ) => (
                  <option
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.displayName}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label htmlFor="geoLocation">Локация:</label>
            <input
              type="text"
              name="geoLocation"
              id="geoLocation"
              value={filters.geoLocation}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="dateBegin">Дата начала:</label>
            <input
              type="number"
              name="dateBegin"
              id="dateBegin"
              value={filters.dateBegin}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="dateEnd">Дата окончания:</label>
            <input
              type="number"
              name="dateEnd"
              id="dateEnd"
              value={filters.dateEnd}
              onChange={handleInputChange}
            />
          </div>
        </form>

        {isLoading && <div>Загрузка...</div>}

        <div className="search__results">
          {exhibitIdsToDisplay.map((exhibitId) => {
            const exhibit = exhibits[exhibitId];

            // Рендерим компонент только если есть изображение
            return exhibit?.primaryImage ? (
              <div key={exhibitId}>
                <Link to={`/exhibits/${exhibitId}`}>
                  <div className="exhibit__image-wrapper">
                    <img
                      className="exhibit__image"
                      src={exhibit.primaryImage}
                      alt={exhibit.objectName}
                    />
                  </div>
                  {/* ... (код отображения информации об экспонате) */}
                </Link>
              </div>
            ) : null; // Возвращаем null, если изображения нет
          })}
        </div>

        <SearchPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </TemplatePage>
  );
};

export default SearchPage;
