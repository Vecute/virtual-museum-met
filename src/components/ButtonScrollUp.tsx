import "../styles/buttonScrollUp.scss";

import React, { useState, useEffect } from "react";

const ButtonScrollUp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Функция для обработки прокрутки и отображения/скрытия кнопки
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Добавляем обработчик события прокрутки при монтировании компонента
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Удаляем обработчик при размонтировании компонента
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Функция для плавной прокрутки вверх страницы
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`button-scroll-up ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
    >
      <svg fill="#ffffff" height="20px" width="20px" viewBox="0 0 330 330">
        <path
          d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
	l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
	C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
        />
      </svg>
    </button>
  );
};

export default ButtonScrollUp;
