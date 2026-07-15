// ============================================================
// Substitui as funções repetidas por UMA função genérica de copiar.
// Versão ES6 moderna, mantendo compatibilidade direta no navegador (file://).
// ============================================================

/**
 * Copia um texto para a área de transferência.
 * @param {string} text - texto a copiar
 * @param {object} [opts]
 * @param {string} [opts.confirmMessage] - se definido, pede confirm() antes de copiar
 * @param {function} [opts.onSuccess] - chamado após copiar com sucesso
 */
const copyToClipboard = (text, opts = {}) => {
  if (opts.confirmMessage && !window.confirm(opts.confirmMessage)) {
    return;
  }

  navigator.clipboard.writeText(text).then(
    () => {
      if (opts.onSuccess) opts.onSuccess();
    },
    (err) => {
      console.error("Falha ao copiar para a área de transferência:", err);
      alert("Não foi possível copiar automaticamente. Selecione o texto manualmente.");
    }
  );
};
