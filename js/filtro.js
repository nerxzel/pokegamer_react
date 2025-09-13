const checkboxes = document.querySelectorAll('.filtro-categoria');
const productos = document.querySelectorAll('.Producto-Box');
const searchInput = document.getElementById('search-input');

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filtrarProductos);
});

searchInput.addEventListener('input', filtrarProductos);

function filtrarProductos() {
  const categoriasSeleccionadas = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const textoBusqueda = searchInput.value.toLowerCase();

  productos.forEach(producto => {
    const categoriaProducto = producto.dataset.categoria;
    const nombreProducto = producto.querySelector('.Producto-Titulo').textContent.toLowerCase();

    const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(categoriaProducto);
    const coincideBusqueda = nombreProducto.includes(textoBusqueda);

    if (coincideCategoria && coincideBusqueda) {
      producto.style.display = 'block';
    } else { 
      producto.style.display = 'none';
    }
  })
}