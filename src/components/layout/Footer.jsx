import Logo from "../../assets/Logo.png";

export default function AppFooter() {
    return (
        
        <footer>

            <div className="Footer">
                <div className="Footer-Brand">
                    {/* Cambio: La etiqueta <img> debe autocerrarse con "/>" */}
                    <img src={Logo} alt="Logo Pokémon" />
                    <p>Centro Pokémon - ¡Atrapálos a todos!</p>
                </div>

                <div className="Footer-Contacto">
                    <h4>Servicio Técnico</h4>
                    <p>Email: serviciotecnico@centropokemon.cl</p>
                    <p>Tel: +569 12345678</p>
                    <a href="#">
                        {/* No requiere cambios, pero es bueno saber que las clases de FontAwesome funcionan igual */}
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </div>

                <div className="Footer-Social">
                    <h4>Síguenos</h4>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-youtube"></i></a>
                </div>

                <div className="Footer-Fondo">
                    {/* El &copy; funciona sin problemas en JSX */}
                    <p>&copy; 2025 Tienda Pokémon. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}