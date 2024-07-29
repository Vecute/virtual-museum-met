import { useEffect } from "react";
import { RootState, useAppDispatch } from "../redux/store";
import TemplatePage from "./TemplatePage";
import { fetchDepartments } from "../thunk/fetchDepartmets";
import { useSelector } from "react-redux";

function DepartmentsGalleryPage() {
  const departments = useSelector((state: RootState) => state.departmentsReducer.departments);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

    return (
      <TemplatePage title="Departments Gallery">
    <div>
      <ul>
        {departments.map((department) => (
          // <li key={department.departmentId}>{department.displayName}</li>
          <div className="department" key={department.departmentId}>
                <div className="department__wrapper-image"><img className="department__image" src="assets/media/work1.jpg" alt=""></img></div>
                <div className="department__info">
                    <h2 className="department__title">{department.displayName}</h2>
                </div>
            </div>
        ))}
      </ul>
    </div>
      </TemplatePage>
    );
  }

export default DepartmentsGalleryPage