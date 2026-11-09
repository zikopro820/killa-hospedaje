/* =========================================================
   KILLA HOSPEDAJE — Páginas
   ========================================================= */
const habCard = (h, s, cat, extra = "") => `<article class="hab">
  <div class="hab-f">${foto((h.fotos || [])[0], L(h, "tipo"), 700)}<span class="hab-sede">${esc(s ? s.nombre : "")}</span></div>
  <div class="hab-b"><h3>${esc(L(h, "tipo"))}</h3>
    <p class="hab-m">${ico("users")} ${t("hasta")} ${h.cap} ${t("personas")} · ${ico("bed")} ${esc(L(h, "camas"))}</p>
    <ul class="amen">${(h.amen || []).slice(0, 5).map(a => `<li>${ico(a)}${esc(amenTxt(a))}</li>`).join("")}</ul>
    <div class="hab-p"><span>${t("desde")} <b>${S(h.precio)}</b> ${t("porNoche")}</span>${extra || `<a class="btn btn-pri btn-sm" href="reservar?sede=${esc(h.sede)}&hab=${esc(h.id)}">${t("reservarHab")}</a>`}</div></div></article>`;
const barraBusqueda = (cat, sede) => { const h = hoyISO(); return `<form class="buscar" action="reservar" method="get">
  ${cat.sedes.length > 1 ? `<label class="b-sede"><span>${t("sede")}</span><select name="sede">${cat.sedes.map(s => `<option value="${esc(s.id)}" ${sede === s.id ? "selected" : ""}>${esc(s.nombre)}</option>`).join("")}</select></label>` : `<input type="hidden" name="sede" value="${esc(cat.sedes[0]?.id || "")}">`}
  <label><span>${t("llegada")}</span><input type="date" name="in" min="${h}" value="${h}" required></label>
  <label><span>${t("salida")}</span><input type="date" name="out" min="${addD(h, 1)}" value="${addD(h, 2)}" required></label>
  <label><span>${t("huespedes")}</span><select name="n">${[1, 2, 3, 4, 5, 6].map(n => `<option ${n === 2 ? "selected" : ""}>${n}</option>`).join("")}</select></label>
  <button class="btn btn-acc">${t("buscar")}</button></form>`; };
function enlazarFechas(form) {
  const a = $("[name=in]", form), b = $("[name=out]", form); if (!a || !b) return;
  a.addEventListener("change", () => { b.min = addD(a.value, 1); if (b.value <= a.value) b.value = addD(a.value, 1); });
}

/* ================= INICIO ================= */
async function pgInicio(cat) {
  const una = cat.sedes.length === 1, sp = una ? cat.sedes[0] : null, tema = una ? temaDe(sp) : (temaForzado() || cat.aj.temaPrincipal || "turistico"), T0 = TEMAS[tema];
  aplicarTema(tema); layout(cat);
  const prods = (await DB.productos((sp || cat.sedes.find(s => temaDe(s) === tema) || cat.sedes[0] || {}).id)).slice(0, 4);
  $("#main").innerHTML = `
  <section class="hero"><div class="hero-bg">${foto(T0.foto, "", 1800)}</div><div class="wrap hero-in">
    <span class="eyebrow">${ico(T0.ic)} ${esc(una ? sp.nombre + " · " + sp.ciudad : cat.sedes.map(s => s.ciudad).join(" · "))}</span>
    <h1>${TX(T0.h1)}</h1><p class="lead">${TX(T0.sub)}</p>${barraBusqueda(cat, sp && sp.id)}</div></section>
  ${!una ? `<section class="sec"><div class="wrap"><div class="sec-h"><h2>${t("nuestrosHoteles")}</h2></div>
    <div class="sedes">${cat.sedes.map(s => { const tm = temaDe(s); return `<a class="sede tm-${tm}" href="habitaciones?sede=${esc(s.id)}">
      <div class="sede-f">${foto(s.foto || TEMAS[tm].foto, s.nombre, 800)}<span class="sede-t">${ico(TEMAS[tm].ic)} ${TX(TEMAS[tm].n)}</span></div>
      <div class="sede-b"><h3>${esc(s.nombre)}</h3><p class="sede-c">${ico("pin")} ${esc(s.ciudad)}</p><p>${esc(L(s, "desc"))}</p>
      <span class="lnk">${t("verHab")} ${ico("arrow")}</span></div></a>`; }).join("")}</div></div></section>` : ""}
  <section class="sec sec-alt"><div class="wrap"><div class="sec-h"><h2>${t("habitaciones")}</h2><a class="lnk" href="habitaciones">${t("verHab")} ${ico("arrow")}</a></div>
    <div class="habs">${(una ? cat.habs.filter(h => h.sede === sp.id) : cat.sedes.map(s => cat.habs.find(h => h.sede === s.id)).filter(Boolean).concat(cat.habs)).filter((h, i, a) => a.indexOf(h) === i).slice(0, 6).map(h => habCard(h, cat.sedes.find(s => s.id === h.sede), cat)).join("")}</div></div></section>
  <section class="sec"><div class="wrap"><div class="sec-h"><h2>${t("servicios")}</h2></div>
    <div class="servs">${T0.serv.map(([i, es, en]) => `<div class="serv">${ico(i)}<span>${LANG === "en" ? en : es}</span></div>`).join("")}</div></div></section>
  <section class="sec qr-sec"><div class="wrap qr-g"><div class="qr-mock" aria-hidden="true"><div class="phone"><div class="ph-top">${LOGO}<b>${t("bienvenido", { n: "204" })}</b></div>
      <div class="ph-w">${ico("wifi")}<span><small>${t("wifi")}</small><b>killa2026</b></span></div><div class="ph-g">${["bag", "broom", "compass", "map"].map(i => `<span>${ico(i)}</span>`).join("")}</div></div><div class="qr-card">${ico("qr")}</div></div>
    <div><span class="eyebrow">${ico("qr")} QR</span><h2>${t("qrTit")}</h2><p class="lead">${t("qrTxt")}</p>
      <ul class="ticks">${["qr1", "qr2", "qr3", "qr4"].map(k => `<li>${ico("check")} ${t(k)}</li>`).join("")}</ul></div></div></section>
  <section class="sec sec-alt"><div class="wrap"><div class="sec-h"><div><h2>${t("tiendaTit")}</h2><p class="muted">${t("tiendaTxt")}</p></div><a class="btn btn-light" href="tienda">${t("verTienda")} ${ico("arrow")}</a></div>
    <div class="prods">${prods.map(p => `<div class="prod">${prodImg(p)}<b>${esc(L(p, "n"))}</b><span class="prod-p">${S(p.precio)}</span></div>`).join("")}</div></div></section>
  <section class="sec"><div class="wrap"><div class="sec-h"><h2>${t("ubicacion")}</h2></div>
    <div class="ubis">${cat.sedes.map(s => `<div class="ubi"><h3>${esc(s.nombre)}</h3><p>${ico("pin")} ${esc(s.direccion)}, ${esc(s.ciudad)}</p><p>${ico("phone")} ${esc(s.telefono || "")}</p>
      <div class="ubi-a"><a class="btn btn-light btn-sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.direccion + ", " + s.ciudad + ", Perú")}">${ico("map")} ${t("comoLlegar")}</a>
      <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${wa(s.whatsapp || cat.aj.whatsapp)}">${ico("wa")} WhatsApp</a></div></div>`).join("")}</div></div></section>`;
  enlazarFechas($(".buscar"));
}

/* ================= HABITACIONES ================= */
async function pgHabitaciones(cat) {
  const sel = PARAMS.get("sede") || "", s0 = cat.sedes.find(s => s.id === sel);
  aplicarTema(s0 ? temaDe(s0) : (temaForzado() || cat.aj.temaPrincipal)); layout(cat);
  const pintar = id => {
    const l = cat.habs.filter(h => !id || h.sede === id);
    $("#habList").innerHTML = l.map(h => habCard(h, cat.sedes.find(s => s.id === h.sede), cat)).join("") || `<p class="muted">—</p>`;
    $$(".chips [data-s]").forEach(b => b.setAttribute("aria-pressed", b.dataset.s === id));
  };
  $("#main").innerHTML = `<section class="page-h"><div class="wrap"><h1>${t("habitaciones")}</h1>${s0 ? `<p class="lead">${esc(L(s0, "desc"))}</p>` : ""}</div></section>
    <section class="sec sec-tight"><div class="wrap">${cat.sedes.length > 1 ? `<div class="chips" role="group">${[["", t("todas")], ...cat.sedes.map(s => [s.id, s.nombre])].map(([k, n]) => `<button class="chip" data-s="${esc(k)}" aria-pressed="false">${esc(n)}</button>`).join("")}</div>` : ""}
    <div class="habs" id="habList"></div></div></section>`;
  pintar(sel);
  $(".chips")?.addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (!b) return; const s = cat.sedes.find(x => x.id === b.dataset.s);
    aplicarTema(s ? temaDe(s) : (temaForzado() || cat.aj.temaPrincipal)); history.replaceState(null, "", b.dataset.s ? "?sede=" + b.dataset.s : location.pathname); pintar(b.dataset.s); });
}

/* ================= RESERVAR ================= */
async function pgReservar(cat) {
  const aj = cat.aj, R = { sede: PARAMS.get("sede") || (cat.sedes.length === 1 ? cat.sedes[0].id : ""), in: PARAMS.get("in") || hoyISO(), out: PARAMS.get("out") || addD(hoyISO(), 2), n: +PARAMS.get("n") || 2, ninos: 0, hab: PARAMS.get("hab") || "", tipo: "adelanto", ocup: new Set(), cot: null };
  if (!R.sede && R.hab) R.sede = (cat.habs.find(h => h.id === R.hab) || {}).sede || "";
  if (!R.sede) R.sede = cat.sedes[0]?.id || "";
  const sede = () => cat.sedes.find(s => s.id === R.sede), hab = () => cat.habs.find(h => h.id === R.hab);
  aplicarTema(temaDe(sede())); layout(cat);
  $("#main").innerHTML = `<section class="page-h"><div class="wrap"><h1>${t("reservar")}</h1></div></section>
  <section class="sec sec-tight"><div class="wrap book-g"><form id="book" novalidate>
    <fieldset class="step"><legend><i>1</i>${t("paso1")}</legend><div class="f-g">
      ${cat.sedes.length > 1 ? `<label class="fld full"><span>${t("sede")}</span><select name="sede">${cat.sedes.map(s => `<option value="${esc(s.id)}" ${s.id === R.sede ? "selected" : ""}>${esc(s.nombre)} · ${esc(s.ciudad)}</option>`).join("")}</select></label>` : ""}
      <label class="fld"><span>${t("llegada")}</span><input type="date" name="in" min="${hoyISO()}" value="${R.in}" required></label>
      <label class="fld"><span>${t("salida")}</span><input type="date" name="out" min="${addD(R.in, 1)}" value="${R.out}" required></label>
      <label class="fld"><span>${t("adultos")}</span><select name="n">${[1, 2, 3, 4, 5, 6].map(n => `<option ${n === R.n ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <label class="fld"><span>${t("ninos")}</span><select name="ninos">${[0, 1, 2, 3, 4].map(n => `<option>${n}</option>`).join("")}</select></label></div></fieldset>
    <fieldset class="step"><legend><i>2</i>${t("paso2")}</legend><div id="habPick" class="pick" aria-live="polite"></div></fieldset>
    <fieldset class="step"><legend><i>3</i>${t("paso3")}</legend><div class="f-g">
      <label class="fld full"><span>${t("nombre")} *</span><input name="nombre" autocomplete="name" required maxlength="80"></label>
      <label class="fld"><span>${t("docTipo")}</span><select name="docTipo"><option>DNI</option><option>${LANG === "en" ? "Passport" : "Pasaporte"}</option><option>${LANG === "en" ? "Foreign ID (CE)" : "Carné de extranjería"}</option></select></label>
      <label class="fld"><span>${t("docNum")} *</span><input name="docNum" required maxlength="20" autocomplete="off"></label>
      <label class="fld"><span>${t("nacionalidad")}</span><input name="nacionalidad" list="paises" value="${LANG === "en" ? "" : "Perú"}" maxlength="40"><datalist id="paises">${["Perú", "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Ecuador", "España", "Estados Unidos", "Francia", "Alemania", "México", "Reino Unido", "Venezuela"].map(p => `<option>${p}</option>`).join("")}</datalist></label>
      <label class="fld"><span>${t("celular")} *</span><input name="celular" type="tel" inputmode="tel" required maxlength="20" autocomplete="tel" placeholder="${LANG === "en" ? "+1 415 555 0123" : "987 654 321"}"></label>
      <label class="fld"><span>${t("email")}</span><input name="email" type="email" maxlength="80" autocomplete="email"></label>
      <label class="fld"><span>${t("horaLlegada")}</span><input name="horaLlegada" type="time" value="${esc(aj.checkin)}"></label>
      <label class="fld full"><span>${t("nota")}</span><textarea name="nota" rows="2" maxlength="300"></textarea></label></div></fieldset>
    <fieldset class="step"><legend><i>4</i>${t("paso4")}</legend>
      <div class="opts2" id="tipoPago"></div><div id="pago"></div>
      <label class="chk acepto"><input type="checkbox" name="acepto"> <span>${t("acepto")} · <button type="button" class="lnk" id="verPol">${t("verPoliticas")}</button></span></label>
      <p class="pol" id="pol" hidden>${esc(L(aj, "politicas"))}</p>
      <p class="f-msg" id="msg" role="alert"></p>
      <button class="btn btn-pri btn-lg" id="bookBtn" type="submit">${ico("lock")} ${t("confirmar")}</button></fieldset>
  </form><aside class="sum" id="sum" aria-live="polite"></aside></div></section>`;
  const F = $("#book"), pago = Pago($("#pago"), aj, { onChange: resumen });
  enlazarFechas(F);
  async function cargarOcup() {
    R.ocup = new Set(); if (R.out <= R.in) return;
    try { (await DB.ocupacion(R.in, R.out)).forEach(o => R.ocup.add(o.hab)); } catch (e) { console.warn(e); }
  }
  function libre(h) { return !R.ocup.has(h.id) && h.estado !== "mantenimiento"; }
  function pintarHabs() {
    const s = sede(), l = cat.habs.filter(h => h.sede === R.sede), tot = R.n + R.ninos;
    if (R.out <= R.in) { $("#habPick").innerHTML = `<p class="muted">${t("errFechas")}</p>`; return; }
    if (R.hab && (!l.find(h => h.id === R.hab) || !libre(hab()) || hab().cap < tot)) R.hab = "";
    $("#habPick").innerHTML = l.map(h => { const ok = libre(h), cabe = h.cap >= tot, c = cotizar(h, R.in, R.out, aj), on = R.hab === h.id;
      return `<label class="opt-h ${on ? "on" : ""} ${ok && cabe ? "" : "off"}"><input type="radio" name="hab" value="${esc(h.id)}" ${on ? "checked" : ""} ${ok && cabe ? "" : "disabled"}>
        <span class="opt-f">${foto((h.fotos || [])[0], "", 300)}</span><span class="opt-b"><b>${esc(L(h, "tipo"))} · N.° ${esc(h.num)}</b><small>${ico("users")} ${t("hasta")} ${h.cap} · ${esc(L(h, "camas"))}</small>
        <small class="${ok && cabe ? "ok" : "no"}">${!ok ? (h.estado === "mantenimiento" ? t("mantenimiento") : t("ocupada")) : !cabe ? t("noCabe", { n: h.cap }) : t("libre")}</small></span>
        <span class="opt-p"><b>${S(c.total)}</b><small>${c.noches.length} ${c.noches.length === 1 ? t("noche") : t("noches")}</small></span></label>`; }).join("") || `<p class="muted">—</p>`;
  }
  function pintarTipo() {
    const h = hab(); R.cot = h ? cotizar(h, R.in, R.out, aj) : null;
    if (!R.cot) { $("#tipoPago").innerHTML = `<p class="muted">${t("errHab")}</p>`; $("#pago").hidden = true; return; }
    $("#pago").hidden = false; const c = R.cot, ad = c.adelanto < c.total;
    if (!ad) R.tipo = "completo";
    $("#tipoPago").innerHTML = `${ad ? `<label class="opt2 ${R.tipo === "adelanto" ? "on" : ""}"><input type="radio" name="tipoPago" value="adelanto" ${R.tipo === "adelanto" ? "checked" : ""}><b>${t("pagarAdelanto")} · ${S(c.adelanto)}</b><small>${aj.adelantoTipo === "noche" ? t("primeraNoche") + " · " : ""}${t("saldoLlegar")} (${S(c.total - c.adelanto)})</small></label>` : ""}
      <label class="opt2 ${R.tipo === "completo" ? "on" : ""}"><input type="radio" name="tipoPago" value="completo" ${R.tipo === "completo" ? "checked" : ""}><b>${t("pagarTodo")} · ${S(c.total)}</b><small>${t("sinSaldo")}</small></label>`;
    pago.setMonto(R.tipo === "completo" ? c.total : c.adelanto);
  }
  function resumen() {
    const s = sede(), h = hab(), c = R.cot;
    $("#sum").innerHTML = `<h2>${t("resumen")}</h2>${s ? `<p class="sum-s">${ico("pin")} ${esc(s.nombre)} · ${esc(s.ciudad)}</p>` : ""}
      <p class="sum-f">${ico("cal")} ${fmtF(R.in)} → ${fmtF(R.out)}<br><small>${nochesDe(R.in, R.out).length} ${t("noches")} · ${R.n + R.ninos} ${t("personas")}</small></p>
      ${h ? `<div class="sum-h">${foto((h.fotos || [])[0], "", 400)}<b>${esc(L(h, "tipo"))} · N.° ${esc(h.num)}</b></div>` : ""}
      ${c ? `<div class="sum-r">${c.noches.map(x => `<div><span>${fmtF(x.f)}${x.tp ? ` <em>${esc(x.tp.n)}</em>` : ""}</span><b>${S(x.p)}</b></div>`).join("")}</div>
        <div class="sum-t"><span>${t("total")}</span><b>${S(c.total)}</b></div>
        <div class="sum-x"><span>${t("pagasAhora")}</span><b>${S(pago.estado.monto)}</b></div>
        <div class="sum-x"><span>${t("saldo")}</span><b>${S(c.total - pago.estado.monto)}</b></div>` : `<p class="muted">${t("sinFechas")}</p>`}
      <p class="sum-n">${ico("clock")} Check-in ${esc(aj.checkin)} · Check-out ${esc(aj.checkout)}</p>`;
  }
  async function todo(recargar) { if (recargar) { $("#habPick").innerHTML = `<p class="muted"><span class="spin"></span></p>`; await cargarOcup(); } pintarHabs(); pintarTipo(); resumen(); }
  F.addEventListener("change", async e => {
    const n = e.target.name;
    if (n === "sede") { R.sede = e.target.value; R.hab = ""; aplicarTema(temaDe(sede())); return todo(true); }
    if (n === "in" || n === "out") { R.in = $("[name=in]", F).value; R.out = $("[name=out]", F).value; return todo(true); }
    if (n === "n" || n === "ninos") { R.n = +$("[name=n]", F).value; R.ninos = +$("[name=ninos]", F).value; return todo(false); }
    if (n === "hab") { R.hab = e.target.value; pintarHabs(); pintarTipo(); return resumen(); }
    if (n === "tipoPago") { R.tipo = e.target.value; pintarTipo(); return resumen(); }
  });
  $("#verPol").addEventListener("click", () => $("#pol").hidden = !$("#pol").hidden);
  await pago.pintar(); await todo(true);
  if (R.hab) setTimeout(() => $("#habPick .on")?.scrollIntoView({ block: "nearest" }), 200);

  F.addEventListener("submit", async e => {
    e.preventDefault(); const msg = $("#msg"), err = m => { msg.textContent = m; msg.scrollIntoView({ block: "center", behavior: "smooth" }); };
    msg.textContent = "";
    const v = n => ($(`[name=${n}]`, F).value || "").trim();
    if (R.out <= R.in) return err(t("errFechas"));
    if (!hab()) return err(t("errHab"));
    if (!v("nombre") || !v("docNum") || v("celular").replace(/\D/g, "").length < 9) return err(t("errDatos"));
    const pe = pago.validar(); if (pe) return err(pe);
    if (!$("[name=acepto]", F).checked) return err(t("errAcepto"));
    const h = hab(), s = sede(), c = R.cot, p = pago.datos(), cod = codigo("KH"), btn = $("#bookBtn");
    const r = { codigo: cod, sede: s.id, sedeNombre: s.nombre, hab: h.id, habNum: String(h.num), habTipo: h.tipo, llegada: R.in, salida: R.out, noches: c.noches.length, adultos: R.n, ninos: R.ninos,
      nombre: v("nombre").slice(0, 80), docTipo: v("docTipo"), docNum: v("docNum").slice(0, 20), nacionalidad: v("nacionalidad").slice(0, 40), celular: v("celular").slice(0, 20), email: v("email").slice(0, 80),
      horaLlegada: v("horaLlegada"), nota: v("nota").slice(0, 300), precioNoche: +h.precio, total: c.total, pagoTipo: R.tipo, monto: p.monto, metodo: p.metodo, banco: p.banco, operacion: p.operacion,
      pagado: 0, estado: "por-validar", origen: "web", lang: LANG, creado: new Date().toISOString() };
    const pw = { reserva: cod, tipo: "reserva", sede: s.id, nombre: r.nombre, celular: r.celular, detalle: `Hab. ${h.num} · ${r.noches} ${r.noches === 1 ? "noche" : "noches"} · ${R.in} → ${R.out}`, total: c.total,
      monto: p.monto, metodo: p.metodo, banco: p.banco, operacion: p.operacion, captura: p.captura, montoLeido: p.montoLeido, montosLeidos: p.montosLeidos, coincide: p.coincide, fechaOk: p.fechaOk, estado: "por-validar", creado: r.creado };
    btn.disabled = true; btn.innerHTML = `<span class="spin"></span> ${t("enviando")}`;
    try { await DB.reservar(r, pw); }
    catch (er) { btn.disabled = false; btn.innerHTML = `${ico("lock")} ${t("confirmar")}`;
      if (er.code === "ocupada") { await todo(true); return err(t("errOcupada")); } console.error(er); return err(t("errGeneral")); }
    store.set("kh_ult", cod);
    $("#main").innerHTML = `<section class="sec"><div class="wrap ok-wrap"><div class="ok-h">${ico("check")}<h1>${t("okTit")}</h1><p class="lead">${t("okTxt")}</p></div>${await tarjetaReserva(r, cat)}
      <div class="ok-a"><a class="btn btn-light" href="reservar">${t("nuevaReserva")}</a></div></div></section>`;
    enlazarTarjeta(r, cat); scrollTo({ top: 0 });
  });
}

/* --- tarjeta de comprobante (reservar y mi reserva) --- */
async function tarjetaReserva(r, cat) {
  const s = cat.sedes.find(x => x.id === r.sede) || {}, aj = cat.aj, est = String(r.estado || "por-validar"), pag = est === "por-validar" ? +r.monto || 0 : +r.pagado || 0;
  const qr = await qrCanvas(linkReserva(r.codigo), 200);
  return `<article class="vou" id="vou"><header class="vou-h">${LOGO}<div><b>${esc(aj.nombre)}</b><small>${esc(s.nombre || "")} · ${esc(s.direccion || "")}, ${esc(s.ciudad || "")}</small></div><span class="est est-${esc(est)}">${t("est_" + est.replace("-", ""))}</span></header>
    <div class="vou-b"><div class="vou-qr"><img src="${qr.toDataURL()}" alt="QR ${esc(r.codigo)}"><b>${esc(r.codigo)}</b><small>${t("muestraLlegar")}</small></div>
      <dl class="vou-d"><div><dt>${t("huesped")}</dt><dd>${esc(r.nombre)}<small>${esc(r.docTipo)} ${esc(r.docNum)}</small></dd></div>
        <div><dt>${t("habitacion")}</dt><dd>N.° ${esc(r.habNum)}<small>${esc(r.habTipo)}</small></dd></div>
        <div><dt>${t("llegada")}</dt><dd>${fmtF(r.llegada)}<small>${esc(aj.checkin)}</small></dd></div>
        <div><dt>${t("salida")}</dt><dd>${fmtF(r.salida)}<small>${esc(aj.checkout)}</small></dd></div>
        <div><dt>${t("huespedes")}</dt><dd>${r.adultos + (r.ninos || 0)}<small>${r.noches} ${r.noches === 1 ? t("noche") : t("noches")}</small></dd></div>
        <div><dt>${t("metodo")}</dt><dd>${esc(r.metodo || "—")}${r.banco ? " " + esc(r.banco) : ""}<small>${r.operacion ? "Op. " + esc(r.operacion) : ""}</small></dd></div></dl></div>
    <div class="vou-m"><div><span>${t("total")}</span><b>${S(r.total)}</b></div><div><span>${est === "por-validar" ? t("pagasAhora") : t("pagado")}</span><b>${S(pag)}</b></div><div><span>${t("saldo")}</span><b>${S(Math.max(r.total - pag, 0))}</b></div></div>
    <div class="vou-a"><button class="btn btn-pri" data-pdf>${ico("file")} ${t("descargarPDF")}</button>
      <a class="btn btn-wa" target="_blank" rel="noopener" href="${wa("", `${aj.nombre} · ${t("comprobante")}\n${t("codigo")}: ${r.codigo}\n${t("habitacion")} ${r.habNum} · ${s.nombre}\n${fmtF(r.llegada)} → ${fmtF(r.salida)}\n${linkReserva(r.codigo)}`)}">${ico("wa")} ${t("compartirWA")}</a>
      <a class="btn btn-light" href="mi-reserva?c=${esc(r.codigo)}">${t("verMiReserva")}</a></div></article>`;
}
function enlazarTarjeta(r, cat) { $("[data-pdf]")?.addEventListener("click", async e => { const b = e.currentTarget; b.disabled = true; try { await pdfComprobante(r, cat); } catch (er) { toast("PDF: " + er.message, true); } b.disabled = false; }); }

/* ================= MI RESERVA ================= */
async function pgMiReserva(cat) {
  aplicarTema(temaForzado() || cat.aj.temaPrincipal); layout(cat);
  const c0 = PARAMS.get("c") || store.get("kh_ult", "");
  $("#main").innerHTML = `<section class="page-h"><div class="wrap"><h1>${t("buscaReserva")}</h1><p class="lead">${t("buscaTxt")}</p>
    <form class="busca-r" id="bf"><label class="sr" for="bc">${t("codigo")}</label><input id="bc" value="${esc(c0)}" placeholder="KH-XXXXXX" autocapitalize="characters" maxlength="12"><button class="btn btn-pri">${t("buscar2")}</button></form></div></section>
    <section class="sec sec-tight"><div class="wrap" id="res" aria-live="polite"></div></section>`;
  async function ver(c) {
    $("#res").innerHTML = `<p class="muted"><span class="spin"></span></p>`;
    let r = null; try { r = await DB.reserva(c); } catch (e) { console.warn(e); }
    if (!r) { $("#res").innerHTML = `<p class="f-msg">${t("noExiste")}</p>`; return; }
    const s = cat.sedes.find(x => x.id === r.sede); if (s) aplicarTema(temaDe(s));
    $("#res").innerHTML = (await tarjetaReserva(r, cat)) + `<div class="card pol-c"><h3>${t("politicas")}</h3><p>${esc(L(cat.aj, "politicas"))}</p>
      <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${wa((s && s.whatsapp) || cat.aj.whatsapp, `${LANG === "en" ? "Hello, about my booking" : "Hola, sobre mi reserva"} ${r.codigo}`)}">${ico("wa")} ${t("escribenos")}</a></div>`;
    enlazarTarjeta(r, cat); history.replaceState(null, "", "?c=" + r.codigo);
  }
  $("#bf").addEventListener("submit", e => { e.preventDefault(); ver($("#bc").value); });
  if (c0) ver(c0);
}

/* ================= TIENDA ================= */
function carritoUI(box, lista, onChange) {
  const C = {};
  const total = () => Object.values(C).reduce((a, x) => a + x.p.precio * x.c, 0);
  function pintar() {
    const items = Object.values(C).filter(x => x.c > 0);
    box.innerHTML = items.length ? `<ul class="cart-l">${items.map(x => `<li><span>${esc(x.p.e || "")} ${esc(L(x.p, "n"))}</span><span class="qty"><button type="button" data-m="${esc(x.p.id)}" aria-label="−">${ico("minus")}</button><b>${x.c}</b><button type="button" data-p="${esc(x.p.id)}" aria-label="+">${ico("plus")}</button></span><b>${S(x.p.precio * x.c)}</b></li>`).join("")}</ul>
      <div class="cart-t"><span>${t("total")}</span><b>${S(total())}</b></div>` : `<p class="muted">${t("vacio")}</p>`;
    onChange && onChange();
  }
  const add = (id, d) => { const p = lista().find(x => x.id === id); if (!p) return; const c = C[id] || (C[id] = { p, c: 0 }); c.c = Math.max(0, Math.min(c.c + d, p.stock ?? 99)); if (!c.c) delete C[id]; pintar(); };
  box.addEventListener("click", e => { const m = e.target.closest("[data-m]"), p = e.target.closest("[data-p]"); if (m) add(m.dataset.m, -1); if (p) add(p.dataset.p, 1); });
  pintar();
  return { add, total, items: () => Object.values(C).filter(x => x.c > 0).map(x => ({ id: x.p.id, n: x.p.n, precio: +x.p.precio, cant: x.c })), vaciar() { for (const k in C) delete C[k]; pintar(); }, cantidad: () => Object.values(C).reduce((a, x) => a + x.c, 0) };
}
const prodImg = p => p.foto ? `<span class="prod-f"><img src="${esc(p.foto)}" alt="${esc(L(p, "n"))}" loading="lazy"></span>` : `<span class="prod-f prod-e" aria-hidden="true">${esc(p.e || "🛍️")}</span>`;
const gridProds = (l, cat) => l.map(p => { const ag = p.stock != null && +p.stock <= 0; return `<div class="prod ${ag ? "off" : ""}">${prodImg(p)}<b>${esc(L(p, "n"))}</b><span class="prod-p">${S(p.precio)}</span>
  <button class="btn btn-light btn-sm" data-add="${esc(p.id)}" ${ag ? "disabled" : ""}>${ag ? t("agotado") : ico("plus") + " " + t("agregar")}</button></div>`; }).join("");
async function pgTienda(cat) {
  let sede = PARAMS.get("sede") || store.get("kh_sede", cat.sedes[0]?.id), cat0 = "";
  if (!cat.sedes.find(s => s.id === sede)) sede = cat.sedes[0]?.id;
  aplicarTema(temaDe(cat.sedes.find(s => s.id === sede))); layout(cat);
  $("#main").innerHTML = `<section class="page-h"><div class="wrap"><h1>${t("tiendaTit")}</h1><p class="lead">${t("tiendaTxt")}</p></div></section>
  <section class="sec sec-tight"><div class="wrap shop-g"><div>
    ${cat.sedes.length > 1 ? `<label class="fld fld-in"><span>${t("sede")}</span><select id="tSede">${cat.sedes.map(s => `<option value="${esc(s.id)}" ${s.id === sede ? "selected" : ""}>${esc(s.nombre)}</option>`).join("")}</select></label>` : ""}
    <div class="chips" id="cats"></div><div class="prods prods-g" id="grid"></div></div>
    <aside class="sum cart"><h2>${ico("cart")} ${t("carrito")}</h2><div id="cart"></div>
      <form id="tf" novalidate hidden><div class="f-g">
        <label class="fld full"><span>${t("entrega")}</span><select name="entrega"><option value="recojo">${t("recojo")}</option><option value="habitacion">${t("aMiHab")}</option></select></label>
        <label class="fld" id="fHab" hidden><span>${t("numHab")}</span><input name="num" maxlength="6"></label>
        <label class="fld full"><span>${t("nombre")} *</span><input name="nombre" maxlength="60" required></label>
        <label class="fld full"><span>${t("celular")} *</span><input name="celular" type="tel" maxlength="20" required></label></div>
        <div id="pagoT"></div><p class="f-msg" id="tmsg" role="alert"></p><button class="btn btn-pri" style="width:100%">${t("pedir")}</button></form></aside></div></section>`;
  let LP = await DB.productos(sede); const lista = () => LP, pago = Pago($("#pagoT"), cat.aj);
  let cart = null; cart = carritoUI($("#cart"), lista, () => { const n = cart ? cart.cantidad() : 0; $("#tf").hidden = !n; if (n) pago.setMonto(cart.total()); });
  function pintar() {
    const l = lista(), cats = [...new Set(l.map(p => p.cat))];
    $("#cats").innerHTML = ["", ...cats].map(c => `<button class="chip" data-c="${c}" aria-pressed="${c === cat0}">${t("cat_" + (c || "todo"))}</button>`).join("");
    $("#grid").innerHTML = gridProds(l.filter(p => !cat0 || p.cat === cat0), cat);
  }
  pintar(); await pago.pintar();
  $("#cats").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) { cat0 = b.dataset.c; pintar(); } });
  $("#grid").addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b) { cart.add(b.dataset.add, 1); toast("✓ " + t("agregar")); } });
  $("#tSede")?.addEventListener("change", async e => { sede = e.target.value; store.set("kh_sede", sede); LP = await DB.productos(sede); cart.vaciar(); cat0 = ""; aplicarTema(temaDe(cat.sedes.find(s => s.id === sede))); pintar(); });
  $("#tf").addEventListener("change", e => { if (e.target.name === "entrega") $("#fHab").hidden = e.target.value !== "habitacion"; });
  $("#tf").addEventListener("submit", async e => {
    e.preventDefault(); const F = e.currentTarget, v = n => ($(`[name=${n}]`, F).value || "").trim(), m = $("#tmsg");
    if (!v("nombre") || v("celular").replace(/\D/g, "").length < 9) return m.textContent = t("errDatos");
    const pe = pago.validar(); if (pe) return m.textContent = pe;
    const p = pago.datos(), b = F.querySelector("button:last-child"); b.disabled = true;
    try {
      const id = await DB.pedido({ tipo: "tienda", origen: "web", sede, items: cart.items(), total: cart.total(), entrega: v("entrega"), num: v("num"), nombre: v("nombre"), celular: v("celular"),
        pago: "web", metodo: p.metodo, banco: p.banco, monto: p.monto, operacion: p.operacion, captura: p.captura, montoLeido: p.montoLeido, coincide: p.coincide, estado: "por-validar", lang: LANG, creado: new Date().toISOString() });
      $(".cart").innerHTML = `<div class="ok-h sm">${ico("check")}<h2>${t("pedidoOk")}</h2><p>${t("pedidoOkTxt")}</p><p class="code">${esc(id)}</p><a class="btn btn-light btn-sm" href="tienda">${t("tienda")}</a></div>`;
    } catch (er) { console.error(er); b.disabled = false; m.textContent = t("errGeneral"); }
  });
}

/* ================= HABITACIÓN (QR) ================= */
async function pgHabitacion(cat) {
  const key = PARAMS.get("k") || "", q = await DB.qr(key).catch(() => null);
  const s = q && cat.sedes.find(x => x.id === q.sede), h = q && cat.habs.find(x => x.id === q.hab);
  aplicarTema(temaDe(s)); document.documentElement.lang = LANG;
  if (!q || !s) { document.body.innerHTML = `<main class="qr-err">${LOGO}<h1>${esc(cat.aj.nombre)}</h1><p>${t("qrInvalido")}</p><a class="btn btn-pri" href="./">${t("inicio")}</a></main>`; return; }
  const num = q.num || (h && h.num) || "", aj = cat.aj, waR = s.whatsapp || aj.whatsapp, misKey = "kh_ped_" + key;
  document.title = `${t("habitacion")} ${num} · ${s.nombre}`;
  document.body.classList.add("app");
  document.body.innerHTML = `<header class="app-h">${LOGO}<div><b>${esc(s.nombre)}</b><small>${t("habitacion")} ${esc(num)}</small></div>
    <button class="lang" id="langBtn">${ico("globe")}<span>${LANG === "es" ? "EN" : "ES"}</span></button></header>
    <main id="main" class="app-m"></main>
    <nav class="app-n" aria-label="Menú">${[["inicio", "home", t("tabInicio")], ["tienda", "bag", t("tabTienda")], ["serv", "bell", t("tabServ")], ["tours", "compass", t("tabTours")], ["cerca", "map", t("tabCerca")]].map(([k, i, n]) => `<button data-tab="${k}">${ico(i)}<span>${n}</span></button>`).join("")}</nav>`;
  $("#langBtn").addEventListener("click", () => setLang(LANG === "es" ? "en" : "es"));
  let M = $("#main"); const cart = { ui: null };
  const pedir = async (p, okMsg) => {
    const id = await DB.pedido({ origen: "habitacion", sede: s.id, hab: q.hab, num: String(num), qr: key, estado: "nuevo", lang: LANG, creado: new Date().toISOString(), ...p });
    const l = store.get(misKey, []); l.unshift(id); store.set(misKey, l.slice(0, 20)); toast(okMsg || t("solicitudOk")); return id;
  };
  const pinBox = () => `<label class="fld pin-f" hidden><span>${t("pinTxt")}</span><input name="pin" inputmode="numeric" maxlength="4" pattern="[0-9]*" autocomplete="off"></label>`;
  const metodoPago = n => `<div class="opts2 sm"><label class="opt2 on"><input type="radio" name="pago${n}" value="habitacion" checked><b>${ico("home")} ${t("cargarHab")}</b></label>
    <label class="opt2"><input type="radio" name="pago${n}" value="al-recibir"><b>${ico("bag")} ${t("alRecibir")}</b><small>${t("alRecibirTxt")}</small></label></div>`;
  async function misPedidos() {
    const ids = store.get(misKey, []).slice(0, 6); if (!ids.length) return "";
    const l = (await Promise.all(ids.map(async id => ({ id, p: await DB.pedidoGet(id) })))).filter(x => x.p);
    return l.length ? `<section class="card"><h2>${ico("clock")} ${t("misPedidos")}</h2><ul class="mis">${l.map(({ id, p }) => `<li><span>${esc(p.items ? p.items.map(i => i.cant + "× " + i.n).join(", ") : (p.detalle || p.servicio || ""))}</span><span class="est est-${esc(p.estado)}">${t("est_" + String(p.estado).replace("-", "")) }</span></li>`).join("")}</ul></section>` : "";
  }
  const TABS = {
    async inicio() {
      M.innerHTML = `<section class="app-hero">${foto((h && h.fotos || [])[0] || s.foto, "", 900)}<div><h1>${t("bienvenido", { n: esc(num) })}</h1><p>${esc(s.nombre)} · ${esc(s.ciudad)}</p></div></section>
        <section class="card wifi-c"><div>${ico("wifi")}<span><small>${t("red")}</small><b>${esc(q.wifiNombre || "—")}</b></span></div><div><span><small>${t("clave")}</small><b>${esc(q.wifiClave || "—")}</b></span><button class="btn btn-light btn-sm" data-copy="${esc(q.wifiClave || "")}">${t("copiar")}</button></div></section>
        <section class="card"><h2>${ico("clock")} ${t("horarios")}</h2><p><b>${t("checkoutHasta", { h: esc(aj.checkout) })}</b></p><ul class="ticks sm">${(L(s, "reglas") || []).map(x => `<li>${ico("check")} ${esc(x)}</li>`).join("")}</ul></section>
        <section class="grid2">${[["tienda", "bag", t("tabTienda")], ["serv", "broom", t("limpieza")], ["serv", "tool", t("falla")], ["tours", "compass", t("tabTours")]].map(([k, i, n]) => `<button class="tile" data-go="${k}">${ico(i)}<span>${n}</span></button>`).join("")}</section>
        <section class="card"><h2>${ico("bell")} ${t("recepcion")}</h2><div class="row-a"><a class="btn btn-wa" target="_blank" rel="noopener" href="${wa(waR, `${t("habitacion")} ${num}: `)}">${ico("wa")} WhatsApp</a><a class="btn btn-light" href="tel:${esc(String(s.telefono || "").replace(/\s/g, ""))}">${ico("phone")} ${t("llamar")}</a></div></section>
        <div id="mis"></div>
        <section class="card enc"><h2>${ico("star")} ${t("alSalir")}</h2><div class="stars" role="radiogroup">${[1, 2, 3, 4, 5].map(n => `<button data-star="${n}" aria-label="${n}">${ico("star")}</button>`).join("")}</div>
          <textarea id="encT" rows="2" maxlength="300" placeholder="${LANG === "en" ? "Tell us more (optional)" : "Cuéntanos más (opcional)"}"></textarea><button class="btn btn-pri btn-sm" id="encB" disabled>${t("enviar")}</button><div id="encOk"></div></section>`;
      $("#mis").innerHTML = await misPedidos();
      let st = 0;
      M.querySelector(".stars").addEventListener("click", e => { const b = e.target.closest("[data-star]"); if (!b) return; st = +b.dataset.star; $$(".stars button").forEach(x => x.classList.toggle("on", +x.dataset.star <= st)); $("#encB").disabled = false; });
      $("#encB").addEventListener("click", async () => { $("#encB").disabled = true; await pedir({ tipo: "encuesta", estrellas: st, detalle: $("#encT").value.trim().slice(0, 300) }, t("gracias"));
        $("#encOk").innerHTML = st >= 4 && s.resena ? `<p>${t("dejaResena")}</p><a class="btn btn-light btn-sm" target="_blank" rel="noopener" href="${esc(s.resena)}">${ico("star")} Google</a>` : `<p>${t("gracias")}</p>`; });
    },
    async tienda() {
      const LP = await DB.productos(s.id), lista = () => LP;
      M.innerHTML = `<h1 class="app-t">${t("tabTienda")}</h1><div class="prods prods-g sm" id="grid">${gridProds(lista(), cat)}</div>
        <section class="card cart" id="cartC"><h2>${ico("cart")} ${t("carrito")}</h2><div id="cart"></div><div id="cartF" hidden>${metodoPago("T")}${pinBox()}<p class="f-msg" id="tmsg"></p><button class="btn btn-pri" id="tBtn" style="width:100%">${t("pedir")}</button></div></section>`;
      cart.ui = carritoUI($("#cart"), lista, () => { $("#cartF").hidden = !cart.ui || !cart.ui.cantidad(); });
      $("#cartF").hidden = !cart.ui.cantidad(); $(".pin-f", M).hidden = false;
      $("#grid").addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b) { cart.ui.add(b.dataset.add, 1); toast("✓ " + t("agregar")); } });
      M.addEventListener("change", e => { if (e.target.name === "pagoT") { $$(".opt2", M).forEach(x => x.classList.toggle("on", x.contains(e.target))); $(".pin-f", M).hidden = e.target.value !== "habitacion"; } });
      $("#tBtn").addEventListener("click", async () => {
        const pg = $("[name=pagoT]:checked", M).value, pin = ($("[name=pin]", M).value || "").trim(), m = $("#tmsg");
        if (pg === "habitacion" && pin.length !== 4) return m.textContent = t("pinTxt");
        $("#tBtn").disabled = true;
        try { await pedir({ tipo: "tienda", items: cart.ui.items(), total: cart.ui.total(), pago: pg, ...(pg === "habitacion" ? { pin } : {}) }, t("pedidoOk")); cart.ui.vaciar(); m.textContent = ""; $("#grid").innerHTML = gridProds(lista(), cat); }
        catch (er) { m.textContent = er.code === "pin" ? t("pinMal") : t("errGeneral"); }
        $("#tBtn").disabled = false;
      });
    },
    async serv() {
      const SV = [["limpieza", "broom"], ["toallas", "towel"], ["almohada", "pillow"], ["falla", "tool"], ["lateCheckout", "clock"], ["despertador", "alarm"], ["taxi", "car"]];
      M.innerHTML = `<h1 class="app-t">${t("tabServ")}</h1><div class="grid2">${SV.map(([k, i]) => `<button class="tile" data-sv="${k}">${ico(i)}<span>${t(k)}</span></button>`).join("")}</div><div id="svF"></div>`;
      M.querySelector(".grid2").addEventListener("click", e => {
        const b = e.target.closest("[data-sv]"); if (!b) return; const k = b.dataset.sv; $$(".tile", M).forEach(x => x.classList.toggle("on", x === b));
        const campos = { falla: `<label class="fld"><span>${t("detalle")} *</span><textarea name="d" rows="3" maxlength="300" required></textarea></label><label class="fld"><span>${t("fotoOpc")}</span><input type="file" name="foto" accept="image/*"></label>`,
          despertador: `<label class="fld"><span>${t("hora")} *</span><input type="time" name="d" required></label>`,
          taxi: `<label class="fld"><span>${t("hora")} *</span><input type="time" name="hora" required></label><label class="fld"><span>${t("destino")} *</span><input name="d" maxlength="80" required placeholder="${LANG === "en" ? "Airport" : "Aeropuerto"}"></label>`,
          lateCheckout: `<label class="fld"><span>${t("hora")}</span><select name="d">${["13:00", "14:00", "15:00", "16:00", "18:00"].map(x => `<option>${x}</option>`).join("")}</select></label>`,
          toallas: `<label class="fld"><span>${t("detalle")}</span><select name="d">${[1, 2, 3, 4].map(x => `<option>${x}</option>`).join("")}</select></label>` };
        $("#svF").innerHTML = `<section class="card"><h2>${t(k)}</h2><form id="svForm">${campos[k] || `<label class="fld"><span>${t("detalle")}</span><input name="d" maxlength="120"></label>`}<button class="btn btn-pri">${t("enviar")}</button></form></section>`;
        $("#svForm").addEventListener("submit", async ev => { ev.preventDefault(); const F = ev.currentTarget, d = ($("[name=d]", F)?.value || "").trim();
          if ($("[name=d][required]", F) && !d) return toast(t("errDatos"), true);
          let fotoData = ""; const fi = $("[name=foto]", F); if (fi && fi.files[0]) fotoData = await new Promise(ok => { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const k2 = Math.min(1, 800 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = im.width * k2; c.height = im.height * k2; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL("image/jpeg", .7)); }; im.src = r.result; }; r.readAsDataURL(fi.files[0]); });
          const hora = $("[name=hora]", F)?.value || "";
          F.querySelector("button").disabled = true;
          try { await pedir({ tipo: "servicio", servicio: k, detalle: `${t(k)}${d ? " · " + d : ""}${hora ? " · " + hora : ""}`, ...(fotoData ? { foto: fotoData } : {}) }); $("#svF").innerHTML = `<div class="ok-h sm">${ico("check")}<p>${t("solicitudOk")}</p></div>`; }
          catch (er) { toast(t("errGeneral"), true); F.querySelector("button").disabled = false; } });
      });
    },
    async tours() {
      const l = s.tours || [];
      M.innerHTML = `<h1 class="app-t">${t("tabTours")}</h1>${l.map(x => `<section class="card tour"><div><h2>${esc(L(x, "n"))}</h2><p class="muted">${esc(x.d || "")}</p><b>${S(x.precio)} <small>/ ${LANG === "en" ? "person" : "persona"}</small></b></div>
        <form data-tour="${esc(x.id)}"><div class="f-g"><label class="fld"><span>${t("fecha")}</span><input type="date" name="f" min="${hoyISO()}" value="${addD(hoyISO(), 1)}" required></label><label class="fld"><span>${t("personas")}</span><select name="n">${[1, 2, 3, 4, 5, 6].map(n => `<option>${n}</option>`).join("")}</select></label></div>
        ${metodoPago(x.id)}${pinBox()}<button class="btn btn-pri btn-sm">${t("pedirTour")}</button></form></section>`).join("") || `<p class="muted">—</p>`}`;
      $$(".pin-f", M).forEach(x => x.hidden = false);
      M.addEventListener("change", e => { if (/^pago/.test(e.target.name)) { const f = e.target.closest("form"); $$(".opt2", f).forEach(x => x.classList.toggle("on", x.contains(e.target))); $(".pin-f", f).hidden = e.target.value !== "habitacion"; } });
      M.addEventListener("submit", async e => { e.preventDefault(); const F = e.target, x = l.find(y => y.id === F.dataset.tour), n = +$("[name=n]", F).value, pg = $("[name^=pago]:checked", F).value, pin = ($("[name=pin]", F).value || "").trim();
        if (pg === "habitacion" && pin.length !== 4) return toast(t("pinTxt"), true);
        try { await pedir({ tipo: "tour", servicio: x.id, detalle: `${x.n} · ${$("[name=f]", F).value} · ${n} ${n === 1 ? "persona" : "personas"}`, items: [{ id: x.id, n: x.n, precio: +x.precio, cant: n }], total: x.precio * n, pago: pg, ...(pg === "habitacion" ? { pin } : {}) }); F.reset(); }
        catch (er) { toast(er.code === "pin" ? t("pinMal") : t("errGeneral"), true); } });
    },
    async cerca() {
      M.innerHTML = `<h1 class="app-t">${t("tabCerca")}</h1><section class="card"><ul class="cerca">${(s.cerca || []).map(c => `<li><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.n + ", " + s.ciudad + ", Perú")}">${ico("pin")}<span><b>${esc(c.n)}</b><small>${esc(c.d || "")}</small></span>${ico("arrow")}</a></li>`).join("")}</ul></section>
        <section class="card"><h2>${ico("map")} ${esc(s.nombre)}</h2><p>${esc(s.direccion)}, ${esc(s.ciudad)}</p><a class="btn btn-light btn-sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.direccion + ", " + s.ciudad + ", Perú")}">${t("comoLlegar")}</a></section>`;
    }
  };
  async function ir(k) { $$(".app-n button").forEach(b => b.setAttribute("aria-current", b.dataset.tab === k ? "page" : "false")); const nm = document.createElement("main"); nm.id = "main"; nm.className = "app-m"; M.replaceWith(nm); M = nm; await TABS[k](); scrollTo({ top: 0 }); }
  document.body.addEventListener("click", e => { const b = e.target.closest("[data-tab],[data-go]"); if (b) ir(b.dataset.tab || b.dataset.go);
    const c = e.target.closest("[data-copy]"); if (c && c.closest(".wifi-c")) navigator.clipboard?.writeText(c.dataset.copy).then(() => toast(t("copiado")), () => {}); });
  if (DEMO) demoBar();
  ir("inicio");
}

/* ================= Arranque ================= */
(async function () {
  const cat = await DB.catalogo(), pg = document.body.dataset.page;
  document.title = document.title.replace("{n}", cat.aj.nombre);
  const R = { index: pgInicio, habitaciones: pgHabitaciones, reservar: pgReservar, "mi-reserva": pgMiReserva, tienda: pgTienda, habitacion: pgHabitacion };
  try { await (R[pg] || pgInicio)(cat); } catch (e) { console.error(e); }
})();
