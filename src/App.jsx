import AppNavbar from "./components/layout/Navbar";
import AppFooter from "./components/layout/Footer";
import './style/theme.css';
import { Container } from "react-bootstrap";

export default function App({children}) {
  return(
    <>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
          <main className="flex-grow-1 py-4">
            <Container className="bg-white rounded-4 p-4 shadow-sm h-100">
              {children}
            </Container>
          </main>
        <AppFooter />
      </div>
    </>
  );

}
