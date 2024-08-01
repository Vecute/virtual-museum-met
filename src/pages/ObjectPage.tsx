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
  const { exhibits, isLoading, error } = useSelector(
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

  const exhibit = exhibits[objectIdNumber ?? -1] ?? null; 

    if (!exhibit) {
      return <TemplatePage title='Exhibit not found'/>;
    }
    
  return (
    <TemplatePage title={exhibit.title}>
      <div className="object__container main-container">
        {exhibit.creditLine && <p className="object__credit">{exhibit.creditLine}</p>}
        <div className="object__info">
          {exhibit.primaryImage && (
            <div className="object__image-wrapper">
              <img className="object__image" src={exhibit.primaryImage} alt={exhibit.objectName} />
            </div>
          )}
          <div className={`object__about ${!exhibit.primaryImage && 'object__alone'}`}>
            {exhibit.accessionYear && <p className="object__text">Accession year: <span>{exhibit.accessionYear}</span></p>}
            {exhibit.department && <p className="object__text">Department: <span>{exhibit.department}</span></p>}
            {exhibit.objectName && <p className="object__text">Object name: <span>{exhibit.objectName}</span></p>}
            {exhibit.culture && <p className="object__text">Culture: <span>{exhibit.culture}</span></p>}
            {exhibit.period && <p className="object__text">Period: <span>{exhibit.period}</span></p>}
            {exhibit.dynasty && <p className="object__text">Dynasty: <span>{exhibit.dynasty}</span></p>}
            {exhibit.reign && <p className="object__text">Reign: <span>{exhibit.reign}</span></p>}
            {exhibit.artistDisplayName && <p className="object__text">Maker: <span>{exhibit.artistDisplayName} {exhibit.artistDisplayBio && `(${exhibit.artistDisplayBio})`}</span></p>}

            {exhibit.artistNationality && (
              <p className="object__text">Artist nationality: <span>{exhibit.artistNationality}</span></p>
            )}
            {exhibit.artistWikidata_URL && (
              <p className="object__text">
                Artist info:{" "}
                <a className="object__link" href={exhibit.artistWikidata_URL}> {exhibit.artistWikidata_URL}</a>
              </p>
            )}
            {exhibit.objectBeginDate && exhibit.objectEndDate && (exhibit.objectBeginDate !== exhibit.objectEndDate) && !exhibit.objectDate && (
              <p className="object__text">
                Date: <span>{exhibit.objectBeginDate} - {exhibit.objectEndDate}</span>
              </p>
            )}
            {exhibit.objectDate && <p className="object__text">Date: <span>{exhibit.objectDate}</span></p>}
            {exhibit.medium && <p className="object__text">Medium: <span>{exhibit.medium}</span></p>}

            {exhibit.dimensions && <p className="object__text">Dimensions: <span>{exhibit.dimensions}</span></p>}
            {exhibit.city && <p className="object__text">City: <span>{exhibit.city}</span></p>}
            {exhibit.state && <p className="object__text">State: <span>{exhibit.state}</span></p>}
            {exhibit.geographyType && exhibit.country && <p className="object__text">Geography: <span>{exhibit.geographyType} {exhibit.country}</span></p>}
            {exhibit.county && <p className="object__text">County: <span>{exhibit.county}</span></p>}
            {exhibit.region && <p className="object__text">Region: <span>{exhibit.region}</span></p>}
            {exhibit.subregion && <p className="object__text">Subregion: <span>{exhibit.subregion}</span></p>}
            {exhibit.objectURL && (
              <p className="object__text">
                Object museum page:{" "} <a className="object__link" href={exhibit.objectURL}>{exhibit.objectURL}</a>
              </p>
            )}
            {exhibit.objectWikidata_URL && (
              <p className="object__text">
                Object info:{" "}
                <a className="object__link" href={exhibit.objectWikidata_URL}>{exhibit.objectWikidata_URL}</a>
              </p>
            )}
          </div>

        </div>
      </div>
    </TemplatePage>
  );
};

export default ExhibitPage;
