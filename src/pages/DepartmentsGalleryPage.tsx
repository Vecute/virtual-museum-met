import { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../redux/store";
import TemplatePage from "./TemplatePage";
import { fetchDepartments } from "../thunk/fetchDepartments";
import { useSelector } from "react-redux";
import "../styles/departments.scss";
import { Link } from "react-router-dom";

function DepartmentsGalleryPage() {
  const departments = useSelector(
    (state: RootState) => state.departmentsReducer.departments
  );
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchDepartments());
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  return (
    <TemplatePage title="Departments Gallery">
      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="departments__container">
          {departments.map((department) => (
            <Link
              key={department.id}
              to={`/search?query[term][department_id]=${department.id}&limit=20&fields=id,title,image_id,department_title`}
            >
              <div className="departments__element">
                <h2 className="departments__title">{department.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </TemplatePage>
  );
}

export default DepartmentsGalleryPage;
