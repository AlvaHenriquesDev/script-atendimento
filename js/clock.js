// ============================================================
// Relógio — substitui horas.js.
// Versão ES6 moderna, mantendo compatibilidade direta no navegador (file://).
// ============================================================

const tick = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const horario = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const el = document.getElementById("clockValue");
  if (el) el.textContent = horario;
};

tick();
setInterval(tick, 1000);
