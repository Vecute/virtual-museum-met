import TemplatePage from "./TemplatePage";
import "../styles/about.scss";

function AboutPage() {

  return (
    <TemplatePage title="About">
      <div className="about__container">
        <div className="about__description">
          <h2 className="about__title-main">About the Museum</h2>
          <p className="about__text">The Metropolitan Museum of Art presents over 5,000 years of art from around the world for everyone to experience and enjoy. The Museum lives in two iconic sites in New York City - The Met Fifth Avenue and The Met Cloisters. Millions of people also take part in The Met experience online. Since its founding in 1870, The Met has always aspired to be more than a treasury of rare and beautiful objects. Every day, art comes alive in the Museum's galleries and through its exhibitions and events, revealing new ideas and unexpected connections across time and across cultures.</p>
          <h3 className="about__title-secondary">Mission Statement</h3>
          <p className="about__text">The Metropolitan Museum of Art collects, studies, conserves, and presents significant works of art across time and cultures in order to connect all people to creativity, knowledge, ideas, and one another.</p>
        </div>
        <div className="about__image-wrapper"><img className="about__image" src="/images/met-about.jpg" alt="met about" /></div>
      </div>
    </TemplatePage>
  );
}

export default AboutPage;