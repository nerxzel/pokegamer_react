import AppNavbar from "./components/layout/Navbar";
import AppFooter from "./components/layout/Footer";
import './style/theme.css';

export default function App() {
  return(
    <>
      <AppNavbar />
        <main className="container my-4" role="main">
        </main>
      <AppFooter />
    </>
  );

}
