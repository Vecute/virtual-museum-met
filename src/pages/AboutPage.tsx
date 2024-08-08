import TemplatePage from "./TemplatePage";
import "../styles/about.scss";

function AboutPage() {

  return (
    <TemplatePage title="About">
      <div className="about__container">
        <div className="about__description">
          <h2 className="about__title-main">About the Museum</h2>
          <p className="about__text">Founded in 1879, the Art Institute of Chicago is one of the world’s major museums, housing an extraordinary collection of objects from across places, cultures, and time. We are also a place of active learning for all—dedicated to investigation, innovation, education, and dialogue—continually aspiring to greater public service and civic engagement.</p>
          <h3 className="about__title-secondary">Mission Statement</h3>
          <p className="about__text">The Art Institute of Chicago shares its singular collections with our city and the world. We collect, care for, and interpret works of art across time, cultures, geographies, and identities, centering the vision of artists and makers. We recognize that all art is made in a particular context, demanding continual, dynamic reconsideration in the present. We are a place of gathering; we foster the exchange of ideas and inspire an expansive, inclusive understanding of human creativity. </p>
        </div>
        <div className="about__image-wrapper"><img className="about__image" src="/images/uni-about.jpg" alt="uni about" /></div>
      </div>
    </TemplatePage>
  );
}

export default AboutPage;