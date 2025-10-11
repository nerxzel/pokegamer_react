import CardEvento from '../components/layout/CardEvento';
import { mockEventos } from '../utils/mockEventos';

export default function Comunidad() {
  return (
    <>
      <section id="eventos" className="seccion">
        <h2>Eventos Pokemon en Chile</h2>
        <div className="Eventos-Main">
          {mockEventos.map(evento => (
            <CardEvento key={evento.id} evento={evento} />
          ))}
        </div>
      </section>

      <section id="comentarios" className="seccion">
        <h2>Comentarios de la comunidad</h2>
        <div className="Eventos-Comentarios">
          <article className="tema">
            <h3>¿Cuál es tu Pokémon favorito?</h3>
            <p>Comparte con la comunidad cuál es tu Pokémon favorito y por qué.</p>
            <span className="eventos-meta">Iniciado por <strong>Misty</strong> | 12 respuestas</span>
          </article>
          <article className="tema">
            <h3>Intercambio de cartas TCG</h3>
            <p>Organiza intercambios de cartas con otros entrenadores.</p>
            <span className="eventos-meta">Iniciado por <strong>Brock</strong> | 8 respuestas</span>
          </article>
          <article className="tema">
            <h3>Tips para vencer la Liga Pokémon</h3>
            <p>Comparte tus mejores estrategias y consejos.</p>
            <span className="eventos-meta">Iniciado por <strong>AshKetchum</strong> | 15 respuestas</span>
          </article>
        </div>
      </section>

      <section id="ventas-comunidad" className="seccion">
        <h2>Ventas entre Entrenadores</h2>
        <div className="ventas-lista">
          <article className="venta">
            <h3>Vendo Nintendo Switch Edición Pikachu</h3>
            <p>En excelente estado, incluye caja y accesorios originales.</p>
            <span className="venta-meta">Publicado por <strong>Red</strong> | $250.000 CLP</span>
          </article>
          <article className="venta">
            <h3>Cartas TCG ultra raras</h3>
            <p>Vendo colección de cartas ultra raras de Kanto y Johto.</p>
            <span className="venta-meta">Publicado por <strong>Leaf</strong> | $100.000 CLP</span>
          </article>
        </div>
      </section>
    </>
  );
}