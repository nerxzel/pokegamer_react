import AppNavbar from "./components/layout/Navbar";
import AppFooter from "./components/layout/Footer";
import './style/theme.css';

export default function App() {
  return(
    <>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
          <main className="container my-4 flex-grow-1" role="main">
          </main>
        <AppFooter />
      </div>
    </>
  );

}
