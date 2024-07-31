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
  const { object, isLoading, error } = useSelector(
    (state: RootState) => state.exhibitReducer
  );
  const objectIdNumber = objectId ? parseInt(objectId, 10) : null;

  useEffect(() => {
    if (objectIdNumber) {
      dispatch(fetchExhibitById(objectIdNumber));
    }
  }, [objectIdNumber, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <TemplatePage title={object.title}>
      <div className="object__container main-container">
        {object.creditLine && <p className="object__credit">{object.creditLine}</p>}
        <div className="object__info">
          {object.primaryImage && (
            <div className="object__image-wrapper">
              <img className="object__image" src={object.primaryImage} alt={object.objectName} />
            </div>
          )}
          <div className="object__about">
            {object.accessionYear && <p className="object__text">Accession year: <span>{object.accessionYear}</span></p>}
            {object.department && <p className="object__text">Department: <span>{object.department}</span></p>}
            {object.objectName && <p className="object__text">Object name: <span>{object.objectName}</span></p>}
            {object.culture && <p className="object__text">Culture: <span>{object.culture}</span></p>}
            {object.period && <p className="object__text">Period: <span>{object.period}</span></p>}
            {object.dynasty && <p className="object__text">Dynasty: <span>{object.dynasty}</span></p>}
            {object.reign && <p className="object__text">Reign: <span>{object.reign}</span></p>}
            {object.artistDisplayName && <p className="object__text">Maker: <span>{object.artistDisplayName} {object.artistDisplayBio && `(${object.artistDisplayBio})`}</span></p>}

            {object.artistNationality && (
              <p className="object__text">Artist nationality: <span>{object.artistNationality}</span></p>
            )}
            {object.artistWikidata_URL && (
              <p className="object__text">
                Artist info:{" "}
                <a className="object__link" href={object.artistWikidata_URL}> {object.artistWikidata_URL}</a>
              </p>
            )}
            {object.objectBeginDate && object.objectEndDate && (object.objectBeginDate !== object.objectEndDate) && !object.objectDate && (
              <p className="object__text">
                Date: <span>{object.objectBeginDate} - {object.objectEndDate}</span>
              </p>
            )}
            {object.objectDate && <p className="object__text">Date: <span>{object.objectDate}</span></p>}
            {object.medium && <p className="object__text">Medium: <span>{object.medium}</span></p>}
            {object.dimensions && <p className="object__text">Dimensions: <span>{object.dimensions}</span></p>}
            {object.city && <p className="object__text">City: <span>{object.city}</span></p>}
            {object.state && <p className="object__text">State: <span>{object.state}</span></p>}
            {object.geographyType && object.country && <p className="object__text">Geography: <span>{object.geographyType} {object.country}</span></p>}
            {object.county && <p className="object__text">County: <span>{object.county}</span></p>}
            {object.region && <p className="object__text">Region: <span>{object.region}</span></p>}
            {object.subregion && <p className="object__text">Subregion: <span>{object.subregion}</span></p>}
            {object.objectURL && (
              <p className="object__text">
                Object museum page:{" "} <a className="object__link" href={object.objectURL}>{object.objectURL}</a>
              </p>
            )}
            {object.objectWikidata_URL && (
              <p className="object__text">
                Object info:{" "}
                <a className="object__link" href={object.objectWikidata_URL}>{object.objectWikidata_URL}</a>
              </p>
            )}
          </div>

        </div>
      </div>
    </TemplatePage>
  );
};

export default ExhibitPage;
