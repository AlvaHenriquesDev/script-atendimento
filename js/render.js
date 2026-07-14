// ============================================================
// Monta a interface inteira a partir dos dados de config.js/credentials.js.
// Uma única função (createCopyField) gera qualquer campo de "copiar texto",
// evitando repetir HTML ou funções de clique.
// ============================================================

/**
 * Cria o elemento de um campo de copiar.
 * @param {object} cfg
 * @param {string} cfg.id
 * @param {string} cfg.label
 * @param {string} cfg.value
 * @param {boolean} [cfg.multiline]
 * @param {number}  [cfg.rows]
 * @param {boolean} [cfg.destructive] - true exige confirmação antes de copiar
 * @param {boolean} [cfg.editable] - true = campo visível e editável antes de
 *   copiar (relatórios de atendimento); false = campo fixo oculto, só o
 *   botão aparece (chat, senhas) — igual ao script original.
 */
function createCopyField(cfg) {
  var wrapper = document.createElement("div");
  wrapper.className = "copy-field" + (cfg.destructive ? " copy-field--danger" : "");

  var field = document.createElement(cfg.multiline ? "textarea" : "input");
  field.className = "copy-field__input" + (cfg.editable ? "" : " copy-field__input--hidden");
  field.setAttribute("aria-label", cfg.label);
  if (!cfg.multiline) field.type = "text";
  if (cfg.multiline) field.rows = cfg.rows || 4;
  field.value = cfg.value;
  field.readOnly = !cfg.editable;

  var button = document.createElement("button");
  button.type = "button";
  button.textContent = cfg.editable ? "Copiar" : cfg.label;

  button.addEventListener("click", function () {
    copyToClipboard(field.value, {
      confirmMessage: cfg.destructive
        ? 'Atenção: "' + cfg.label + '" copia um comando destrutivo. Confirma?'
        : undefined,
      onSuccess: function () {
        var original = button.textContent;
        button.textContent = "Copiado!";
        setTimeout(function () {
          button.textContent = original;
        }, 1500);
      },
    });
  });

  wrapper.appendChild(field);
  wrapper.appendChild(button);
  return wrapper;
}

function renderList(containerId, items, extraProps) {
  var container = document.getElementById(containerId);
  items.forEach(function (item) {
    var props = Object.assign({}, item, extraProps || {});
    container.appendChild(createCopyField(props));
  });
}

function renderNavLinks() {
  var nav = document.getElementById("navLinks");
  EXTERNAL_LINKS.forEach(function (link) {
    var a = document.createElement("a");
    a.className = "nav-links__item";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = link.label;
    nav.appendChild(a);
  });
}

function renderCredentials() {
  renderList("credentials", [
    { id: "amsIp", label: "IP AMS", value: CREDENTIALS.amsIp },
    { id: "login", label: "Login", value: CREDENTIALS.login },
    { id: "password", label: "Senha", value: CREDENTIALS.password },
    { id: "gponLogin", label: "Login GPON", value: CREDENTIALS.gponLogin },
    { id: "gponPassword", label: "Senha GPON", value: CREDENTIALS.gponPassword },
    { id: "datacomUser", label: "User Datacom", value: CREDENTIALS.datacomUser },
    { id: "datacomPassword", label: "Senha Datacom", value: CREDENTIALS.datacomPassword },
  ]);
}

function renderOperations() {
  var container = document.getElementById("operations");

  LATENCY_TESTS.forEach(function (test) {
    container.appendChild(createCopyField(test));
  });

  container.appendChild(
    createCopyField(Object.assign({ multiline: true, rows: 4, editable: true }, SERVICE_ORDER_TEMPLATE))
  );
}

function renderAttendanceTemplates() {
  var container = document.getElementById("attendanceTemplates");

  ATTENDANCE_TEMPLATES.concat([WHATSAPP_TEMPLATE]).forEach(function (template) {
    var card = document.createElement("div");
    card.className = "attendance-card";

    var title = document.createElement("h3");
    title.textContent = template.label;
    card.appendChild(title);

    card.appendChild(
      createCopyField(
        Object.assign({ multiline: true, rows: template === WHATSAPP_TEMPLATE ? 15 : 17, editable: true }, template)
      )
    );

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderNavLinks();
  renderList("quickReplies", QUICK_REPLIES);
  renderCredentials();
  renderOperations();
  renderAttendanceTemplates();
});
