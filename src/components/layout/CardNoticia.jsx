import { Card, Button } from 'react-bootstrap';

export default function CardNoticia( {noticia} ) {

    return (

        <Card className='Noticias-Card'>

            <Card.Img variant='top' className='Noticias-Img' src={noticia.imagen}/>

            <Card.Body className='d-flex flex-column'>
                <Card.Title className='text-center font-weight-bold'>{noticia.titulo}</Card.Title>
                <Card.Text className='justify-content-between align-items-center mt-auto'>{noticia.descripcion}</Card.Text>
                <Button variant='primary' 
                        className='Producto-Comprar-Boton mt-auto' 
                        href={noticia.url}
                        target="_blank"
                        rel='noopener noreferrer'
                        >Ver más</Button>
            </Card.Body>
        </Card>
    );

}


