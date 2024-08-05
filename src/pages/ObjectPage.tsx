import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchExhibitById } from "../thunk/fetchExhibitById";
import { RootState, useAppDispatch } from "../redux/store";
import TemplatePage from "./TemplatePage";
import "../styles/object.scss";

const ExhibitPage = () => {
  const dispatch = useAppDispatch();
  const { objectId } = useParams();
  const { exhibit, isLoading, error } = useSelector(
    (state: RootState) => state.exhibitReducer
  );
  const objectIdNumber = objectId ? parseInt(objectId, 10) : null;

  useEffect(() => {
    if (objectIdNumber) {
      dispatch(fetchExhibitById(objectIdNumber));
    }
  }, [objectIdNumber, dispatch]);

  if (isLoading) {
    return (
      <TemplatePage title="Exhibit is loading">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </TemplatePage>
    )
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exhibit) {
    return <TemplatePage title="Exhibit not found" />;
  }

  return (
    <TemplatePage title={exhibit.title}>
      <div className="object__container main-container">
        {exhibit.credit_line && (
          <p className="object__credit">{exhibit.credit_line}</p>
        )}
        <div className="object__info">
          <div className="object__image-wrapper">
            <img
              className="object__image"
              src={`https://www.artic.edu/iiif/2/${exhibit.image_id}/full/843,/0/default.jpg`}
              alt={exhibit.title}
            />
          </div>
          <div
            className={`object__about ${!exhibit.image_id && "object__alone"}`}
          >
            {exhibit.department_title && (
              <p className="object__text">
                Department: <span>{exhibit.department_title}</span>
              </p>
            )}
            {exhibit.artist_display && (
              <p className="object__text">
                Maker: <span>{exhibit.artist_display} </span>
              </p>
            )}
            {exhibit.date_display && (
              <p className="object__text">
                Date: <span>{exhibit.date_display}</span>
              </p>
            )}
            {exhibit.medium_display && (
              <p className="object__text">
                Medium: <span>{exhibit.medium_display}</span>
              </p>
            )}

            {exhibit.dimensions && (
              <p className="object__text">
                Dimensions: <span>{exhibit.dimensions}</span>
              </p>
            )}
            {exhibit.artwork_type_title && (
              <p className="object__text">
                Type: <span>{exhibit.artwork_type_title}</span>
              </p>
            )}
            {exhibit.description && (
              <p className="object__text">
                Description:{" "}
                <span>{exhibit.description.replace(/<[^>]+>/g, "")}</span>
              </p>
            )}
            {exhibit.publication_history && (
              <p className="object__text">
                Publication history: <span>{exhibit.publication_history.replace(/<[^>]+>/g, "")}</span>
              </p>
            )}
            {exhibit.provenance_text && (
              <p className="object__text">
                Origin: <span>{exhibit.provenance_text.replace(/<[^>]+>/g, "")}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </TemplatePage>
  );
};

export default ExhibitPage;
