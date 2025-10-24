import { Link } from 'react-router-dom';

export default function InicioSection({ section }) {
  return (
    <section id={section.id} className="seccion">
      <h2>
        <Link to={section.path}>{section.title}</Link>
      </h2>
      <p>{section.description}</p>
    </section>
  );
}