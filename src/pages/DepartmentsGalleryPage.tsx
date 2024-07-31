import { useEffect } from "react";
import { RootState, useAppDispatch } from "../redux/store";
import TemplatePage from "./TemplatePage";
import { fetchDepartments } from "../thunk/fetchDepartments";
import { useSelector } from "react-redux";
import "../styles/departments.scss";

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
          <div className="departments__element" key={department.departmentId}>
            <h2 className="departments__title">{department.displayName}</h2>
          </div>
        ))}
      </div>
    </TemplatePage>
  );
}

export default DepartmentsGalleryPage;