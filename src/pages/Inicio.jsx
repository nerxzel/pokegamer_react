import InicioSection from '../components/layout/InicioSection';
import { mockInicio } from '../utils/mockInicio';

export default function Inicio() {
  return (
    <>
      {mockInicio.map(section => (
        <InicioSection key={section.id} section={section} />
      ))}
    </>
  );
}