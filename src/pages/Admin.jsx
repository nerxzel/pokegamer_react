import Lapras from '../assets/lapras_construccion.png'

function Admin() {
  return (
    <div className='d-flex flex-column align-items-center'> 
      <h2>En construcción</h2>
      <img src={Lapras} 
            alt="Lapras" 
            width="500" 
            height="600" />
    </div>
  );
}
export default Admin;