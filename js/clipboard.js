// ============================================================
// Substitui as ~15 funções repetidas (copy1, copy2, ams, login,
// password, logGpon...) do clipboard.js original por UMA função
// genérica, usada por qualquer campo criado em render.js.
// ============================================================

/**
 * Copia um texto para a área de transferência.
 * @param {string} text - texto a copiar
 * @param {object} [opts]
 * @param {string} [opts.confirmMessage] - se definido, pede confirm() antes de copiar
 * @param {function} [opts.onSuccess] - chamado após copiar com sucesso
 */
function copyToClipboard(text, opts) {
  opts = opts || {};

  if (opts.confirmMessage && !window.confirm(opts.confirmMessage)) {
    return;
  }

  navigator.clipboard.writeText(text).then(
    function () {
      if (opts.onSuccess) opts.onSuccess();
    },
    function (err) {
      console.error("Falha ao copiar para a área de transferência:", err);
      alert("Não foi possível copiar automaticamente. Selecione o texto manualmente.");
    }
  );
}
