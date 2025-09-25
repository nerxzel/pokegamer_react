(() => {
  //la llave con la que se guardan los datos
  const STORAGE_KEY = "test_username_1"; // estado genérico (perfil, reviews, orders)
  const CART_PREFIX = 'cart_'; // prefijo para carrito por usuario/correo

  //inicia variables del programa
  const initialState = {
    profile: {
      nombre: "",
      email: "",
      pokedollars: "",
      prefs: []
    },
    cart: [], // { id, nombre, duracion, intensidad, extras[], subtotal }
    reviews: [], // { producto, rating, comentario, fecha }
    orders: [] // { id, items[], fecha, hora, metodo, total }
  };

  // helper usuario actual (definido aquí para usar en load/save)
  const getUsuarioActual = () => {
    try {
      return JSON.parse(localStorage.getItem('usuarioActual'));
    } catch {
      return null;
    }
  };

  const getCartKey = () => {
    const u = getUsuarioActual();
    if (u) {
      const ident = (u.correo || u.nombre || 'guest').toLowerCase();
      return CART_PREFIX + ident.replace(/[^a-z0-9._@-]/g, '_');
    }
    return CART_PREFIX + 'guest';
  };

  // Cargar estado base y sustituir carrito por el específico del usuario
  const loadState = () => {
    let base;
    try {
      base = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { ...initialState
      };
    } catch {
      base = { ...initialState
      };
    }
    try {
      const cartUser = JSON.parse(localStorage.getItem(getCartKey()));
      if (Array.isArray(cartUser)) {
        base.cart = cartUser;
      }
    } catch {}
    return base;
  };

  // Guardar estado: se persistirá el carrito separado para permitir múltiples usuarios
  const saveState = () => {
    try {
      // Guardar TODO menos carrito (evitar sobrescribir cuando se cambia de usuario)
      const {
        cart,
        ...rest
      } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      localStorage.setItem(getCartKey(), JSON.stringify(cart || []));
    } catch {}
  };

  //variable con los datos
  let state = loadState();

  // Asegurar carrito invitado inicial si no hay usuario y aún no existe clave
  try {
    if (!getUsuarioActual()) {
      const guestKey = CART_PREFIX + 'guest';
      if (!localStorage.getItem(guestKey)) {
        localStorage.setItem(guestKey, '[]');
        if (currentCartKey === guestKey && (!Array.isArray(state.cart) || state.cart.length === 0)) {
          state.cart = [];
        }
      }
    }
  } catch {}

  // --- Sincronización dinámica del carrito según usuario actual ---
  let currentCartKey = getCartKey();
  let lastUserIdent = (() => {
    const u = getUsuarioActual();
    return u ? (u.correo || u.nombre || null) : null;
  })();
  const ensureCartSync = (force = false) => {
    try {
      const newKey = getCartKey();
      const u = getUsuarioActual();
      const ident = u ? (u.correo || u.nombre || null) : null;
      if (force || newKey !== currentCartKey || ident !== lastUserIdent) {
        const newCart = JSON.parse(localStorage.getItem(newKey) || '[]');
        state.cart = Array.isArray(newCart) ? newCart : [];
        currentCartKey = newKey;
        lastUserIdent = ident;
      }
    } catch {
      /* noop */ }
  };
  // Exponer para que otras páginas (perfil) puedan forzar sincronización tras logout
  window.ensureCartSync = ensureCartSync;
  // Helper global para logout limpio y preparación de carrito invitado
  window.appLogout = () => {
    try {
      const u = getUsuarioActual();
      if (u && (u.correo || u.nombre)) {
        localStorage.setItem('lastUsuarioIdent', u.correo || u.nombre);
      }
      // Cerrar sesión
      localStorage.removeItem('usuarioActual');
      // Forzar sincronización inmediata al carrito guest (crearlo si no existe)
      ensureCartSync(true);
      if (!Array.isArray(state.cart)) state.cart = [];
      saveState(); // guarda cart_guest vacío (o existente) bajo la nueva clave
    } catch {}
  };
  // Revisión periódica (fallback si no hay storage events en mismo tab)
  setInterval(() => ensureCartSync(false), 2500);
  // Escuchar cambios externos (otra pestaña) de usuario o carrito
  window.addEventListener('storage', (e) => {
    if (e.key === 'usuarioActual' || (e.key && e.key.startsWith(CART_PREFIX))) {
      ensureCartSync(true);
      if (document.querySelector('.carrito-lista')) {
        // Re-render si estamos viendo el carrito
        try {
          renderCart();
        } catch {}
      }
    }
  });

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const bindProfile = () => {
    const form = $('#login-form form[aria-label="login"]') || $('#perfil form[data-screen="perfil"]');
    if (!form) return;

    // Inicializar valores
    $('#username', form) ?.setAttribute('value', state.profile.nombre || '');
    //$('#email', form)?.setAttribute('value', state.profile.email || '');
    //$('#rem', form)?.setAttribute('value', state.profile.rem || '');

    /*const prefInputs = $$('#perfil .form-check-input, #perfil input[name="pref"]');
        prefInputs.forEach(inp => {
          inp.checked = state.profile.prefs?.includes(inp.value) || false;
        });*/

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      state.profile.nombre = $('#username', form) ?.value ?.trim() || '';
      saveState();
    });
  };


  // (getUsuarioActual ya está definido arriba con la nueva lógica)

  const bindProducts = () => {
    //get los productos
    const productBoxes = $$('.Producto-Box');

    //saca el nombre y precio de cada producto
    productBoxes.forEach(box => {
      const nombre = $('.Producto-Titulo', box) ?.textContent.trim() || 'Producto';
      let precio = $('.Producto-Precio', box) ?.textContent.trim() || '$0';
      const imagen = $(".Producto-Img", box) ?.getAttribute("src") || "";
      precio = Number(precio.replaceAll('$', '').replaceAll('.', ''));

      //para que no siga si no encuentra boton
      const boton = $('.Producto-Comprar-Boton', box);
      if (!boton) return;

      //le agrega la funcionalidad para que se agregue al carro cuando aprete el boton
      boton.addEventListener('click', () => {
        // Asegurar carrito actualizado antes de mutar
        ensureCartSync();
        // Buscar si ya existe producto (misma combinación nombre + precio base)
        const existente = state.cart.find(it => it.nombre === nombre && (it.precioBase ?? it.precio) === precio);
        if (existente) {
          existente.cantidad = (existente.cantidad || 1) + 1;
        } else {
          state.cart.push({
            nombre,
            precioBase: precio,
            precio,
            imagen,
            cantidad: 1
          });
        }
        saveState(); // persiste carrito por usuario
        toast(`Agregado al carro: ${nombre} ($${precio.toLocaleString()})`);
        // Re-render si estamos en página de carrito
        if (document.querySelector('.carrito-lista')) {
          renderCart();
        }
      });
    });
  };

  const toast = (msg) => {
    // Toast simple, no depende de Bootstrap JS.
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position: 'fixed',
      inset: 'auto 1rem 1rem auto',
      background: '#178fd6',
      color: '#e6ecf2',
      border: '1px solid #178fd6',
      padding: '.6rem .8rem',
      borderRadius: '10px',
      zIndex: 9999,
      boxShadow: '0 8px 24px rgba(0,0,0,.35)'
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  };

  const renderCart = () => {
    ensureCartSync();
    const lista = $('#carrito-lista');
    const subtotalEl = document.getElementById('carrito-subtotal');
    const ivaEl = document.getElementById('carrito-iva');
    const totalEl = document.getElementById('carrito-total-pagar');
    const resumen = document.getElementById('carrito-resumen');
    const resumenDetalle = document.getElementById('carrito-resumen-detalle');
    const resumenPlaceholder = document.getElementById('carrito-resumen-placeholder');
    const descuentoLinea = document.getElementById('carrito-descuento-linea');
    const bloqueAcciones = document.getElementById('carrito-acciones');
    const usuario = getUsuarioActual();
    const esDuoc = !!usuario ?.descuentoDuoc;
    if (!lista) return;
    state.cart.forEach(it => {
      if (typeof it.cantidad !== 'number' || it.cantidad < 1) it.cantidad = 1;
    });
    const vacio = state.cart.length === 0;
    if (vacio) {
      lista.innerHTML = `
        <li style="list-style:none; width:100%; max-width:520px; margin-top:1rem;">
          <div style="padding:1.2rem 1.2rem 1.4rem; border:1px dashed rgba(255,255,255,.28); border-radius:14px; background:linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02)); backdrop-filter:blur(6px); text-align:center;">
            <p style="margin:0 0 .9rem; font-size:1rem; font-weight:500; letter-spacing:.5px;">El carrito de compras está vacío</p>
            <button class="Producto-Comprar-Boton" style="padding:.65rem 1.1rem;" onclick="window.location.href='productos.html'">Ir a productos</button>
          </div>
        </li>`;
    } else {
      lista.innerHTML = state.cart.map((item, idx) => {
        const baseUnit = item.precioBase ?? item.precio;
        const unitFinal = esDuoc ? Math.round(baseUnit * 0.8) : baseUnit;
        const lineFinal = unitFinal * item.cantidad;
        return `
        <div class="Producto-Box-carro" data-index="${idx}">
          <img class="Producto-Img-carro" src="${item.imagen}" alt="">
          <p class="Producto-info-carro">${item.nombre}</p>
          <div style="display:flex;align-items:center;gap:.25rem;">
            <button data-action="decrementar" aria-label="Restar">-</button>
            <input data-action="cantidad" type="number" value="${item.cantidad}" min="1" style="width:55px;text-align:center;">
            <button data-action="incrementar" aria-label="Sumar">+</button>
          </div>
          <p class="Producto-info-carro">$${lineFinal.toLocaleString()}${esDuoc ? ' <span style=\"color:#0c6; font-size:.65rem; font-weight:bold;\">-20%</span>' : ''}</p>
          <button class="Producto-Comprar-Boton" data-action="delete" id="borrar-item">Eliminar</button>
        </div>`;
      }).join('');
    }

    // Cálculos
    const subtotal = state.cart.reduce((sum, item) => sum + (item.precioBase ?? item.precio) * item.cantidad, 0);
    const descuento = esDuoc ? Math.round(subtotal * 0.20) : 0;
    const baseConDescuento = subtotal - descuento;
    const iva = Math.round(baseConDescuento * 0.19);
    const total = baseConDescuento + iva;

    if (resumen) {
      resumen.style.display = vacio ? 'none' : 'block';
    }
    if (bloqueAcciones) {
      bloqueAcciones.style.display = vacio ? 'none' : 'flex';
    }

    if (!vacio && subtotalEl && ivaEl && totalEl) {
      subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
      ivaEl.textContent = `$${iva.toLocaleString()}`;
      totalEl.textContent = `$${total.toLocaleString()}`;
      if (resumenDetalle) resumenDetalle.style.display = 'block';
      if (resumenPlaceholder) resumenPlaceholder.style.display = 'none';
      if (descuentoLinea) descuentoLinea.style.display = esDuoc ? 'block' : 'none';
    }

    // Handlers solo si no está vacío
    if (!vacio) {
      lista.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.closest('.Producto-Box-carro').dataset.index;
          state.cart.splice(idx, 1);
          saveState();
          renderCart();
        });
      });
      lista.querySelectorAll('input[data-action="cantidad"]').forEach(inp => {
        inp.addEventListener('change', () => {
          const parent = inp.closest('.Producto-Box-carro');
          if (!parent) return;
          const idx = parent.dataset.index;
          let val = parseInt(inp.value, 10);
          if (isNaN(val) || val < 1) val = 1;
          state.cart[idx].cantidad = val;
          saveState();
          renderCart();
        });
      });
      lista.querySelectorAll('[data-action="incrementar"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.closest('.Producto-Box-carro').dataset.index;
          state.cart[idx].cantidad++;
          saveState();
          renderCart();
        });
      });
      lista.querySelectorAll('[data-action="decrementar"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.closest('.Producto-Box-carro').dataset.index;
          state.cart[idx].cantidad = Math.max(1, state.cart[idx].cantidad - 1);
          saveState();
          renderCart();
        });
      });
    }
  };


  document.addEventListener('DOMContentLoaded', () => {
    bindProfile();
    bindProducts();
    if (document.querySelector('.carrito-lista')) {
      renderCart();
    }

    // Inicializar lógica de la página de perfil si estamos en perfil.html
    if (document.body && document.body.id === 'perfil-page' || window.location.pathname.endsWith('perfil.html')) {
      initPerfilPage();
    }
    if (window.location.pathname.endsWith('checkout.html')) {
      initCheckoutPage();
    }

    // Botón Vaciar carrito
    const btnVaciar = document.getElementById('vaciar-carrito-btn');
    if (btnVaciar) {
      btnVaciar.addEventListener('click', () => {
        ensureCartSync();
        if (state.cart.length === 0) {
          alert('El carrito ya está vacío.');
          return;
        }
        state.cart = [];
        saveState(); // carrito limpio tras compra
        renderCart();
      });
    }

    // Lógica checkout 
    function initCheckoutPage() {
      if (window.__checkoutInitDone) {
        return;
      }
      window.__checkoutInitDone = true;
      //  Inicialización CHECKOUT
      // Dentro de esta función se redefinen algunos helpers (getUsuarioActual, getCartKey, etc.) para mantener la lógica encapsulada.      const getUsuarioActual = () => { try {return JSON.parse(localStorage.getItem('usuarioActual'));}catch{return null;} };
      const CART_PREFIX = 'cart_';

      function getCartKey() {
        const u = getUsuarioActual();
        if (u) {
          const ident = (u.correo || u.nombre || 'guest').toLowerCase();
          return CART_PREFIX + ident.replace(/[^a-z0-9._@-]/g, '_');
        }
        return CART_PREFIX + 'guest';
      }
      // Carga el carrito asociado al usuario actual (o invitado). No mezcla carritos.
      function loadCart() {
        try {
          return JSON.parse(localStorage.getItem(getCartKey())) || [];
        } catch {
          return [];
        }
      }
      // Persiste un carrito (se usa principalmente al vaciar tras confirmar compra)
      function saveCart(cart) {
        try {
          localStorage.setItem(getCartKey(), JSON.stringify(cart));
        } catch {}
      }
      // Toast visual minimalista (duplicado del global para mantener aislamiento)
      function toast(msg) {
        const el = document.createElement('div');
        el.textContent = msg;
        Object.assign(el.style, {
          position: 'fixed',
          inset: 'auto 1rem 1rem auto',
          background: '#178fd6',
          color: '#e6ecf2',
          padding: '.6rem .8rem',
          borderRadius: '10px',
          zIndex: 9999,
          border: '1px solid #178fd6'
        });
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2400);
      }

      // Estado inmutable local del carrito durante la sesión de checkout, si el usuario abre otra pestaña y modifica el carrito allí
      const carrito = loadCart();
      const usuario = getUsuarioActual();
      // Referencias a elementos DOM claves de la página de checkout
      const alertBox = document.getElementById('checkout-alert');
      const itemsUL = document.getElementById('checkout-items');
      const totalesDiv = document.getElementById('checkout-totales');
      const envioLogueado = document.getElementById('envio-logueado');
      const envioInvitado = document.getElementById('envio-invitado');
      const btnConfirmar = document.getElementById('btn-confirmar-compra');
      const btnVolver = document.getElementById('btn-volver-carrito');
      const msg = document.getElementById('checkout-mensaje');

      if (!carrito.length) {
        // Si no hay ítems se muestra alerta breve y se regresa automáticamente al carrito
        if (alertBox) {
          alertBox.style.display = 'block';
        }
        setTimeout(() => {
          window.location.href = 'carrito.html';
        }, 1800);
        return;
      }

      function render() {
        const u = getUsuarioActual();
        const esDuoc = !!u ?.descuentoDuoc;
        // Renderiza la lista de ítems con precios aplicando descuento DUOC cuando corresponde
        if (itemsUL) {
          itemsUL.innerHTML = carrito.map(it => {
            const base = it.precioBase ?? it.precio;
            const unitFinal = esDuoc ? Math.round(base * 0.8) : base;
            const line = unitFinal * (it.cantidad || 1);
            return `<li style="display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap;background:rgba(255,255,255,.05);padding:.55rem .7rem;border-radius:8px;">` +
              `<span style="flex:1;min-width:160px;">${it.nombre} x ${it.cantidad||1}</span>` +
              `<span style="font-weight:bold;">$${line.toLocaleString()}${esDuoc?'<span style=\"color:#0c6;font-size:.6rem;font-weight:bold;margin-left:.35rem;\">-20%</span>':''}</span>` +
              `</li>`;
          }).join('');
        }
        // Cálculos de totales:
        // subtotal (suma precios base * cantidad)
        const subtotal = carrito.reduce((s, it) => s + (it.precioBase ?? it.precio) * (it.cantidad || 1), 0);
        // descuento (20% si es usuario DUOC)
        const descuento = (u ?.descuentoDuoc) ? Math.round(subtotal * 0.20) : 0;
        // baseDesc (subtotal - descuento)        
        const baseDesc = subtotal - descuento;
        // iva (19% de baseDesc)
        const iva = Math.round(baseDesc * 0.19);
        // total final (baseDesc + iva)
        const total = baseDesc + iva;
        if (totalesDiv) {
          totalesDiv.innerHTML = `
            <p style="margin:.2rem 0;">Subtotal: <strong>$${subtotal.toLocaleString()}</strong></p>
            ${descuento?`<p style=\"margin:.2rem 0;\">Descuento: <strong>-$${descuento.toLocaleString()}</strong></p>`:''}
            <p style="margin:.2rem 0;">IVA (19%): <strong>$${iva.toLocaleString()}</strong></p>
            <hr style="border-color:rgba(255,255,255,.2);margin:.5rem 0;">
            <p style="margin:.2rem 0;font-size:1.05rem;">Total: <strong>$${total.toLocaleString()}</strong></p>
            ${u?.descuentoDuoc?'<p style="margin:0;font-size:.65rem;opacity:.7;">Beneficio comunidad Duoc</p>':''}
          `;
        }
      }

      function setupEnvio() {
        // Selecciona qué bloque de datos de envío mostrar según haya usuario logueado o invitado.
        // Usuario logueado: se muestra la dirección principal registrada.
        // Invitado: se despliega formulario para capturar datos en la orden.
        if (usuario) {
          if (envioLogueado) envioLogueado.style.display = 'block';
          const dirs = Array.isArray(usuario.direcciones) ? usuario.direcciones : [];
          const principal = dirs.find(d => d.principal) || dirs[0];
          const dirE = document.getElementById('env-dir');
          if (dirE) dirE.textContent = principal ? principal.direccion : '-';
          const comE = document.getElementById('env-comuna');
          if (comE) comE.textContent = principal ? (principal.comuna || '-') : '-';
          const regE = document.getElementById('env-region');
          if (regE) regE.textContent = principal ? (principal.region || '-') : '-';
          const telE = document.getElementById('env-tel');
          if (telE) telE.textContent = principal ? (principal.telefono || usuario.telefono || '-') : (usuario.telefono || '-');
          if (envioInvitado) envioInvitado.style.display = 'none';
        } else {
          if (envioInvitado) envioInvitado.style.display = 'flex';
          if (envioLogueado) envioLogueado.style.display = 'none';
        }
      }

      if (btnVolver) {
        btnVolver.addEventListener('click', () => window.location.href = 'carrito.html');
      }
      const cambiarDirBtn = document.getElementById('cambiar-direccion');
      if (cambiarDirBtn) {
        cambiarDirBtn.addEventListener('click', () => window.location.href = 'perfil.html');
      }

      if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
          if (!msg) return;
          msg.textContent = '';
          // Recolectar datos de envío según modo (invitado / logueado)
          let datosEnvio = {};
          if (!usuario) {
            const nombre = document.getElementById('guest-nombre') ?.value.trim();
            const email = document.getElementById('guest-email') ?.value.trim();
            const direccion = document.getElementById('guest-direccion') ?.value.trim();
            const comuna = document.getElementById('guest-comuna') ?.value.trim();
            const region = document.getElementById('guest-region') ?.value.trim();
            const telefono = document.getElementById('guest-telefono') ?.value.trim();
            if (!nombre || !email || !direccion || !comuna || !region || !telefono) {
              msg.style.color = '#f66';
              msg.textContent = 'Completa todos los campos de envío.';
              return;
            }
            datosEnvio = {
              nombre,
              email,
              direccion,
              comuna,
              region,
              telefono
            };
          } else {
            datosEnvio = {
              tipo: 'usuario_registrado'
            };
          }
          // Recalcular totales al momento de confirmar (seguridad)
          const u = getUsuarioActual();
          const esDuoc = !!u ?.descuentoDuoc;
          const subtotal = carrito.reduce((s, it) => s + (it.precioBase ?? it.precio) * (it.cantidad || 1), 0);
          const descuento = esDuoc ? Math.round(subtotal * 0.20) : 0;
          const baseDesc = subtotal - descuento;
          const iva = Math.round(baseDesc * 0.19);
          const total = baseDesc + iva;
          // Construcción del objeto orden: incluye desglose, fecha/hora y datosEnvio
          const fecha = new Date();
          const fechaStr = fecha.toLocaleDateString('es-CL');
          const horaStr = fecha.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
          });
          const order = {
            id: 'ORD-' + Date.now(),
            items: carrito.map(it => ({
              nombre: it.nombre,
              cantidad: it.cantidad,
              unit: (it.precioBase ?? it.precio),
              unitFinal: esDuoc ? Math.round((it.precioBase ?? it.precio) * 0.8) : (it.precioBase ?? it.precio)
            })),
            subtotal,
            descuento,
            baseConDescuento: baseDesc,
            iva,
            total,
            fecha: fechaStr,
            hora: horaStr,
            envio: datosEnvio
          };
          // Persistencia de la orden: si hay usuario se adjunta a su registro, si no se guarda en guestOrders.
          if (usuario) {
            try {
              const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
              const idxU = usuarios.findIndex(x => x.correo === usuario.correo);
              if (idxU !== -1) {
                if (!Array.isArray(usuarios[idxU].orders)) usuarios[idxU].orders = [];
                usuarios[idxU].orders.push(order);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                usuario.orders = usuarios[idxU].orders;
                localStorage.setItem('usuarioActual', JSON.stringify(usuario));
              }
            } catch {}
          } else {
            try {
              const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
              guestOrders.push(order);
              localStorage.setItem('guestOrders', JSON.stringify(guestOrders));
            } catch {}
          }
          // Vaciar carrito después de confirmar (sólo el carrito asociado actual)
          saveCart([]);
          msg.style.color = '#0c6';
          msg.textContent = 'Compra confirmada. Orden ' + order.id + ' total $' + total.toLocaleString();
          toast('¡Compra exitosa!');
          // Redirección diferida para que el usuario lea el mensaje
          setTimeout(() => {
            window.location.href = 'perfil.html';
          }, 2200);
        });
      }

      render();
      setupEnvio();
    }

    // Botón Finalizar compra -> redirigir a checkout
    const btnComprar = document.getElementById('comprar-btn');
    if (btnComprar) {
      btnComprar.addEventListener('click', () => {
        if (state.cart.length === 0) {
          alert('No hay productos en el carrito.');
          return;
        }
        window.location.href = 'checkout.html';
      });
    }

    // --- Registro de usuario (solo en usuario.html) ---
    const formRegistro = document.getElementById('form-registro');
    const mensajeError = document.getElementById('mensaje-error');
    const mensajeDescuento = document.getElementById('mensaje-descuento');
    const correoInput = document.getElementById('correo');
    const fechaNacimientoInput = document.getElementById('fecha-nacimiento');
    const loginForm = document.getElementById('form-login');
    const loginMensaje = document.getElementById('login-mensaje');
    const registroSection = document.getElementById('registro-form');
    const btnMostrarRegistro = document.getElementById('mostrar-registro');
    const btnCancelarRegistro = document.getElementById('cancelar-registro');

    // helpers usuarios
    const loadUsuarios = () => {
      try {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
      } catch {
        return [];
      }
    };
    const saveUsuarios = (arr) => localStorage.setItem('usuarios', JSON.stringify(arr));
    const setUsuarioActual = (u) => localStorage.setItem('usuarioActual', JSON.stringify(u));
    const getUsuarioActual = () => {
      try {
        return JSON.parse(localStorage.getItem('usuarioActual'));
      } catch {
        return null;
      }
    };

    // Prefill de último usuario (si no hay sesión activa)
    const lastIdent = localStorage.getItem('lastUsuarioIdent');
    if (loginForm && lastIdent && !getUsuarioActual()) {
      const userInput = loginForm.querySelector('#username');
      if (userInput) userInput.value = lastIdent;
    }

    if (btnMostrarRegistro && registroSection) {
      btnMostrarRegistro.addEventListener('click', () => {
        registroSection.style.display = 'block';
        registroSection.scrollIntoView({
          behavior: 'smooth'
        });
      });
    }
    if (btnCancelarRegistro && registroSection) {
      btnCancelarRegistro.addEventListener('click', () => {
        registroSection.style.display = 'none';
      });
    }

    // Login handler
    if (loginForm && loginMensaje) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginMensaje.textContent = '';
        const userOrEmail = loginForm.username.value.trim().toLowerCase();
        const pass = loginForm.password.value;
        const usuarios = loadUsuarios();
        const encontrado = usuarios.find(u => u.correo.toLowerCase() === userOrEmail || (u.nombre && u.nombre.toLowerCase() === userOrEmail));
        if (!encontrado) {
          loginMensaje.textContent = 'Usuario no encontrado';
          if (registroSection) registroSection.style.display = 'block';
          return;
        }
        if (encontrado.password !== pass) {
          loginMensaje.textContent = 'Contraseña incorrecta';
          return;
        }
        setUsuarioActual(encontrado);
        localStorage.setItem('lastUsuarioIdent', encontrado.correo || encontrado.nombre || '');
        // Fusionar carrito guest -> carrito del usuario
        try {
          const guestKey = CART_PREFIX + 'guest';
          const userKey = CART_PREFIX + (encontrado.correo || encontrado.nombre || 'guest').toLowerCase().replace(/[^a-z0-9._@-]/g, '_');
          const guestCart = JSON.parse(localStorage.getItem(guestKey) || '[]');
          const userCart = JSON.parse(localStorage.getItem(userKey) || '[]');
          if (Array.isArray(guestCart) && guestCart.length) {
            // Combinar por nombre + precioBase (o precio)
            guestCart.forEach(gItem => {
              const base = gItem.precioBase ?? gItem.precio;
              const existente = userCart.find(uIt => uIt.nombre === gItem.nombre && (uIt.precioBase ?? uIt.precio) === base);
              if (existente) {
                existente.cantidad = (existente.cantidad || 1) + (gItem.cantidad || 1);
              } else {
                userCart.push({ ...gItem
                });
              }
            });
            localStorage.setItem(userKey, JSON.stringify(userCart));
            // Limpiar guest sólo después de fusión
            localStorage.removeItem(guestKey);
          }
        } catch {}
        // redirigir a perfil
        window.location.href = 'perfil.html';
      });
    }

    if (formRegistro && mensajeError && mensajeDescuento && correoInput && fechaNacimientoInput) {
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

      formRegistro.addEventListener('submit', function(e) {
        mensajeError.textContent = '';
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = (document.getElementById('apellidos') ?.value || '').trim();
        const direccion = (document.getElementById('direccion') ?.value || '').trim();
        const comuna = (document.getElementById('comuna') ?.value || '').trim();
        const region = (document.getElementById('region') ?.value || '').trim();
        const telefono = (document.getElementById('telefono') ?.value || '').trim();
        const correo = correoInput.value.trim();
        const fechaNacimiento = fechaNacimientoInput.value;
        const password = document.getElementById('password-reg').value;
        const confirmarPassword = document.getElementById('confirmar-registro').value;

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

        // Validar existente
        const usuarios = loadUsuarios();
        if (usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase())) {
          mensajeError.textContent = 'El correo ya está registrado.';
          e.preventDefault();
          return;
        }

        const usuario = {
          nombre,
          apellidos,
          correo,
          fechaNacimiento,
          // Proporcionar compatibilidad: mantener campos planos y nuevo arreglo direcciones
          direccion, // legacy
          telefono,
          direcciones: [{
            id: 'DIR-' + Date.now(),
            etiqueta: 'Principal',
            direccion,
            comuna,
            region,
            telefono,
            principal: true
          }],
          descuentoDuoc: correo.toLowerCase().endsWith('@duocuc.cl'),
          password,
          orders: [], // historial de compras inicial vacío
          comentarios: [], // comentarios/comunidad inicial vacío
          mensajes: [] // bandeja de entrada inicial vacía
        };
        usuarios.push(usuario);
        saveUsuarios(usuarios);
        setUsuarioActual(usuario);
        localStorage.setItem('lastUsuarioIdent', usuario.correo || usuario.nombre || '');
        // Inicializar carrito vacío del nuevo usuario si no existe (evita necesitar primer add para crear clave)
        try {
          const userKey = CART_PREFIX + (usuario.correo || usuario.nombre || 'guest').toLowerCase().replace(/[^a-z0-9._@-]/g, '_');
          if (!localStorage.getItem(userKey)) {
            localStorage.setItem(userKey, '[]');
          }
        } catch {}
        alert('¡Registro exitoso! Ahora serás llevado a tu perfil.');
        e.preventDefault();
        window.location.href = 'perfil.html';
      });
    }
    // --- Fin registro usuario ---
  });

})();

// Lógica de perfil (perfil.html)
function initPerfilPage() {
  // Evitar doble inicialización
  if (window.__perfilInitDone) {
    return;
  }
  window.__perfilInitDone = true;

  //  Inicialización PERFIL
  // Esta función se encarga de poblar y habilitar toda la interacción de la página perfil.html:

  let u = null;
  try {
    u = JSON.parse(localStorage.getItem('usuarioActual'));
  } catch {
    u = null;
  }
  if (!u) {
    window.location.href = 'usuario.html';
    return;
  }
  const $ = s => document.querySelector(s);
  $('#nombre-usuario') && ($('#nombre-usuario').textContent = u.nombre || 'Entrenador');
  $('#nombre-completo') && ($('#nombre-completo').textContent = u.nombre || '-');
  const apSpan = document.getElementById('apellidos-usuario');
  if (apSpan) apSpan.textContent = u.apellidos || '-';
  $('#email-usuario') && ($('#email-usuario').textContent = u.correo || '-');
  $('#fecha-nacimiento-usuario') && ($('#fecha-nacimiento-usuario').textContent = u.fechaNacimiento || '-');

  // Migración legacy a direcciones[] si no existe
  if (!Array.isArray(u.direcciones)) {
    u.direcciones = [];
    if (u.direccion || u.telefono) {
      u.direcciones.push({
        id: 'DIR-' + Date.now(),
        etiqueta: 'Principal',
        direccion: u.direccion || '',
        telefono: u.telefono || '',
        principal: true
      });
    }
  }
  // Garantizar que exista una dirección principal si hay al menos una
  if (!u.direcciones.some(d => d.principal) && u.direcciones.length > 0) {
    u.direcciones[0].principal = true;
  }
  const principal = u.direcciones.find(d => d.principal) || u.direcciones[0];
  const dirSpan = document.getElementById('direccion-usuario');
  if (dirSpan) dirSpan.textContent = principal ? principal.direccion : '-';
  const comunaSpan = document.getElementById('comuna-usuario');
  if (comunaSpan) comunaSpan.textContent = principal ? (principal.comuna || '-') : '-';
  const regionSpan = document.getElementById('region-usuario');
  if (regionSpan) regionSpan.textContent = principal ? (principal.region || '-') : '-';
  const telSpan = document.getElementById('telefono-usuario');
  if (telSpan) telE.textContent = principal ? principal.telefono : '-';

  // Persistir cambios de usuario en arreglo global 'usuarios'
  function guardarUsuarios(uActualizado) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const idxU = usuarios.findIndex(x => (x.correo && uActualizado.correo) ? x.correo === uActualizado.correo : x.nombre === uActualizado.nombre);
      if (idxU !== -1) {
        usuarios[idxU] = uActualizado;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
    } catch {}
  }

  // Historial de direcciones: estructura -> { id, fecha, accion, resumen }

  if (!Array.isArray(u.historialDirecciones)) u.historialDirecciones = [];

  function logHistorial(accion, payload) {
    try {
      const fecha = new Date();
      const ts = fecha.toLocaleString();
      let resumen = '';
      if (accion === 'agregar' || accion === 'marcar_principal' || accion === 'eliminar') {
        const d = payload || {};
        resumen = `${accion==='eliminar'?'Eliminada':'Dirección'} (${d.etiqueta||''}) ${d.direccion||''} ${d.comuna? '- '+d.comuna: ''} ${d.region? '- '+d.region: ''}`.trim();
        if (accion === 'marcar_principal') resumen = `Marcada como principal (${d.etiqueta||''}) ${d.direccion||''}`;
        if (accion === 'agregar' && d.principal) resumen += ' [principal]';
      } else if (accion === 'auto_reasignar_principal') {
        const d = payload || {};
        resumen = `Reasignada principal automáticamente -> (${d.etiqueta||''}) ${d.direccion||''}`;
      } else if (accion === 'editar') {
        const a = payload.antes || {};
        const d = payload.despues || {};
        resumen = `Editada (${d.etiqueta||a.etiqueta||''})`;
        if (a.direccion !== d.direccion) resumen += ` dir: "${a.direccion||''}" -> "${d.direccion||''}"`;
        if (a.comuna !== d.comuna) resumen += `, comuna: ${a.comuna||''} -> ${d.comuna||''}`;
        if (a.region !== d.region) resumen += `, región: ${a.region||''} -> ${d.region||''}`;
        if (a.telefono !== d.telefono) resumen += `, tel: ${a.telefono||''} -> ${d.telefono||''}`;
      }
      u.historialDirecciones.unshift({
        id: 'HIST-' + Date.now() + Math.random().toString(36).slice(2, 7),
        fecha: ts,
        accion,
        resumen
      });
      if (u.historialDirecciones.length > 200) u.historialDirecciones.length = 200;
      localStorage.setItem('usuarioActual', JSON.stringify(u));
      guardarUsuarios(u);
    } catch {}
  }

  // Renderiza la lista de direcciones con acciones (principal, editar, eliminar)
  function renderDirecciones() {
    const cont = document.getElementById('lista-direcciones');
    if (!cont) return;
    if (!Array.isArray(u.direcciones)) u.direcciones = [];
    if (u.direcciones.length === 0) {
      cont.innerHTML = '<p style="opacity:.7;font-size:.85rem;">No hay direcciones registradas.</p>';
      return;
    }
    cont.innerHTML = u.direcciones.map(d => `
        <div data-id="${d.id}" style="border:1px solid rgba(255,255,255,.15);padding:.7rem .8rem;border-radius:8px;display:flex;flex-direction:column;gap:.35rem;position:relative;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:.6rem;flex-wrap:wrap;">
            <strong>${d.etiqueta || 'Dirección'}</strong>
            ${d.principal ? '<span style="font-size:.65rem;background:#178fd6;padding:.15rem .45rem;border-radius:12px;">Principal</span>' : ''}
          </div>
          <div style="font-size:.85rem;line-height:1.3;">${d.direccion || ''}</div>
          <div style="font-size:.7rem;opacity:.75;">${d.comuna || ''} - ${d.region || ''}</div>
          <div style="font-size:.75rem;opacity:.8;">Tel: ${d.telefono || ''}</div>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.3rem;">
            ${!d.principal ? '<button data-action="hacer-principal" class="Producto-Comprar-Boton" style="padding:.25rem .6rem;font-size:.65rem;">Hacer principal</button>' : ''}
            <button data-action="editar" class="Producto-Comprar-Boton" style="padding:.25rem .6rem;font-size:.65rem;">Editar</button>
            ${u.direcciones.length>1 ? '<button data-action="eliminar" class="Producto-Comprar-Boton" style="padding:.25rem .6rem;font-size:.65rem;background:#633;">Eliminar</button>' : ''}
          </div>
        </div>
      `).join('');

    cont.querySelectorAll('button[data-action="hacer-principal"]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.closest('[data-id]').dataset.id;
        u.direcciones.forEach(d => d.principal = (d.id === id));
        const principal = u.direcciones.find(d => d.principal);
        if (principal) {
          if (dirSpan) dirSpan.textContent = principal.direccion;
          if (comunaSpan) comunaSpan.textContent = principal.comuna || '-';
          if (regionSpan) regionSpan.textContent = principal.region || '-';
          if (telSpan) telSpan.textContent = principal.telefono;
          u.direccion = principal.direccion;
          u.telefono = principal.telefono;
          logHistorial('marcar_principal', principal);
        }
        localStorage.setItem('usuarioActual', JSON.stringify(u));
        guardarUsuarios(u);
        renderDirecciones();
      });
    });
    cont.querySelectorAll('button[data-action="eliminar"]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.closest('[data-id]').dataset.id;
        const idx = u.direcciones.findIndex(d => d.id === id);
        if (idx !== -1) {
          const elim = { ...u.direcciones[idx]
          };
          const eraPrincipal = elim.principal;
          u.direcciones.splice(idx, 1);
          logHistorial('eliminar', elim);
          if (eraPrincipal && u.direcciones.length > 0) {
            u.direcciones.forEach((d, i) => d.principal = (i === 0));
            const reasignada = u.direcciones[0];
            logHistorial('auto_reasignar_principal', reasignada);
          }
          const principal = u.direcciones.find(d => d.principal);
          if (principal) {
            if (dirSpan) dirSpan.textContent = principal.direccion;
            if (comunaSpan) comunaSpan.textContent = principal.comuna || '-';
            if (regionSpan) regionSpan.textContent = principal.region || '-';
            if (telSpan) telSpan.textContent = principal.telefono;
            u.direccion = principal.direccion;
            u.telefono = principal.telefono;
          } else {
            if (dirSpan) dirSpan.textContent = '-';
            if (comunaSpan) comunaSpan.textContent = '-';
            if (regionSpan) regionSpan.textContent = '-';
            if (telSpan) telSpan.textContent = '-';
          }
          localStorage.setItem('usuarioActual', JSON.stringify(u));
          guardarUsuarios(u);
          renderDirecciones();
        }
      });
    });
    cont.querySelectorAll('button[data-action="editar"]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.closest('[data-id]').dataset.id;
        const d = u.direcciones.find(x => x.id === id);
        if (!d) return;
        const original = { ...d
        };
        const nuevaEtiqueta = prompt('Etiqueta:', d.etiqueta || '') || d.etiqueta;
        const nuevaDir = prompt('Dirección:', d.direccion || '') || d.direccion;
        const nuevaComuna = prompt('Comuna:', d.comuna || '') || d.comuna;
        const nuevaRegion = prompt('Región:', d.region || '') || d.region;
        const nuevoTel = prompt('Teléfono:', d.telefono || '') || d.telefono;
        d.etiqueta = nuevaEtiqueta.trim();
        d.direccion = nuevaDir.trim();
        d.comuna = nuevaComuna.trim();
        d.region = nuevaRegion.trim();
        d.telefono = nuevoTel.trim();
        if (d.principal) {
          if (dirSpan) dirSpan.textContent = d.direccion;
          if (comunaSpan) comunaSpan.textContent = d.comuna || '-';
          if (regionSpan) regionSpan.textContent = d.region || '-';
          if (telSpan) telSpan.textContent = d.telefono;
          u.direccion = d.direccion;
          u.telefono = d.telefono;
        }
        logHistorial('editar', {
          antes: original,
          despues: { ...d
          }
        });
        localStorage.setItem('usuarioActual', JSON.stringify(u));
        guardarUsuarios(u);
        renderDirecciones();
      });
    });
  }
  renderDirecciones();

  // Formulario: agregar nueva dirección
  const formAgregarDir = document.getElementById('form-agregar-direccion');
  if (formAgregarDir) {
    formAgregarDir.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const et = document.getElementById('nueva-etiqueta').value.trim() || 'Dirección';
      const di = document.getElementById('nueva-direccion').value.trim();
      const co = document.getElementById('nueva-comuna').value.trim();
      const re = document.getElementById('nueva-region').value.trim();
      const te = document.getElementById('nueva-telefono').value.trim();
      const markPrincipal = document.getElementById('nueva-principal').checked;
      const nueva = {
        id: 'DIR-' + Date.now(),
        etiqueta: et,
        direccion: di,
        comuna: co,
        region: re,
        telefono: te,
        principal: false
      };
      if (markPrincipal) {
        u.direcciones.forEach(d => d.principal = false);
        nueva.principal = true;
        u.direccion = di;
        u.telefono = te;
      }
      u.direcciones.push(nueva);
      if (u.direcciones.length === 1) {
        nueva.principal = true;
      }
      if (nueva.principal) {
        if (dirSpan) dirSpan.textContent = di;
        if (comunaSpan) comunaSpan.textContent = co || '-';
        if (regionSpan) regionSpan.textContent = re || '-';
        if (telSpan) telSpan.textContent = te;
      }
      logHistorial('agregar', nueva);
      if (nueva.principal) {
        logHistorial('marcar_principal', nueva);
      }
      localStorage.setItem('usuarioActual', JSON.stringify(u));
      guardarUsuarios(u);
      renderDirecciones();
      const msg = document.getElementById('mensaje-direccion');
      if (msg) {
        msg.textContent = 'Dirección agregada.';
        setTimeout(() => msg.textContent = '', 2200);
      }
      formAgregarDir.reset();
    });
  }

  // Formulario: editar datos de perfil (nombre, apellidos, fecha, teléfono principal)
  const formPerfil = document.getElementById('form-editar-perfil');
  if (formPerfil) {
    const inpNom = document.getElementById('editar-nombre');
    const inpApe = document.getElementById('editar-apellidos');
    const inpFec = document.getElementById('editar-fecha');
    const inpTelP = document.getElementById('editar-telefono-perfil');
    const msgPerfil = document.getElementById('mensaje-perfil');
    if (inpNom) inpNom.value = u.nombre || '';
    if (inpApe) inpApe.value = u.apellidos || '';
    if (inpFec) inpFec.value = u.fechaNacimiento || '';
    if (inpTelP) inpTelP.value = (principal && principal.telefono) || u.telefono || '';
    formPerfil.addEventListener('submit', ev => {
      ev.preventDefault();
      u.nombre = inpNom.value.trim();
      u.apellidos = inpApe.value.trim();
      u.fechaNacimiento = inpFec.value;
      const nuevoTelP = inpTelP.value.trim();
      const principalDir = u.direcciones.find(d => d.principal);
      if (principalDir) {
        principalDir.telefono = nuevoTelP;
      }
      u.telefono = nuevoTelP;
      localStorage.setItem('usuarioActual', JSON.stringify(u));
      guardarUsuarios(u);
      $('#nombre-usuario') && ($('#nombre-usuario').textContent = u.nombre || 'Entrenador');
      $('#nombre-completo') && ($('#nombre-completo').textContent = u.nombre || '-');
      if (apSpan) apSpan.textContent = u.apellidos || '-';
      if (telSpan) telSpan.textContent = nuevoTelP || '-';
      if (msgPerfil) {
        msgPerfil.textContent = 'Perfil actualizado.';
        setTimeout(() => msgPerfil.textContent = '', 2200);
      }
    });
  }

  // Mostrar beneficio si el usuario aplica a descuento DUOC
  if (u.descuentoDuoc) {
    const fila = document.getElementById('fila-beneficio');
    if (fila) fila.style.display = 'list-item';
  }

  // Listado: Compras (usa u.orders; se mantiene formato simple)
  const compras = Array.isArray(u.orders) ? u.orders : [];
  const listaCompras = document.getElementById('lista-compras');
  const vacioCompras = document.getElementById('compras-vacio');
  if (compras.length === 0) {
    if (vacioCompras) vacioCompras.style.display = 'block';
  } else if (listaCompras) {
    listaCompras.innerHTML = compras.map(c => `<li>${c.descripcion || c.item || 'Producto'} - $${(c.total||0).toLocaleString()} - ${c.fecha || ''}</li>`).join('');
  }

  // Listado: Comentarios
  const comentarios = Array.isArray(u.comentarios) ? u.comentarios : [];
  const listaComentarios = document.getElementById('lista-comentarios');
  const vacioComentarios = document.getElementById('comentarios-vacio');
  if (comentarios.length === 0) {
    if (vacioComentarios) vacioComentarios.style.display = 'block';
  } else if (listaComentarios) {
    listaComentarios.innerHTML = comentarios.map(c => `<li>${c.texto || c.comentario || ''} <span style="opacity:.7;">${c.fecha? ' - '+c.fecha: ''}</span></li>`).join('');
  }

  // Listado: Mensajes
  const mensajes = Array.isArray(u.mensajes) ? u.mensajes : [];
  const listaMensajes = document.getElementById('lista-mensajes');
  const vacioMensajes = document.getElementById('mensajes-vacio');
  if (mensajes.length === 0) {
    if (vacioMensajes) vacioMensajes.style.display = 'block';
  } else if (listaMensajes) {
    listaMensajes.innerHTML = mensajes.map(m => {
      const remitente = (m.de || m.from || 'Sistema');
      const texto = m.texto || m.mensaje || '';
      const fecha = m.fecha ? `<span style=\"opacity:.6;\"> - ${m.fecha}</span>` : '';
      return `<li><strong>De:</strong> ${remitente} - \"${texto}\" ${fecha}</li>`;
    }).join('');
  }

  // Logout (limpia usuarioActual y sincroniza carrito guest)
  const btn = document.getElementById('cerrar-sesion');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.appLogout) {
        window.appLogout();
      }
      window.location.href = 'usuario.html';
    });
  }

  // edita datos de envío planos (direccion / telefono)
  const formEnvio = document.getElementById('form-editar-envio');
  if (formEnvio) {
    const inpDir = document.getElementById('editar-direccion');
    const inpTel = document.getElementById('editar-telefono');
    const mensaje = document.getElementById('mensaje-actualizacion');
    if (inpDir) inpDir.value = u.direccion || '';
    if (inpTel) inpTel.value = u.telefono || '';
    formEnvio.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const nuevaDir = inpDir.value.trim();
      const nuevoTel = inpTel.value.trim();
      u.direccion = nuevaDir;
      u.telefono = nuevoTel;
      try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const idxU = usuarios.findIndex(x => (x.correo && u.correo) ? x.correo === u.correo : x.nombre === u.nombre);
        if (idxU !== -1) {
          usuarios[idxU].direccion = nuevaDir;
          usuarios[idxU].telefono = nuevoTel;
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
      } catch {}
      localStorage.setItem('usuarioActual', JSON.stringify(u));
      if (dirSpan) dirSpan.textContent = nuevaDir || '-';
      if (telSpan) telSpan.textContent = nuevoTel || '-';
      if (mensaje) {
        mensaje.textContent = 'Datos de envío actualizados.';
        setTimeout(() => mensaje.textContent = '', 2500);
      }
    });
  }
}