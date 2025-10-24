import { Card } from "react-bootstrap";

export default function CardEvento({ evento }) {

    const mapEmbed = (
        <iframe
            src={evento.mapSrc}
            width="100%" 
            height="250" 
            allowFullScreen="" 
            loading="lazy"
            title={`Ubicación de ${evento.title}`}
            className="rounded-top"/>
    );

    return (
        <Card className="eventos-card-custom h-100 text-center"> 
            {mapEmbed} 
            
            <Card.Body>

                <Card.Title as="h3" className="Eventos-Titulo">
                    {evento.title}
                </Card.Title>
                
                <Card.Text className="Eventos-Desc">
                    {evento.description}
                </Card.Text>

            </Card.Body>
        </Card>
    );
}