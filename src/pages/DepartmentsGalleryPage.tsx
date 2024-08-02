import { useEffect } from "react";
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

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <TemplatePage title="Departments Gallery">
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
    </TemplatePage>
  );
}

export default DepartmentsGalleryPage;
