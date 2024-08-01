import { BrowserRouter, Route, Routes } from "react-router-dom";
import DepartmentsGalleryPage from "./pages/DepartmentsGalleryPage";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ExhibitPage from "./pages/ObjectPage";
import AboutPage from "./pages/AboutPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DepartmentsGalleryPage />}/>
        <Route path="/departments" element={<DepartmentsGalleryPage />}/>
        <Route path="/about" element={<AboutPage />}/>
        <Route path="/contacts" element={<DepartmentsGalleryPage />}/>
        <Route path="*" element={<DepartmentsGalleryPage />} />
        <Route path="/exhibits/:objectId" element={<ExhibitPage />} />
        <Route path="/search" element={<SearchPage />} />
        {/* <Route path="one" element={<PageOne />} />
        <Route path="*" element={<UnknownPage />} /> */}
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
