/* =========================================================
   KILLA HOSPEDAJE — Núcleo de la web
   Idiomas (ES/EN), estilos por tipo de hospedaje, datos
   (demo o Firebase), pagos con Yape/Plin/transferencia,
   comprobante en PDF con QR.
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const CFG = window.FIREBASE_CONFIG || {}, DEMO = !CFG.apiKey || String(CFG.apiKey).startsWith("PEGA");
const PARAMS = new URLSearchParams(location.search);

/* ---------------- Idiomas ---------------- */
let LANG = store.get("kh_lang", null) || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en");
const T = {
  es: {
    inicio: "Inicio", habitaciones: "Habitaciones", tienda: "Tienda", miReserva: "Mi reserva", reservar: "Reservar", nuestrosHoteles: "Nuestros hoteles",
    llegada: "Llegada", salida: "Salida", huespedes: "Huéspedes", adultos: "Adultos", ninos: "Niños", buscar: "Ver disponibilidad", sede: "Hotel", todas: "Todos",
    noche: "noche", noches: "noches", desde: "desde", porNoche: "/ noche", personas: "personas", hasta: "hasta", verHab: "Ver habitaciones", reservarHab: "Reservar",
    servicios: "Servicios", ubicacion: "Ubicación y contacto", escribenos: "Escríbenos por WhatsApp", llamar: "Llamar",
    qrTit: "Tu habitación, en tu celular", qrTxt: "Al llegar encontrarás un código QR en tu habitación. Escanéalo y tendrás la clave del WiFi, la tienda, room service, tours y todo lo que necesitas sin bajar a recepción.",
    qr1: "Clave del WiFi al instante", qr2: "Pide snacks y desayuno a tu cuarto", qr3: "Limpieza, toallas o salida tarde", qr4: "Tours y taxi al aeropuerto",
    tiendaTit: "Tienda Killa", tiendaTxt: "Bebidas, snacks, artículos de viaje y recuerdos. Pide desde tu habitación o recógelo en recepción.", verTienda: "Ir a la tienda",
    paso1: "Tu estadía", paso2: "Elige tu habitación", paso3: "Tus datos", paso4: "Pago",
    sinFechas: "Elige tus fechas para ver las habitaciones libres.", ocupada: "Ocupada en esas fechas", noCabe: "Capacidad máxima: {n}", libre: "Disponible", elegida: "Elegida", elegir: "Elegir",
    mantenimiento: "No disponible", nombre: "Nombres y apellidos", docTipo: "Documento", docNum: "Número de documento", nacionalidad: "Nacionalidad", celular: "Celular (WhatsApp)",
    email: "Correo (opcional)", horaLlegada: "Hora aproximada de llegada", nota: "¿Algo que debamos saber? (opcional)", acepto: "Acepto las políticas del hospedaje",
    verPoliticas: "Ver políticas", pagarAdelanto: "Pagar adelanto", pagarTodo: "Pagar todo ahora", saldoLlegar: "El saldo lo pagas al llegar", sinSaldo: "Llegas sin nada pendiente",
    primeraNoche: "primera noche", resumen: "Tu reserva", total: "Total", pagasAhora: "Pagas ahora", saldo: "Saldo al llegar", temporada: "Temporada",
    confirmar: "Confirmar reserva", enviando: "Enviando…", errFechas: "La salida debe ser después de la llegada.", errHab: "Elige una habitación.", errDatos: "Completa tus datos.",
    errAcepto: "Acepta las políticas para continuar.", errCaptura: "Sube la captura de tu pago.", errBanco: "Elige el banco al que transferiste.", errMonto: "El monto de tu captura no coincide. Revisa o marca que recepción la revise.",
    errOcupada: "¡Uy! Alguien acaba de reservar esa habitación en esas fechas. Elige otra.", errGeneral: "No se pudo enviar. Revisa tu conexión e inténtalo otra vez.",
    okTit: "¡Reserva recibida!", okTxt: "Validaremos tu pago en minutos y te avisaremos por WhatsApp. Guarda tu comprobante: muéstralo al llegar.",
    comprobante: "Comprobante de reserva", codigo: "Código de reserva", habitacion: "Habitación", huesped: "Huésped", estado: "Estado", pagado: "Pagado", metodo: "Método",
    descargarPDF: "Descargar PDF", compartirWA: "Enviar por WhatsApp", verMiReserva: "Ver mi reserva", nuevaReserva: "Hacer otra reserva",
    est_porvalidar: "Pago en validación", est_confirmada: "Confirmada", est_checkin: "Hospedado", est_finalizada: "Finalizada", est_rechazada: "Pago rechazado", est_cancelada: "Cancelada",
    buscaReserva: "Busca tu reserva", buscaTxt: "Escribe el código que recibiste al reservar (por ejemplo KH-7K3P9Q).", buscar2: "Buscar", noExiste: "No encontramos esa reserva. Revisa el código.",
    muestraLlegar: "Muestra este código al llegar", politicas: "Políticas del hospedaje",
    // pago
    pagoCon: "Paga con", escaneaQR: "Escanea el QR con {m}", oAlNumero: "o {v} al número:", aNombre: "A nombre de", copiar: "Copiar", copiado: "Copiado",
    eligeBanco: "Elige tu banco y transfiere", eligeBancoTxt: "Toca el logo: copiamos el número de cuenta y abrimos la página de tu banco.", cuenta: "Cuenta", cciTxt: "CCI · si pagas desde otro banco",
    irBanco: "Ir a {b} para pagar ↗", tocaBanco: "👆 Elige el banco al que vas a transferir", notaCCI: "Desde el mismo banco llega al instante; desde otro banco puede tardar hasta el siguiente día hábil.",
    subeCaptura: "Sube la captura del pago", subeConstancia: "Sube la constancia de la transferencia", elegirImagen: "Elegir imagen", montoAPagar: "Monto a pagar",
    leyendo: "Leyendo tu captura…", noLeido: "No pudimos leer el monto. Recepción revisará tu captura.", coincide: "El monto de tu captura ({m}) coincide.", fechaNoHoy: "Ojo: la fecha de la captura no es de hoy.",
    noCoincide: "Tu captura dice {a} y debes pagar {b}.", forzar: "Mi captura es correcta, que recepción la revise", operacion: "Número de operación", operacionTxt: "(lo leemos de tu captura; corrígelo si hace falta)",
    // tienda
    carrito: "Tu pedido", vacio: "Aún no agregas productos.", agregar: "Agregar", entrega: "Entrega", recojo: "Recojo en recepción", aMiHab: "Llevar a mi habitación", numHab: "N.° de habitación",
    pedir: "Hacer pedido", pedidoOk: "¡Pedido recibido!", pedidoOkTxt: "Te avisamos por WhatsApp cuando esté listo.", cat_todo: "Todo", cat_bebidas: "Bebidas", cat_snacks: "Snacks", cat_desayuno: "Desayuno",
    cat_aseo: "Viaje y aseo", cat_souvenirs: "Recuerdos", cat_playa: "Playa", cat_campo: "Campo", agotado: "Agotado",
    // habitación QR
    bienvenido: "Bienvenido a la habitación {n}", wifi: "WiFi", red: "Red", clave: "Clave", horarios: "Horarios", checkoutHasta: "Check-out hasta las {h}", infoUtil: "Bueno saber",
    recepcion: "Recepción", tabInicio: "Inicio", tabTienda: "Tienda", tabServ: "Servicios", tabTours: "Tours", tabCerca: "Cerca",
    cargarHab: "Cargar a mi habitación", alRecibir: "Pagar al recibir", alRecibirTxt: "Efectivo, Yape o Plin", pinTxt: "PIN de tu estadía (te lo dieron en el check-in)", pinMal: "PIN incorrecto. Pídelo en recepción.",
    limpieza: "Limpieza", toallas: "Toallas extra", almohada: "Almohada o manta", falla: "Reportar una falla", lateCheckout: "Salida tarde", despertador: "Despertador", taxi: "Taxi",
    detalle: "Detalle", hora: "Hora", destino: "Destino", fotoOpc: "Foto (opcional)", enviar: "Enviar", solicitudOk: "¡Listo! Recepción ya recibió tu pedido.",
    pedirTour: "Reservar", fecha: "Fecha", misPedidos: "Mis pedidos", est_nuevo: "Recibido", est_preparando: "En camino", est_entregado: "Entregado", est_anulado: "Anulado", est_porvalidar2: "Pago en validación",
    alSalir: "¿Cómo estuvo tu estadía?", gracias: "¡Gracias por tu opinión!", dejaResena: "¿Nos dejas tu reseña en Google?", comoLlegar: "Cómo llegar", qrInvalido: "Este código QR no es válido. Pide ayuda en recepción.",
    estiloDemo: "Estilo", modoDemo: "Modo demo"
  },
  en: {
    inicio: "Home", habitaciones: "Rooms", tienda: "Shop", miReserva: "My booking", reservar: "Book now", nuestrosHoteles: "Our hotels",
    llegada: "Check-in", salida: "Check-out", huespedes: "Guests", adultos: "Adults", ninos: "Children", buscar: "Check availability", sede: "Hotel", todas: "All",
    noche: "night", noches: "nights", desde: "from", porNoche: "/ night", personas: "guests", hasta: "up to", verHab: "See rooms", reservarHab: "Book",
    servicios: "Amenities", ubicacion: "Location & contact", escribenos: "Message us on WhatsApp", llamar: "Call",
    qrTit: "Your room, on your phone", qrTxt: "You'll find a QR code in your room. Scan it to get the WiFi password, shop, room service, tours and everything you need without going to the front desk.",
    qr1: "WiFi password instantly", qr2: "Order snacks and breakfast to your room", qr3: "Cleaning, towels or late check-out", qr4: "Tours and airport taxi",
    tiendaTit: "Killa Shop", tiendaTxt: "Drinks, snacks, travel essentials and souvenirs. Order from your room or pick up at the front desk.", verTienda: "Go to the shop",
    paso1: "Your stay", paso2: "Choose your room", paso3: "Your details", paso4: "Payment",
    sinFechas: "Choose your dates to see available rooms.", ocupada: "Booked on those dates", noCabe: "Max capacity: {n}", libre: "Available", elegida: "Selected", elegir: "Select",
    mantenimiento: "Unavailable", nombre: "Full name", docTipo: "ID type", docNum: "ID number", nacionalidad: "Nationality", celular: "Mobile (WhatsApp)",
    email: "Email (optional)", horaLlegada: "Estimated arrival time", nota: "Anything we should know? (optional)", acepto: "I accept the hotel policies",
    verPoliticas: "See policies", pagarAdelanto: "Pay a deposit", pagarTodo: "Pay in full now", saldoLlegar: "Pay the balance on arrival", sinSaldo: "Nothing left to pay on arrival",
    primeraNoche: "first night", resumen: "Your booking", total: "Total", pagasAhora: "You pay now", saldo: "Balance on arrival", temporada: "Season",
    confirmar: "Confirm booking", enviando: "Sending…", errFechas: "Check-out must be after check-in.", errHab: "Choose a room.", errDatos: "Please complete your details.",
    errAcepto: "Please accept the policies to continue.", errCaptura: "Upload your payment screenshot.", errBanco: "Choose the bank you transferred to.", errMonto: "Your screenshot amount doesn't match. Check it or let the front desk review it.",
    errOcupada: "Oops! Someone just booked that room on those dates. Please choose another.", errGeneral: "It couldn't be sent. Check your connection and try again.",
    okTit: "Booking received!", okTxt: "We'll validate your payment within minutes and confirm on WhatsApp. Keep your voucher and show it on arrival.",
    comprobante: "Booking voucher", codigo: "Booking code", habitacion: "Room", huesped: "Guest", estado: "Status", pagado: "Paid", metodo: "Method",
    descargarPDF: "Download PDF", compartirWA: "Send via WhatsApp", verMiReserva: "View my booking", nuevaReserva: "Make another booking",
    est_porvalidar: "Payment under review", est_confirmada: "Confirmed", est_checkin: "Checked in", est_finalizada: "Completed", est_rechazada: "Payment rejected", est_cancelada: "Cancelled",
    buscaReserva: "Find your booking", buscaTxt: "Enter the code you received when booking (e.g. KH-7K3P9Q).", buscar2: "Search", noExiste: "We couldn't find that booking. Check the code.",
    muestraLlegar: "Show this code on arrival", politicas: "Hotel policies",
    pagoCon: "Pay with", escaneaQR: "Scan the QR with {m}", oAlNumero: "or send it to:", aNombre: "Account holder", copiar: "Copy", copiado: "Copied",
    eligeBanco: "Choose your bank and transfer", eligeBancoTxt: "Tap a logo: we copy the account number and open your bank's website.", cuenta: "Account", cciTxt: "CCI · interbank code",
    irBanco: "Go to {b} to pay ↗", tocaBanco: "👆 Choose the bank you'll transfer to", notaCCI: "Same-bank transfers arrive instantly; from another bank it may take until the next business day.",
    subeCaptura: "Upload your payment screenshot", subeConstancia: "Upload your transfer receipt", elegirImagen: "Choose image", montoAPagar: "Amount to pay",
    leyendo: "Reading your screenshot…", noLeido: "We couldn't read the amount. The front desk will review it.", coincide: "Your screenshot amount ({m}) matches.", fechaNoHoy: "Note: the screenshot date isn't today.",
    noCoincide: "Your screenshot says {a} and you must pay {b}.", forzar: "My screenshot is correct, let the front desk review it", operacion: "Transaction number", operacionTxt: "(read from your screenshot; fix it if needed)",
    carrito: "Your order", vacio: "Your cart is empty.", agregar: "Add", entrega: "Delivery", recojo: "Pick up at front desk", aMiHab: "Deliver to my room", numHab: "Room no.",
    pedir: "Place order", pedidoOk: "Order received!", pedidoOkTxt: "We'll message you on WhatsApp when it's ready.", cat_todo: "All", cat_bebidas: "Drinks", cat_snacks: "Snacks", cat_desayuno: "Breakfast",
    cat_aseo: "Travel & care", cat_souvenirs: "Souvenirs", cat_playa: "Beach", cat_campo: "Countryside", agotado: "Sold out",
    bienvenido: "Welcome to room {n}", wifi: "WiFi", red: "Network", clave: "Password", horarios: "Hours", checkoutHasta: "Check-out until {h}", infoUtil: "Good to know",
    recepcion: "Front desk", tabInicio: "Home", tabTienda: "Shop", tabServ: "Services", tabTours: "Tours", tabCerca: "Nearby",
    cargarHab: "Charge to my room", alRecibir: "Pay on delivery", alRecibirTxt: "Cash, Yape or Plin", pinTxt: "Your stay PIN (given at check-in)", pinMal: "Wrong PIN. Ask the front desk.",
    limpieza: "Housekeeping", toallas: "Extra towels", almohada: "Pillow or blanket", falla: "Report an issue", lateCheckout: "Late check-out", despertador: "Wake-up call", taxi: "Taxi",
    detalle: "Details", hora: "Time", destino: "Destination", fotoOpc: "Photo (optional)", enviar: "Send", solicitudOk: "Done! The front desk got your request.",
    pedirTour: "Book", fecha: "Date", misPedidos: "My requests", est_nuevo: "Received", est_preparando: "On its way", est_entregado: "Delivered", est_anulado: "Cancelled", est_porvalidar2: "Payment under review",
    alSalir: "How was your stay?", gracias: "Thanks for your feedback!", dejaResena: "Would you leave us a Google review?", comoLlegar: "Directions", qrInvalido: "This QR code isn't valid. Please ask the front desk.",
    estiloDemo: "Style", modoDemo: "Demo mode"
  }
};
const t = (k, v) => { let s = (T[LANG] && T[LANG][k]) ?? T.es[k] ?? k; if (v) for (const x in v) s = s.replace("{" + x + "}", v[x]); return s; };
const L = (o, f) => (o && LANG === "en" && o[f + "_en"]) || (o ? o[f] : "");
function setLang(l) { LANG = l; store.set("kh_lang", l); location.reload(); }

/* ---------------- Utilidades ---------------- */
const S = n => "S/ " + ((+n || 0) % 1 ? (+n).toFixed(2) : (+n || 0));
const isoD = d => { const z = new Date(d); z.setMinutes(z.getMinutes() - z.getTimezoneOffset()); return z.toISOString().slice(0, 10); };
const hoyISO = () => isoD(new Date());
const addD = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return isoD(d); };
const nochesDe = (a, b) => { const l = []; if (!a || !b || b <= a) return l; for (let d = a; d < b; d = addD(d, 1)) l.push(d); return l; };
const fmtF = (iso, largo) => iso ? new Date(iso + "T12:00:00").toLocaleDateString(LANG === "en" ? "en-US" : "es-PE", largo ? { weekday: "long", day: "numeric", month: "long", year: "numeric" } : { weekday: "short", day: "numeric", month: "short" }) : "";
const codigo = (p = "KH") => p + "-" + Array.from(crypto.getRandomValues(new Uint8Array(6)), b => "23456789ABCDEFGHJKMNPQRSTUVWXYZ"[b % 31]).join("");
const wa = (num, txt) => `https://wa.me/${String(num || "").replace(/\D/g, "")}${txt ? "?text=" + encodeURIComponent(txt) : ""}`;
function toast(m, bad) { let x = $("#toast"); if (!x) { x = document.createElement("div"); x.id = "toast"; x.setAttribute("role", "status"); document.body.appendChild(x); } x.textContent = m; x.className = "show" + (bad ? " bad" : ""); clearTimeout(x._t); x._t = setTimeout(() => x.className = "", 3200); }
const IMG = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
const foto = (id, alt, w) => id ? `<img src="${String(id).startsWith("data:") || String(id).startsWith("http") ? esc(id) : IMG(id, w)}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">` : "";
function cargarScript(src) { return new Promise((ok, no) => { if ($(`script[src="${src}"]`)) return ok(); const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }

/* ---------------- Íconos ---------------- */
const IC = {
  wifi: '<path d="M5 12.6a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0"/><circle cx="12" cy="19.5" r="1"/>',
  tv: '<rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 21h8"/>', escritorio: '<path d="M3 8h18M5 8v12M19 8v12M5 13h6"/>',
  agua: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>', frigobar: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 9h12M9 5v2M9 12v3"/>',
  balcon: '<path d="M3 21h18M5 21V11M19 21V11M9 21V11M15 21V11M3 11h18M7 11V4h10v7"/>', tina: '<path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V5a2 2 0 0 1 4 0"/>',
  calefaccion: '<path d="M12 22a6 6 0 0 0 6-6c0-3-2-5-3-8-2 2-3 3-3 5-1-1-2-2-2-3-2 2-4 4-4 6a6 6 0 0 0 6 6z"/>', mate: '<path d="M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M9 2v3M13 2v3"/>',
  aire: '<path d="M3 8h13a3 3 0 1 0-3-3M3 12h17a3 3 0 1 1-3 3M3 16h8"/>', terraza: '<path d="M12 2v4M4 10h16L12 4zM12 10v11M7 21h10"/>', hamaca: '<path d="M2 6l4 2M22 6l-4 2M6 8c2 6 10 6 12 0M3 21h18"/>',
  ventilador: '<circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 4-6 6-4s-2 6-6 6M14 12c4 0 6 4 4 6s-6-2-6-6M12 14c0 4-4 6-6 4s2-6 6-6M10 12c-4 0-6-4-4-6s6 2 6 6"/>',
  chimenea: '<path d="M3 21V9h18v12M7 21v-6h10v6M12 18c1.5 0 2-1 2-2 0-1.5-2-3-2-3s-2 1.5-2 3c0 1 .5 2 2 2zM5 9V4h4v5"/>', cocina: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><path d="M3 13h18"/>',
  parrilla: '<path d="M4 9h16a8 8 0 0 1-16 0zM8 17l-2 4M16 17l2 4M9 5c0-1 1-1 1-2M13 5c0-1 1-1 1-2"/>',
  bed: '<path d="M2 18V6M2 14h20v4M22 18v-6a3 3 0 0 0-3-3H10v5M6 11h.01"/>', users: '<circle cx="9" cy="8" r="4"/><path d="M1 21a8 8 0 0 1 16 0M17 4a4 4 0 0 1 0 8M23 21a8 8 0 0 0-5-7.4"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', pin: '<path d="M12 22s8-7.6 8-13a8 8 0 0 0-16 0c0 5.4 8 13 8 13z"/><circle cx="12" cy="9" r="3"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  wa: '<path d="M3 21l1.6-4.7A9 9 0 1 1 8 19.6z"/><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1.2-1.2 2 .8v1.6c-4 .5-8.7-4.2-8.2-8.2h1.6l.8 2z"/>',
  check: '<path d="M5 12l5 5L20 7"/>', x: '<path d="M18 6L6 18M6 6l12 12"/>', menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6"/>', lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
  home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>', bag: '<path d="M6 7h12l1 14H5zM9 7a3 3 0 0 1 6 0"/>', bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>', compass: '<circle cx="12" cy="12" r="10"/><path d="M16 8l-2 6-6 2 2-6z"/>',
  broom: '<path d="M19 3l-7 7M14 8l-9 9 2 4 4 2 9-9z"/>', towel: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 8h14M9 13h6"/>', pillow: '<path d="M4 8c0-2 2-3 8-3s8 1 8 3v8c0 2-2 3-8 3s-8-1-8-3z"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>', alarm: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M5 3L2 6M19 3l3 3"/>',
  car: '<path d="M5 17h14M3 17v-5l2-5h14l2 5v5M7 17v2M17 17v2"/><circle cx="7.5" cy="13.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/>', star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  wave: '<path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>', tree: '<path d="M12 22v-6M12 2l7 10h-4l4 6H5l4-6H5z"/>', mountain: '<path d="M3 20l6-11 4 6 2-3 6 8z"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  coffee: '<path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 1v3M10 1v3M14 1v3"/>', suitcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M8 11v5M16 11v5"/>',
  park: '<circle cx="12" cy="12" r="10"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>', pool: '<path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8"/>',
  fire: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7z"/>', horse: '<path d="M4 20l3-8 2-5 4-3 5 2 2 4-3 1-2-2-1 4 2 7M7 12h6"/>',
  pet: '<circle cx="5" cy="10" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19" cy="10" r="2"/><path d="M12 12c-3 0-6 4-6 7 0 2 2 2 3 2s2-1 3-1 2 1 3 1 3 0 3-2c0-3-3-7-6-7z"/>',
  shield: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>', camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>', minus: '<path d="M5 12h14"/>', plus: '<path d="M12 5v14M5 12h14"/>'
};
const ico = (n, c = "") => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || IC.check}</svg>`;
const AMEN = { wifi: ["WiFi", "WiFi"], tv: ["TV cable", "Cable TV"], escritorio: ["Escritorio", "Desk"], agua: ["Agua caliente", "Hot water"], frigobar: ["Frigobar", "Minibar"], balcon: ["Balcón", "Balcony"],
  tina: ["Tina", "Bathtub"], calefaccion: ["Calefacción", "Heating"], mate: ["Mate de coca", "Coca tea"], aire: ["Aire acondicionado", "A/C"], terraza: ["Terraza", "Terrace"], hamaca: ["Hamaca", "Hammock"],
  ventilador: ["Ventilador", "Fan"], chimenea: ["Chimenea", "Fireplace"], cocina: ["Cocina", "Kitchen"], parrilla: ["Parrilla", "Grill"] };
const amenTxt = k => (AMEN[k] || [k, k])[LANG === "en" ? 1 : 0];

/* ---------------- Estilos por tipo de hospedaje ---------------- */
const TEMAS = {
  ciudad: { n: ["Ciudad", "City"], foto: "1566073771259-6a8506099945", ic: "building",
    h1: ["Descansa en el corazón de la ciudad", "Rest in the heart of the city"], sub: ["Habitaciones cómodas, WiFi rápido y todo cerca. Ideal para trabajo o escapadas.", "Comfortable rooms, fast WiFi and everything nearby. Ideal for work or getaways."],
    serv: [["wifi", "WiFi de alta velocidad", "High-speed WiFi"], ["coffee", "Desayuno buffet", "Buffet breakfast"], ["escritorio", "Zona de trabajo", "Work area"], ["car", "Estacionamiento", "Parking"], ["clock", "Recepción 24 h", "24 h front desk"], ["file", "Factura para empresas", "Company invoices"]] },
  turistico: { n: ["Turístico", "Tourist"], foto: "1526392060635-9d6019884377", ic: "mountain",
    h1: ["Tu base para descubrir el Perú", "Your base to discover Peru"], sub: ["Casonas con historia, mate de coca de bienvenida y tours con salida desde tu hospedaje.", "Historic houses, welcome coca tea and tours departing from your door."],
    serv: [["compass", "Tours y excursiones", "Tours & excursions"], ["car", "Traslado al aeropuerto", "Airport transfer"], ["suitcase", "Guarda equipaje", "Luggage storage"], ["mate", "Mate de coca 24 h", "Coca tea 24 h"], ["coffee", "Desayuno desde las 5:30", "Breakfast from 5:30"], ["globe", "Atención en inglés", "English spoken"]] },
  playa: { n: ["Playa", "Beach"], foto: "1507525428034-b723cf961d3e", ic: "wave",
    h1: ["Despierta frente al mar", "Wake up by the sea"], sub: ["Piscina, hamacas y atardeceres que no se olvidan. Tu verano empieza aquí.", "Pool, hammocks and unforgettable sunsets. Your summer starts here."],
    serv: [["pool", "Piscina", "Swimming pool"], ["sun", "Sombrillas y camastros", "Umbrellas & loungers"], ["wave", "Clases de surf", "Surf lessons"], ["coffee", "Bar y desayuno", "Bar & breakfast"], ["hamaca", "Hamacas", "Hammocks"], ["towel", "Toallas de playa", "Beach towels"]] },
  campo: { n: ["Campo", "Countryside"], foto: "1449158743715-0a90ebb6d2d8", ic: "tree",
    h1: ["Respira campo, vuelve a lo simple", "Breathe the countryside, back to basics"], sub: ["Bungalows de madera, fogata bajo las estrellas y caminatas entre el bosque.", "Wooden bungalows, bonfires under the stars and forest hikes."],
    serv: [["fire", "Fogata", "Bonfire"], ["parrilla", "Zona de parrilla", "Grill area"], ["horse", "Paseos a caballo", "Horseback rides"], ["tree", "Caminatas guiadas", "Guided hikes"], ["pet", "Pet friendly", "Pet friendly"], ["coffee", "Desayuno de chacra", "Farm breakfast"]] }
};
const temaForzado = () => DEMO ? store.get("kh_tema_demo", null) : null;
const temaDe = s => temaForzado() || (s && s.tipo) || "turistico";
const TX = (arr) => arr[LANG === "en" ? 1 : 0];
function aplicarTema(tema) { document.documentElement.dataset.tema = TEMAS[tema] ? tema : "turistico"; }

/* ---------------- Datos: demo (este navegador) o Firebase ---------------- */
const FB_V = "10.12.2"; let FBX = null;
async function fb() {
  if (FBX) return FBX;
  const base = `https://www.gstatic.com/firebasejs/${FB_V}/`;
  const [app, fs] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-firestore.js")]);
  FBX = { fs, db: fs.getFirestore(app.getApps().length ? app.getApp() : app.initializeApp(CFG)) };
  return FBX;
}
const LDB = {
  get() { let d = store.get("kh_db", null); if (!d) { d = window.KH_SEMILLA(); store.set("kh_db", d); } return d; },
  save(d) { store.set("kh_db", d); }
};
const arr = o => Object.entries(o || {}).map(([id, v]) => ({ ...v, id: v.id || id }));
let CAT = null;
const DB = {
  async catalogo() {
    if (CAT) return CAT;
    const D = window.KH_DATOS;
    if (DEMO) { const d = LDB.get(); CAT = { aj: { ...D.ajustes, ...(d.ajustes.general || {}) }, sedes: arr(d.sedes).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)), habs: arr(d.habitaciones), prods: arr(d.productos) }; }
    else {
      let c = null; try { c = JSON.parse(sessionStorage.getItem("kh_cat")); } catch (e) {}
      if (c && c.v === 1 && Date.now() - c.t < 120000) CAT = c.d;
      else {
        try {
          const { fs, db } = await fb(), g = async n => (await fs.getDocs(fs.collection(db, n))).docs.map(x => ({ ...x.data(), id: x.id }));
          const [aj, sedes, habs, prods] = await Promise.all([fs.getDoc(fs.doc(db, "ajustes", "general")).then(x => x.exists() ? x.data() : {}), g("sedes"), g("habitaciones"), g("productos")]);
          CAT = { aj: { ...D.ajustes, ...aj }, sedes: (sedes.length ? sedes : D.sedes).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)), habs: habs.length ? habs : D.habitaciones, prods: prods.length ? prods : D.productos };
          sessionStorage.setItem("kh_cat", JSON.stringify({ v: 1, t: Date.now(), d: CAT }));
        } catch (e) { console.warn("Firebase:", e.message); CAT = { aj: D.ajustes, sedes: D.sedes, habs: D.habitaciones, prods: D.productos }; }
      }
    }
    CAT.sedes = CAT.sedes.filter(s => s.activa !== false); CAT.habs = CAT.habs.filter(h => h.activa !== false); CAT.prods = CAT.prods.filter(p => p.activo !== false);
    return CAT;
  },
  async ocupacion(desde, hasta) {   // noches ocupadas entre [desde, hasta)
    if (DEMO) return arr(LDB.get().ocupacion).filter(o => o.fecha >= desde && o.fecha < hasta);
    const { fs, db } = await fb();
    const q = fs.query(fs.collection(db, "ocupacion"), fs.where("fecha", ">=", desde), fs.where("fecha", "<", hasta));
    return (await fs.getDocs(q)).docs.map(x => x.data());
  },
  async reservar(r, pago) {
    const noches = nochesDe(r.llegada, r.salida);
    if (DEMO) {
      const d = LDB.get();
      if (noches.some(f => d.ocupacion[r.hab + "_" + f])) throw Object.assign(new Error("ocupada"), { code: "ocupada" });
      d.reservas[r.codigo] = r; noches.forEach(f => d.ocupacion[r.hab + "_" + f] = { hab: r.hab, sede: r.sede, fecha: f, reserva: r.codigo, estado: "reservada" });
      d.pagos_web[r.codigo] = pago; LDB.save(d); return r;
    }
    const { fs, db } = await fb(), b = fs.writeBatch(db);
    b.set(fs.doc(db, "reservas", r.codigo), r);
    noches.forEach(f => b.set(fs.doc(db, "ocupacion", r.hab + "_" + f), { hab: r.hab, sede: r.sede, fecha: f, reserva: r.codigo, estado: "reservada" }));
    b.set(fs.doc(db, "pagos_web", r.codigo), pago);
    try { await b.commit(); } catch (e) { if (/permission/i.test(e.code || e.message)) throw Object.assign(new Error("ocupada"), { code: "ocupada" }); throw e; }
    return r;
  },
  async reserva(c) {
    c = String(c || "").trim().toUpperCase(); if (!c) return null;
    if (DEMO) { const r = LDB.get().reservas[c]; return r ? { ...r, codigo: c } : null; }
    const { fs, db } = await fb(); const x = await fs.getDoc(fs.doc(db, "reservas", c)); return x.exists() ? { ...x.data(), codigo: c } : null;
  },
  async qr(k) {
    if (!k) return null;
    if (DEMO) return LDB.get().qr[k] || null;
    const { fs, db } = await fb(); const x = await fs.getDoc(fs.doc(db, "qr", k)); return x.exists() ? x.data() : null;
  },
  async pedido(p) {
    const id = codigo("PD");
    if (DEMO) {
      const d = LDB.get();
      if (p.pago === "habitacion") { const pin = d.pines[p.qr]; if (!pin || String(pin.pin) !== String(p.pin)) throw Object.assign(new Error("pin"), { code: "pin" }); }
      d.pedidos[id] = p; LDB.save(d); return id;
    }
    const { fs, db } = await fb();
    try { await fs.setDoc(fs.doc(db, "pedidos", id), p); } catch (e) { if (p.pago === "habitacion" && /permission/i.test(e.code || e.message)) throw Object.assign(new Error("pin"), { code: "pin" }); throw e; }
    return id;
  },
  async pedidoGet(id) {
    if (DEMO) return LDB.get().pedidos[id] || null;
    try { const { fs, db } = await fb(); const x = await fs.getDoc(fs.doc(db, "pedidos", id)); return x.exists() ? x.data() : null; } catch (e) { return null; }
  }
};

/* ---------------- Precios y temporadas ---------------- */
function enTemporada(iso, aj) { const md = iso.slice(5); return (aj.temporadas || []).find(x => x.desde <= x.hasta ? md >= x.desde && md <= x.hasta : md >= x.desde || md <= x.hasta) || null; }
function cotizar(h, llegada, salida, aj) {
  const l = nochesDe(llegada, salida).map(f => { const tp = enTemporada(f, aj), p = Math.round(h.precio * (1 + (tp ? +tp.pct : 0) / 100)); return { f, p, tp }; });
  const total = l.reduce((a, x) => a + x.p, 0);
  const adelanto = aj.adelantoTipo === "porcentaje" ? Math.round(total * (+aj.adelantoValor || 30) / 100) : aj.adelantoTipo === "fijo" ? Math.min(+aj.adelantoValor || 50, total) : (l[0] ? l[0].p : 0);
  return { noches: l, total, adelanto: Math.min(adelanto, total), extra: l.filter(x => x.tp).length ? l.find(x => x.tp).tp : null };
}

/* ---------------- Estructura: cabecera y pie ---------------- */
const LOGO = `<svg class="logo-m" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="var(--pri)"/><path d="M25 9a12 12 0 1 0 7 18A10 10 0 0 1 25 9z" fill="var(--acc)"/></svg>`;
function layout(cat, opts = {}) {
  const aj = cat.aj, pg = document.body.dataset.page;
  const nav = [["index", "./", t("inicio")], ["habitaciones", "habitaciones", t("habitaciones")], ["tienda", "tienda", t("tienda")], ["mi-reserva", "mi-reserva", t("miReserva")]];
  if (!opts.sinCabecera) document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">${LANG === "en" ? "Skip to content" : "Ir al contenido"}</a>
    <header class="top"><div class="wrap top-in">
      <a class="brand" href="./">${LOGO}<span><b>${esc(aj.nombre)}</b><small>${esc(L(aj, "slogan"))}</small></span></a>
      <nav class="nav" id="nav" aria-label="Principal">${nav.map(([k, h, n]) => `<a href="${h}" ${pg === k ? 'aria-current="page"' : ""}>${n}</a>`).join("")}</nav>
      <div class="top-r"><button class="lang" id="langBtn" aria-label="Language">${ico("globe")}<span>${LANG === "es" ? "EN" : "ES"}</span></button>
        <a class="btn btn-pri btn-sm top-cta" href="reservar">${t("reservar")}</a>
        <button class="menu-b" id="menuB" aria-label="Menú" aria-expanded="false" aria-controls="nav">${ico("menu")}</button></div>
    </div></header>`);
  if (!opts.sinPie) document.body.insertAdjacentHTML("beforeend", `<footer class="foot"><div class="wrap foot-g">
      <div><a class="brand" href="./">${LOGO}<span><b>${esc(aj.nombre)}</b><small>${esc(L(aj, "slogan"))}</small></span></a>
        <p class="foot-p">${LANG === "en" ? "Hotels in" : "Hospedajes en"} ${cat.sedes.map(s => esc(s.ciudad)).join(" · ")}</p>
        <p class="foot-p"><a href="${wa(aj.whatsapp)}" target="_blank" rel="noopener">${ico("wa")} WhatsApp</a> · <a href="mailto:${esc(aj.email)}">${esc(aj.email)}</a></p></div>
      ${cat.sedes.map(s => `<div><b>${esc(s.nombre)}</b><p class="foot-p">${esc(s.direccion)}, ${esc(s.ciudad)}<br>${esc(s.telefono || "")}</p></div>`).join("")}
    </div><div class="wrap foot-b">© ${new Date().getFullYear()} ${esc(aj.nombre)} · ${LANG === "en" ? "Check-in" : "Check-in"} ${esc(aj.checkin)} · Check-out ${esc(aj.checkout)}</div></footer>
    ${opts.sinWA ? "" : `<a class="wa-f" href="${wa(aj.whatsapp, LANG === "en" ? "Hello! I'd like information about a booking." : "¡Hola! Quisiera información para una reserva.")}" target="_blank" rel="noopener" aria-label="WhatsApp">${ico("wa")}</a>`}`);
  $("#langBtn")?.addEventListener("click", () => setLang(LANG === "es" ? "en" : "es"));
  $("#menuB")?.addEventListener("click", e => { const o = $("#nav").classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", o); });
  if (DEMO) demoBar();
  document.documentElement.lang = LANG;
}
function demoBar() {
  const cur = temaForzado();
  const min = innerWidth < 700 && !store.get("kh_demo_open", false);
  document.body.insertAdjacentHTML("beforeend", `<div class="demo-bar ${min ? "min" : ""}" role="group" aria-label="${t("modoDemo")}"><button class="demo-t" aria-expanded="${!min}">🎨 ${t("modoDemo")} · ${t("estiloDemo")}${cur ? ": " + TX(TEMAS[cur].n) : ""}</button>
    <button data-tema-demo="" class="${!cur ? "on" : ""}">Auto</button>${Object.entries(TEMAS).map(([k, v]) => `<button data-tema-demo="${k}" class="${cur === k ? "on" : ""}">${TX(v.n)}</button>`).join("")}</div>`);
  $(".demo-bar").addEventListener("click", e => { if (e.target.closest(".demo-t")) { const o = $(".demo-bar").classList.toggle("min"); store.set("kh_demo_open", !o); e.target.closest(".demo-t").setAttribute("aria-expanded", !o); return; } const b = e.target.closest("[data-tema-demo]"); if (!b) return; store.set("kh_tema_demo", b.dataset.temaDemo || null); location.reload(); });
}

/* ---------------- QR y PDF ---------------- */
const QR_LIB = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
const PDF_LIB = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
async function qrCanvas(texto, px = 220, color = "#111") {
  await cargarScript(QR_LIB);
  const q = qrcode(0, "M"); q.addData(texto); q.make();
  const n = q.getModuleCount(), m = 2, k = Math.floor(px / (n + m * 2)), c = document.createElement("canvas"); c.width = c.height = k * (n + m * 2);
  const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.fillStyle = color;
  for (let r = 0; r < n; r++) for (let col = 0; col < n; col++) if (q.isDark(r, col)) g.fillRect((col + m) * k, (r + m) * k, k, k);
  return c;
}
async function qrDemoPago(metodo) {   // QR de ejemplo para Yape/Plin en modo demo
  const c = await qrCanvas(`DEMO ${metodo} Killa Hospedaje`, 240, metodo === "Plin" ? "#007c8a" : "#5b1a6b");
  return c.toDataURL("image/png");
}
const linkReserva = c => new URL("mi-reserva?c=" + encodeURIComponent(c), location.href).href;
async function pdfComprobante(r, cat) {
  await cargarScript(PDF_LIB);
  const { jsPDF } = window.jspdf, doc = new jsPDF({ unit: "mm", format: "a5" }), s = cat.sedes.find(x => x.id === r.sede) || {}, aj = cat.aj, W = 148;
  const col = getComputedStyle(document.documentElement).getPropertyValue("--pri").trim() || "#1f2a37";
  doc.setFillColor(col); doc.rect(0, 0, W, 30, "F");
  doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text(aj.nombre, 10, 13);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.text(`${s.nombre || ""} · ${s.direccion || ""}, ${s.ciudad || ""}`, 10, 19); doc.text(`RUC ${s.ruc || "—"} · ${s.razon || ""} · Tel. ${s.telefono || ""}`, 10, 24);
  doc.setTextColor(30); doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.text(t("comprobante").toUpperCase(), 10, 41);
  doc.setFontSize(11); doc.text(`${t("codigo")}: ${r.codigo}`, 10, 48);
  const qr = await qrCanvas(linkReserva(r.codigo), 300); doc.addImage(qr.toDataURL("image/png"), "PNG", W - 44, 34, 34, 34);
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.text(t("muestraLlegar"), W - 27, 70, { align: "center" });
  const est = t("est_" + String(r.estado || "por-validar").replace("-", ""));
  const filas = [[t("huesped"), r.nombre], [t("docNum"), `${r.docTipo} ${r.docNum}`], [t("nacionalidad"), r.nacionalidad], [t("celular"), r.celular],
    [t("habitacion"), `${r.habNum} · ${r.habTipo}`], [t("llegada"), `${fmtF(r.llegada, true)} · ${aj.checkin}`], [t("salida"), `${fmtF(r.salida, true)} · ${aj.checkout}`],
    [t("huespedes"), `${r.adultos} ${t("adultos").toLowerCase()}${r.ninos ? ` + ${r.ninos} ${t("ninos").toLowerCase()}` : ""}`], [t("noches").replace(/^./, m => m.toUpperCase()), `${r.noches} × ${S(r.precioNoche)}${r.total !== r.noches * r.precioNoche ? ` (${t("temporada").toLowerCase()})` : ""}`]];
  let y = 58; doc.setFontSize(9.5);
  filas.forEach(([a, b]) => { doc.setFont("helvetica", "bold"); doc.text(String(a), 10, y); doc.setFont("helvetica", "normal"); doc.text(String(b || "—"), 50, y, { maxWidth: W - 100 }); y += 6.4; });
  y += 3; doc.setDrawColor(220); doc.line(10, y, W - 10, y); y += 7;
  const pagado = +r.pagado || 0, declarado = +r.monto || 0;
  [[t("total"), S(r.total)], [r.estado === "por-validar" ? `${t("pagasAhora")} (${t("est_porvalidar").toLowerCase()})` : t("pagado"), S(r.estado === "por-validar" ? declarado : pagado)], [t("saldo"), S(Math.max(r.total - (r.estado === "por-validar" ? declarado : pagado), 0))], [t("metodo"), `${r.metodo || "—"}${r.banco ? " " + r.banco : ""}${r.operacion ? " · Op. " + r.operacion : ""}`], [t("estado"), est]]
    .forEach(([a, b], i) => { doc.setFont("helvetica", i === 0 ? "bold" : "normal"); doc.setFontSize(i === 0 ? 11 : 9.5); doc.text(a, 10, y); doc.text(b, W - 10, y, { align: "right" }); y += 6.4; });
  y += 4; doc.setFontSize(7.5); doc.setTextColor(110);
  doc.text(doc.splitTextToSize(L(aj, "politicas") || "", W - 20), 10, y);
  doc.text(LANG === "en" ? "This voucher is not a tax receipt (boleta/factura). It is issued by the hotel at check-in." : "Este comprobante de reserva no reemplaza la boleta o factura, que se emite en el hospedaje.", 10, 200);
  doc.save(`Reserva-${r.codigo}.pdf`);
}

/* ---------------- Pago con Yape / Plin / transferencia ---------------- */
const BANCOS = { BCP: ["#0033a0", "#ff7800"], Interbank: ["#00a94f", "#0039a6"], BBVA: ["#072146", "#1973b8"], Scotiabank: ["#ec111a", "#9b0a10"], BanBif: ["#003b7a", "#e4002b"], Pichincha: ["#ffdd00", "#0f265c"] };
function Pago(box, aj, opts) {
  const P = { met: "", banco: "", img: "", ocr: null, leyendo: false, monto: 0, op: "", forzar: false, qrDemo: {} };
  const cuentas = () => (Array.isArray(aj.cuentas) ? aj.cuentas : []).filter(c => c && c.banco && (c.num || c.cci));
  const cuentaSel = () => cuentas().find(c => c.id === P.banco) || null;
  const metodos = () => [aj.pagoYape !== false ? "Yape" : "", aj.pagoPlin !== false ? "Plin" : "", aj.pagoTransf !== false && cuentas().length ? "Transferencia" : ""].filter(Boolean);
  const qrDe = m => m === "Plin" ? { qr: aj.plinQR || P.qrDemo.Plin, num: aj.plinNum, tit: aj.plinTitular } : { qr: aj.yapeQR || P.qrDemo.Yape, num: aj.yapeNum, tit: aj.yapeTitular };
  const logoB = c => { const [c1, c2] = BANCOS[c.banco] || ["#334", "#c95"]; return c.logo ? `<img src="${esc(c.logo)}" alt="${esc(c.banco)}">` : `<span class="bk-mark" style="--b1:${c1};--b2:${c2}"><i></i>${esc(c.banco)}</span>`; };
  async function pintar() {
    const mets = metodos(); if (!P.met || !mets.includes(P.met)) P.met = mets[0] || "";
    if (!aj.yapeQR && !P.qrDemo.Yape) { P.qrDemo.Yape = await qrDemoPago("Yape"); P.qrDemo.Plin = await qrDemoPago("Plin"); }
    const tr = P.met === "Transferencia", cb = cuentaSel(), q = qrDe(P.met);
    box.innerHTML = `${mets.length > 1 ? `<div class="pg-tabs" role="tablist">${mets.map(m => `<button type="button" role="tab" aria-selected="${m === P.met}" class="pg-tab ${m === P.met ? "on" : ""} ${m.toLowerCase()}" data-met="${m}">${m === "Transferencia" && LANG === "en" ? "Bank transfer" : m}</button>`).join("")}</div>` : ""}
      ${tr ? `<div class="pg-bk"><b>1. ${t("eligeBanco")}</b><small>${t("eligeBancoTxt")}</small>
          <div class="bk-logos">${cuentas().map(c => `<button type="button" class="bk ${cb && cb.id === c.id ? "on" : ""}" data-banco="${esc(c.id)}" aria-label="${esc(c.banco)}">${logoB(c)}</button>`).join("")}</div>
          ${cb ? `<div class="bk-det">${cb.num ? `<div class="bk-row"><span>${t("cuenta")} ${esc((cb.tipo || "").toLowerCase())} · ${esc(cb.moneda || "")} · ${esc(cb.banco)}</span><b>${esc(cb.num)}</b><button type="button" class="btn btn-light btn-xs" data-copy="${esc(String(cb.num).replace(/\D/g, ""))}">${t("copiar")}</button></div>` : ""}
            ${cb.cci ? `<div class="bk-row"><span>${t("cciTxt")}</span><b>${esc(cb.cci)}</b><button type="button" class="btn btn-light btn-xs" data-copy="${esc(String(cb.cci).replace(/\D/g, ""))}">${t("copiar")}</button></div>` : ""}
            <small>${t("aNombre")}: <b>${esc(cb.titular || aj.nombre)}</b></small>${cb.url ? `<a class="btn btn-pri btn-sm" href="${esc(cb.url)}" target="_blank" rel="noopener">${t("irBanco", { b: esc(cb.banco) })}</a>` : ""}</div>` : `<p class="bk-hint">${t("tocaBanco")}</p>`}
          <p class="pg-note">${ico("clock")} ${t("notaCCI")}</p></div>`
      : `<div class="pg-qr ${P.met.toLowerCase()}"><img src="${esc(q.qr || "")}" alt="QR ${P.met}"><div><b>1. ${t("escaneaQR", { m: P.met })}</b><span>${t("oAlNumero", { v: P.met === "Plin" ? "plinea" : "yapea" })}</span>
          <div class="pg-num"><b>${esc(q.num || "")}</b><button type="button" class="btn btn-light btn-xs" data-copy="${esc(String(q.num || "").replace(/\D/g, ""))}">${t("copiar")}</button></div><small>${t("aNombre")}: <b>${esc(q.tit || aj.nombre)}</b></small></div></div>`}
      <div class="pg-monto"><span>2. ${t("montoAPagar")}</span><b id="pgMonto">${S(P.monto)}</b></div>
      <label class="pg-up ${P.img ? "ok" : ""}"><span>3. ${tr ? t("subeConstancia") : t("subeCaptura")}</span><input type="file" accept="image/*" id="pgFile">${P.img ? `<img src="${P.img}" alt="">` : `<em>${ico("camera")} ${t("elegirImagen")}</em>`}</label>
      <div class="pg-ocr" id="pgOcr" aria-live="polite"></div>
      <label class="fld"><span>${t("operacion")} <small>${t("operacionTxt")}</small></span><input id="pgOp" maxlength="16" inputmode="numeric" value="${esc(P.op)}"></label>`;
    revisar();
  }
  function revisar() {
    const b = $("#pgOcr", box); if (!b) return; $("#pgMonto", box).textContent = S(P.monto);
    if (P.leyendo) { b.className = "pg-ocr"; b.innerHTML = `<span class="spin"></span> ${t("leyendo")}`; return; }
    if (!P.img) { b.innerHTML = ""; b.className = "pg-ocr"; return; }
    const o = P.ocr;
    if (!o || !o.montos.length) { b.className = "pg-ocr warn"; b.innerHTML = t("noLeido"); return; }
    o.coincide = o.montos.some(x => Math.abs(x - P.monto) < 0.01);
    b.className = "pg-ocr " + (o.coincide ? "ok" : "bad");
    b.innerHTML = o.coincide ? `${ico("check")} ${t("coincide", { m: S(P.monto) })}${o.fechaOk === false ? ` <b>${t("fechaNoHoy")}</b>` : ""}`
      : `${t("noCoincide", { a: `<b>${o.montos.map(S).join(" / ")}</b>`, b: `<b>${S(P.monto)}</b>` })}<label class="chk"><input type="checkbox" id="pgForzar" ${P.forzar ? "checked" : ""}> ${t("forzar")}</label>`;
  }
  async function leer(src) {
    if (aj.pagoOCR === false) return null;
    if (!window.Tesseract) await cargarScript("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js");
    const r = await Promise.race([window.Tesseract.recognize(src, "spa"), new Promise((_, no) => setTimeout(() => no(new Error("tiempo")), 30000))]);
    const tx = (r && r.data && r.data.text) || "";
    const montos = [...new Set([...tx.matchAll(/S\s*\/\.?\s*(\d{1,5}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/gi)].map(x => { let v = x[1]; if (/[.,]\d{3}([.,]|$)/.test(v)) v = v.replace(/[.,](?=\d{3})/g, ""); return +v.replace(",", "."); }).filter(x => x > 0))];
    const op = (tx.match(/operaci[oó]n\D{0,25}(\d{6,14})/i) || tx.match(/\b(\d{8})\b/) || [])[1] || "";
    const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"], fm = tx.match(/(\d{1,2})\s*(?:de\s*)?(ene|feb|mar|abr|may|jun|jul|ago|set|sep|oct|nov|dic)[a-z]*\.?/i);
    let fechaOk = null; if (fm) { const mi = MESES.indexOf(fm[2].toLowerCase().replace("sep", "set")), d = new Date(), ay = new Date(Date.now() - 864e5); fechaOk = [d, ay].some(x => x.getDate() === +fm[1] && x.getMonth() === mi); }
    return { montos, op, fechaOk };
  }
  const comprimir = file => new Promise((ok, no) => { const fr = new FileReader(); fr.onerror = no; fr.onload = () => { const im = new Image(); im.onerror = no; im.onload = () => {
    const k = Math.min(1, 1100 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); let q = .75, u = c.toDataURL("image/jpeg", q); while (u.length > 650000 && q > .35) { q -= .1; u = c.toDataURL("image/jpeg", q); } ok(u); }; im.src = fr.result; }; fr.readAsDataURL(file); });
  box.addEventListener("change", async e => {
    if (e.target.id === "pgForzar") { P.forzar = e.target.checked; return; }
    if (e.target.id !== "pgFile") return; const f = e.target.files[0]; if (!f) return;
    P.op = $("#pgOp", box)?.value || P.op;
    try { P.img = await comprimir(f); } catch (er) { return toast("No se pudo abrir la imagen", true); }
    P.ocr = null; P.leyendo = true; P.forzar = false; await pintar();
    try { P.ocr = await leer(P.img); } catch (er) { console.warn("OCR:", er.message); P.ocr = null; }
    P.leyendo = false; if (P.ocr && P.ocr.op && !P.op) P.op = P.ocr.op; await pintar(); opts && opts.onChange && opts.onChange();
  });
  box.addEventListener("input", e => { if (e.target.id === "pgOp") P.op = e.target.value; });
  box.addEventListener("click", e => {
    const m = e.target.closest("[data-met]"); if (m) { P.op = $("#pgOp", box)?.value || P.op; P.met = m.dataset.met; return pintar(); }
    const bk = e.target.closest("[data-banco]"); if (bk) { P.banco = bk.dataset.banco; const c = cuentaSel(); if (!c) return;
      navigator.clipboard?.writeText(String(c.num || c.cci || "").replace(/\D/g, "")).catch(() => {}); if (c.url) window.open(c.url, "_blank", "noopener");
      toast(`${t("cuenta")} ${c.banco} · ${t("copiado")}`); P.op = $("#pgOp", box)?.value || P.op; return pintar(); }
    const cp = e.target.closest("[data-copy]"); if (cp) navigator.clipboard?.writeText(cp.dataset.copy).then(() => toast(t("copiado")), () => {});
  });
  return {
    estado: P, pintar,
    setMonto(v) { P.monto = Math.round((+v || 0) * 100) / 100; revisar(); },
    validar() {
      if (P.met === "Transferencia" && !cuentaSel()) return t("errBanco");
      if (!P.img) return t("errCaptura");
      if (P.leyendo) return t("leyendo");
      if (P.ocr && P.ocr.montos.length && !P.ocr.montos.some(x => Math.abs(x - P.monto) < 0.01) && !P.forzar) return t("errMonto");
      return "";
    },
    datos() { const o = P.ocr || {}; return { metodo: P.met, banco: P.met === "Transferencia" ? (cuentaSel() || {}).banco || "" : "", monto: P.monto, operacion: (P.op || "").replace(/\D/g, "").slice(0, 16),
      captura: P.img, montoLeido: o.montos && o.montos.length ? (o.montos.find(x => Math.abs(x - P.monto) < .01) ?? o.montos[0]) : null, montosLeidos: (o.montos || []).slice(0, 5), coincide: o.montos && o.montos.length ? !!o.coincide : null, fechaOk: o.fechaOk ?? null }; }
  };
}
