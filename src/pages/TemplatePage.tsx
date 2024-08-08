import React from "react";
import "../styles/templatePage.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ButtonScrollUp from "../components/ButtonScrollUp";

interface TemplatePageProps {
  title: string;
  children?: React.ReactNode;
}

const TemplatePage = (props: TemplatePageProps) => {
  const { title, children } = props;

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <div
          className={`template ${title === "Search" ? "template__search" : ""}`}
        >
          <div className="main-container">

            <h1 className="template__title">{title}</h1>
            <div className="template__container">{children}</div>
          </div>
        </div>
        <ButtonScrollUp/>
        <Footer />
      </div>
    </>
  );
};

export default TemplatePage;
