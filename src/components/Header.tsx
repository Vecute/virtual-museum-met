import { useEffect, useRef, useState } from "react";
import "../styles/header.scss";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";


const Header = () => {
  const [isBurgerVisible, setIsBurgerVisible] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const handleBurgerClick = () => {
    setIsBurgerVisible((prevIsToggled) => !prevIsToggled);
  };

  useEffect(() => {
    // Функция для обработки клика вне header
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsBurgerVisible(false);
      }
    }

    // Добавляем обработчик события клика при монтировании компонента
    document.addEventListener("mousedown", handleClickOutside);
    // Удаляем обработчик события клика при размонтировании компонента
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBurgerVisible]);

  return (
    <header className="header" ref={headerRef}>
      <div className="main-container header__container">
        <a className="header__logo" href="#">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 151.2 150.6"
            fill="white"
          >
            <path
              d="M82.8,69.2v-1.6c-5.1,0-9.4-1.9-9.4-10.4V35.4h26.1v22.1c0,8.7-4.7,10-9.4,10v1.7h54.3l3-21.9h-1.2
	c-2.9,8.3-11.1,19.7-23.6,19.7h-11.1V35.3c12.6,0.2,16.2,7.2,18.3,15.5h1.4L127,17.5h-1.2c-0.4,7.9-1.2,15.5-14.3,15.5V2.3h8.4
	c12.5,0,20.7,11.4,23.6,19.7h1.2l-3-21.9H90.2v1.7c4.7,0,9.4,1.3,9.4,10v21.4H73.5V12c0-8.5,4.3-10.4,9.4-10.4V0H6.7l-3,21.9H5
	C7.9,13.6,18.7,1.6,28.2,1.6v55.5c0,7.7-6.1,10.4-11.2,10.4v1.6h23.1V1.6c15.6,0,21.1,7.6,21.4,18.2v37.3c0,7.7-6.1,10.4-11.2,10.4
	v1.6H82.8z"
            />
            <path
              d="M12.3,81.4H0.1V83c4.9,0,11.1,2.7,11.1,10.4v45.1c0,7.7-6.1,10.4-11.2,10.4v1.6h25v-1.6
	c-3.9,0-11.1-1.9-11.1-10.4V96l21.8,47.6h1l21.5-50.2v44.9c0,8.7-6.8,10.5-11.1,10.5v1.7h56.2l3-21.9h-1.2
	c-2.9,8.3-11.1,19.7-23.6,19.7h-11v-31.7c12.5,0.2,16.2,7.2,18.2,15.5h1.4l-4.1-33.3h-1.2c-0.4,7.9-1.2,15.4-14.2,15.5V83.6h6.5
	c15,0,18.7,11.9,19.5,19.8h1.2c1-8.9,4.8-20.1,18.3-20.1v67.3h23.2v-1.6c-5.1,0-11.2-2.7-11.2-10.4V83c11.8,0,20.3,14.9,22,20.4h1.2
	l-2.5-22H68.8c-5-0.2-9.6,2.8-11.4,7.5l-16.1,37.9L23.5,87.5C22.1,84.4,17.9,81.4,12.3,81.4z"
            />
          </svg>
        </a>
        <div
          onClick={handleBurgerClick}
          className={`header__toggle-menu ${isBurgerVisible ? "open" : ""}`}
        >
          <div className="header__toggle-item"></div>
        </div>
        <nav className={`header__nav ${isBurgerVisible ? "open" : ""}`}>
          <ul className="header__nav-list">
            <li className="header__list-item">
              <a className="header__link" onClick={() => {
                setIsBurgerVisible(false);
                navigate('/departments')
              }}>
                Departments
              </a>
            </li>
            <li className="header__list-item">
              <a className="header__link" onClick={() => {
                setIsBurgerVisible(false);
                navigate('/contacts')
              }}>
                Contacts
              </a>
            </li>
            <li className="header__list-item">
              <a className="header__link" onClick={() => {
                setIsBurgerVisible(false);
                navigate('/about')
              }}>
                About
              </a>
            </li>
          </ul>
        </nav>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;