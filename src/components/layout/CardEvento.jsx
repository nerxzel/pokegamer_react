export default function CardEvento({ evento }) {

  return (

    <div className="Eventos-Card">

      <iframe
        src={evento.mapSrc}
        width="100%" height="250" style={{ border: 0 }}
        allowFullScreen="" loading="lazy">
      </iframe>

      <h3 className="Eventos-Titulo">{evento.title}</h3>
      
      <p className="Eventos-Desc">{evento.description}</p>
    </div>
  );
}