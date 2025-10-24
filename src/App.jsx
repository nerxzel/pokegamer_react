import AppNavbar from "./components/layout/AppNavbar";
import AppFooter from "./components/layout/AppFooter";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";


export default function App() {
  return(
    <>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
          <main className="flex-grow-1 py-4">
            <Container className="bg-white rounded-4 p-4 shadow-sm h-100">
              < Outlet/>
            </Container>
          </main>
        <AppFooter />
      </div>
    </>
  );

}
