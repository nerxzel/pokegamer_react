(() => {
  //la llave con la que se guardan los datos
  const STORAGE_KEY = "test_username_1";

  //inicia variables del programa
  const initialState = {
    profile: { nombre: "", email: "", pokedollars: "", prefs: [] },
    cart: [], // { id, nombre, duracion, intensidad, extras[], subtotal }
    reviews: [], // { producto, rating, comentario, fecha }
    orders: [] // { id, items[], fecha, hora, metodo, total }
  };

  //carga los datos ya existentes. Con el || si falla ejecuta initial state, desde 0.
  const loadState = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { ...initialState }; }
    catch { return { ...initialState }; }
  };

  //guardar datos
  const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  //variable con los datos
  let state = loadState();

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const bindProfile = () => {
    const form = $('#login-form form[aria-label="login"]') || $('#perfil form[data-screen="perfil"]');
    if (!form) return;

    // Inicializar valores
    $('#username', form)?.setAttribute('value', state.profile.nombre || '');
    //$('#email', form)?.setAttribute('value', state.profile.email || '');
    //$('#rem', form)?.setAttribute('value', state.profile.rem || '');

    /*const prefInputs = $$('#perfil .form-check-input, #perfil input[name="pref"]');
    prefInputs.forEach(inp => {
      inp.checked = state.profile.prefs?.includes(inp.value) || false;
    });*/

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      state.profile.nombre = $('#username', form)?.value?.trim() || '';
      //state.profile.email = $('#email', form)?.value?.trim() || '';
      //state.profile.rem = $('#rem', form)?.value?.trim() || '';
      //state.profile.prefs = prefInputs.filter(i => i.checked).map(i => i.value || i.id);
      saveState();
      //toast('Perfil actualizado');
      alert("Sesión iniciada")
    });
  };


  const bindProducts = () => {
    //get los productos
    const productBoxes = $$('.Producto-Box');

    //saca el nombre y precio de cada producto
    productBoxes.forEach(box => {
      const nombre = $('.Producto-Titulo', box)?.textContent.trim() || 'Producto';
      let precio = $('.Producto-Precio', box)?.textContent.trim() || '$0';
      const imagen = $(".Producto-Img", box)?.getAttribute("src") || "";
      precio = Number(precio.replaceAll('$', '').replaceAll('.', ''));

      //para que no siga si no encuentra boton
      const boton = $('.Producto-Comprar-Boton', box);
      if (!boton) return;

      //le agrega la funcionalidad para que se agregue al carro cuando aprete el boton
      boton.addEventListener('click', () => {
        state.cart.push({ nombre, precio, imagen});
        saveState();
        toast(`Agregado al carro: ${nombre} ($${precio.toLocaleString()})`);
      });
    });
  };

  const toast = (msg) => {
    // Toast simple, no depende de Bootstrap JS.
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position:'fixed', inset:'auto 1rem 1rem auto', background:'#178fd6', color:'#e6ecf2',
      border:'1px solid #178fd6', padding:'.6rem .8rem', borderRadius:'10px', zIndex:9999,
      boxShadow:'0 8px 24px rgba(0,0,0,.35)'
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  };
  
  const renderCart = () => {
    const lista = $('#carrito-lista');
    const totalSpan = $('#carrito-total-precio');

    if (!lista || !totalSpan) {
      //alert("RETURNED")
      return;
    }

    lista.innerHTML = state.cart.map((item, idx) => `
      <div class="Producto-Box-carro" data-index="${idx}">
        <img class="Producto-Img-carro" src="${item.imagen}" alt="">
        <p class="Producto-info-carro">${item.nombre}</p>
        <input type="number" value="1" min="1">
        <p class="Producto-info-carro">$${item.precio.toLocaleString()}</p>
        <p class="Producto-info-carro">$${item.precio}</p>
        <button class="Noticias-Boton" data-action="delete" id="borrar-item">Eliminar</button>
      </div>
    `).join('');

    const total = state.cart.reduce((sum, item) => sum + item.precio, 0);
    totalSpan.textContent = `$${total.toLocaleString()}`;


    lista.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.closest('.Producto-Box-carro').dataset.index;
        state.cart.splice(idx, 1);
        saveState();
        renderCart();
      });
    });
};


  document.addEventListener('DOMContentLoaded', () => {
    bindProfile();
    bindProducts();
    if (document.querySelector('.carrito-lista')) {
      renderCart();
    }

    // --- Registro de usuario (solo en usuario.html) ---
    const form = document.getElementById('form-registro');
    const mensajeError = document.getElementById('mensaje-error');
    const mensajeDescuento = document.getElementById('mensaje-descuento');
    const correoInput = document.getElementById('correo');
    const fechaNacimientoInput = document.getElementById('fecha-nacimiento');

    if (form && mensajeError && mensajeDescuento && correoInput && fechaNacimientoInput) {
      function calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--;
        }
        return edad;
      }

      correoInput.addEventListener('input', function() {
        if (correoInput.value.trim().toLowerCase().endsWith('@duocuc.cl')) {
          mensajeDescuento.style.display = 'block';
          mensajeDescuento.textContent = '¡Felicidades! Obtienes un 20% de descuento permanente por ser usuario Duoc.';
        } else {
          mensajeDescuento.style.display = 'none';
          mensajeDescuento.textContent = '';
        }
      });

      form.addEventListener('submit', function(e) {
        mensajeError.textContent = '';
        const nombre = document.getElementById('nombre').value.trim();
        const correo = correoInput.value.trim();
        const fechaNacimiento = fechaNacimientoInput.value;
        const password = document.getElementById('password-reg').value;
        const confirmarPassword = document.getElementById('confirmar-password').value;

        // Validar edad
        if (!fechaNacimiento) {
          mensajeError.textContent = 'Debes ingresar tu fecha de nacimiento.';
          e.preventDefault();
          return;
        }
        const edad = calcularEdad(fechaNacimiento);
        if (edad < 18) {
          mensajeError.textContent = 'Debes ser mayor de 18 años para registrarte.';
          e.preventDefault();
          return;
        }

        // Validar contraseñas
        if (password !== confirmarPassword) {
          mensajeError.textContent = 'Las contraseñas no coinciden.';
          e.preventDefault();
          return;
        }

        // Validar correo
        if (!correo.match(/^\S+@\S+\.\S+$/)) {
          mensajeError.textContent = 'Correo electrónico no válido.';
          e.preventDefault();
          return;
        }

        // Simulación de guardado (puedes reemplazar por integración backend)
        const usuario = {
          nombre,
          correo,
          fechaNacimiento,
          descuentoDuoc: correo.toLowerCase().endsWith('@duocuc.cl'),
        };
        localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));
        alert('¡Registro exitoso!');
        // Redirigir o limpiar formulario si se desea
        form.reset();
        mensajeDescuento.style.display = 'none';
        e.preventDefault();
      });
    }
    // --- Fin registro usuario ---
  });

})();