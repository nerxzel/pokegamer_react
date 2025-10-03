import CardNoticia from '../components/layout/CardNoticia';
import { noticiasMock } from '../utils/mockNoticias';

export default function Noticias() {
    return (
        <div className='d-flex flex-wrap gap-4 justify-content-center'>
            {noticiasMock.map(noticia => (<CardNoticia key={noticia.id} noticia={noticia}/>))}
        </div>)
    }