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
      {object.creditLine && <p>{object.creditLine}</p>}
        {object.primaryImage && (
          <img src={object.primaryImage} alt={object.objectName} />
        )}
        {object.accessionYear && <p>Accession Year: {object.accessionYear}</p>}
        {object.department && <p>Department: {object.department}</p>}
        {object.objectName && <p>Object Name: {object.objectName}</p>}
        {object.culture && <p>Culture: {object.culture}</p>}
        {object.period && <p>Period: {object.period}</p>}
        {object.dynasty && <p>Dynasty: {object.dynasty}</p>}
        {object.reign && <p>Reign: {object.reign}</p>}
        {object.artistDisplayName && <p>Artist: {object.artistDisplayName}</p>}
        {object.artistDisplayBio && (
          <p>artistDisplayBio: {object.artistDisplayBio}</p>
        )}
        {object.artistNationality && (
          <p>artistNationality: {object.artistNationality}</p>
        )}
        {object.artistBeginDate && (
          <p>artistBeginDate: {object.artistBeginDate}</p>
        )}
        {object.artistEndDate && <p>artistEndDate: {object.artistEndDate}</p>}
        {object.artistWikidata_URL && (
          <p>
            Artist WIKI URL:
            <a href={object.artistWikidata_URL}>{object.artistWikidata_URL}</a>
          </p>
        )}
        {object.objectBeginDate && object.objectEndDate && (
          <p>
            Date: from {object.objectBeginDate} to {object.objectEndDate}
          </p>
        )}
        {object.medium && <p>Medium: {object.medium}</p>}
        {object.dimensions && <p>Dimensions: {object.dimensions}</p>}
        {object.geographyType && <p>Geography Type: {object.geographyType}</p>}
        {object.city && <p>City: {object.city}</p>}
        {object.state && <p>State: {object.state}</p>}
        {object.county && <p>County: {object.county}</p>}
        {object.country && <p>Country: {object.country}</p>}
        {object.region && <p>Region: {object.region}</p>}
        {object.subregion && <p>Subregion: {object.subregion}</p>}
        {object.objectURL && (
          <p>
            Object Museum URL: <a href={object.objectURL}>{object.objectURL}</a>
          </p>
        )}
        {object.objectWikidata_URL && (
          <p>
            Object WIKI URL:{" "}
            <a href={object.objectWikidata_URL}>{object.objectWikidata_URL}</a>
          </p>
        )}
      </div>
    </TemplatePage>
  );
};

export default ExhibitPage;
