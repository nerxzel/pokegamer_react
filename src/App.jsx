import AppNavbar from "./components/layout/Navbar";
import AppFooter from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import './style/theme.css';
import { Container } from "react-bootstrap";

export default function App() {
  return(
    <>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
          <main className="flex-grow-1 py-4">
            <Container className="bg-white rounded p-4 shadow-sm h-100">
              <AppRoutes />
            </Container>
          </main>
        <AppFooter />
      </div>
    </>
  );

}
