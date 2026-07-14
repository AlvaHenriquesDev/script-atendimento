// ============================================================
// Relógio — substitui horas.js.
// A função verificarHorario() do original não fazia nada (alarme nunca
// implementado); foi removida. Se quiser reintroduzir um alarme, dá pra
// adicionar uma checagem de horaAtual/minutoAtual dentro de tick().
// ============================================================

function tick() {
  var now = new Date();
  var pad = function (n) { return n.toString().padStart(2, "0"); };
  var horario = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());

  var el = document.getElementById("clockValue");
  if (el) el.textContent = horario;
}

tick();
setInterval(tick, 1000);
