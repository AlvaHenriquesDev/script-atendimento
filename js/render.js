// ============================================================
// Monta a interface inteira a partir dos dados de config.js/credentials.js.
// Versão ES6 moderna, adicionando busca, toasts, exibição de senhas,
// persistência local do operador e modal de senhas de sessão.
// ============================================================

// Sistema de Toasts (Notificação Flutuante)
const showToast = (title, message, type = "info") => {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;

  const infoIcon = `<svg class="icon toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  const checkCircleIcon = `<svg class="icon toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

  const icon = type === "success" ? checkCircleIcon : infoIcon;

  toast.innerHTML = `
    ${icon}
    <div class="toast__content">
      <div class="toast__title">${title}</div>
      <div class="toast__message">${message}</div>
    </div>
    <div class="toast__progress"></div>
  `;

  container.appendChild(toast);

  // Remove toast após animação (3000ms)
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Reconstrói dinamicamente o valor do template se o cabeçalho mudar
const getUpdatedTemplateValue = (template) => {
  const val = template.value;
  if (val.startsWith("OPERADOR:")) {
    const splitKey = "\nCANAL DE ATENDIMENTO:\n\n";
    const index = val.indexOf(splitKey);
    if (index !== -1) {
      const body = val.substring(index + splitKey.length);
      return attendanceHeader() + body;
    }
  }
  return val;
};

/**
 * Cria o elemento de um campo de copiar comum.
 */
const createCopyField = (cfg) => {
  const wrapper = document.createElement("div");
  wrapper.className = "copy-field" + (cfg.destructive ? " copy-field--danger" : "");
  wrapper.setAttribute("data-search-terms", `${cfg.label} ${cfg.value}`.toLowerCase());

  const field = document.createElement(cfg.multiline ? "textarea" : "input");
  field.className = "copy-field__input" + (cfg.editable ? "" : " copy-field__input--hidden");
  field.setAttribute("aria-label", cfg.label);
  if (!cfg.multiline) field.type = "text";
  if (cfg.multiline) field.rows = cfg.rows || 4;
  field.value = cfg.value;
  field.readOnly = !cfg.editable;

  const button = document.createElement("button");
  button.type = "button";
  
  const copyIconSvg = `<svg class="icon icon--copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  button.innerHTML = cfg.editable ? `${copyIconSvg} Copiar` : `${copyIconSvg} ${cfg.label}`;

  button.addEventListener("click", () => {
    copyToClipboard(field.value, {
      confirmMessage: cfg.destructive
        ? `Atenção: "${cfg.label}" copia um comando destrutivo. Confirma?`
        : undefined,
      onSuccess: () => {
        const originalContent = button.innerHTML;
        const checkIconSvg = `<svg class="icon icon--check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        button.innerHTML = `${checkIconSvg} Copiado!`;
        
        showToast("Copiado!", `"${cfg.label}" copiado para a área de transferência.`, "success");
        
        setTimeout(() => {
          button.innerHTML = originalContent;
        }, 1500);
      },
    });
  });

  wrapper.appendChild(field);
  wrapper.appendChild(button);
  return wrapper;
};

/**
 * Cria o elemento de credencial com máscara e botão de reveal (olho).
 */
const createCredentialField = (cfg) => {
  const wrapper = document.createElement("div");
  wrapper.className = "credential-wrapper";
  wrapper.setAttribute("data-search-terms", `${cfg.label} ${cfg.value}`.toLowerCase());

  const labelLower = cfg.label.toLowerCase();
  const idLower = cfg.id.toLowerCase();
  const isPassword = idLower.includes("password") || idLower.includes("senha") || 
                     labelLower.includes("senha") || labelLower.includes("password") ||
                     idLower.includes("mikrotik") || labelLower.includes("mikrotik") ||
                     idLower.includes("almoxerifado") || labelLower.includes("almoxerifado");
  
  let masked = isPassword;

  const btnCopy = document.createElement("button");
  btnCopy.type = "button";
  btnCopy.className = "btn-copy";
  btnCopy.title = "Clique para copiar";

  const labelSpan = document.createElement("span");
  labelSpan.className = "credential-label";
  labelSpan.textContent = cfg.label;

  const valueSpan = document.createElement("span");
  valueSpan.className = "credential-value";
  valueSpan.textContent = masked ? "••••••••" : cfg.value;

  btnCopy.appendChild(labelSpan);
  btnCopy.appendChild(valueSpan);

  const btnReveal = document.createElement("button");
  btnReveal.type = "button";
  btnReveal.className = "btn-reveal";
  btnReveal.title = masked ? "Mostrar valor" : "Ocultar valor";
  
  const eyeIcon = `<svg class="icon icon--eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeOffIcon = `<svg class="icon icon--eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  btnReveal.innerHTML = masked ? eyeIcon : eyeOffIcon;

  btnReveal.addEventListener("click", (e) => {
    e.stopPropagation();
    masked = !masked;
    valueSpan.textContent = masked ? "••••••••" : cfg.value;
    btnReveal.innerHTML = masked ? eyeIcon : eyeOffIcon;
    btnReveal.title = masked ? "Mostrar valor" : "Ocultar valor";
  });

  btnCopy.addEventListener("click", () => {
    copyToClipboard(cfg.value, {
      onSuccess: () => {
        showToast("Copiado!", `"${cfg.label}" copiado para a área de transferência.`, "success");
        const originalText = labelSpan.textContent;
        labelSpan.textContent = "Copiado!";
        setTimeout(() => {
          labelSpan.textContent = originalText;
        }, 1500);
      }
    });
  });

  wrapper.appendChild(btnCopy);
  wrapper.appendChild(btnReveal);
  return wrapper;
};

const renderList = (containerId, items, extraProps = {}) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  items.forEach((item) => {
    const props = Object.assign({}, item, extraProps);
    container.appendChild(createCopyField(props));
  });
};

const renderNavLinks = () => {
  const nav = document.getElementById("navLinks");
  if (!nav) return;
  EXTERNAL_LINKS.forEach((link) => {
    const a = document.createElement("a");
    a.className = "nav-links__item";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = link.label;
    nav.appendChild(a);
  });
};

const renderCredentials = () => {
  const container = document.getElementById("credentials");
  if (!container) return;
  const creds = [
    { id: "amsIp", label: "IP AMS", value: CREDENTIALS.amsIp },
    { id: "login", label: "Login", value: CREDENTIALS.login },
    { id: "password", label: "Senha", value: CREDENTIALS.password },
    { id: "gponLogin", label: "Login GPON", value: CREDENTIALS.gponLogin },
    { id: "gponPassword", label: "Senha GPON", value: CREDENTIALS.gponPassword },
    { id: "mikrotik1", label: "Mikrotik 1", value: CREDENTIALS.mikrotik1 },
    { id: "mikrotik2", label: "Mikrotik 2", value: CREDENTIALS.mikrotik2 },
    { id: "almoxerifado", label: "Almoxerifado", value: CREDENTIALS.almoxerifado },
  ];
  creds.forEach((cred) => {
    container.appendChild(createCredentialField(cred));
  });
};

const renderOperations = () => {
  const container = document.getElementById("operations");
  if (!container) return;

  // Testes de latência
  LATENCY_TESTS.forEach((test) => {
    container.appendChild(createCopyField(test));
  });
};

const renderAttendanceTemplates = () => {
  const container = document.getElementById("attendanceTemplates");
  if (!container) return;

  const allTemplates = [SERVICE_ORDER_TEMPLATE].concat(ATTENDANCE_TEMPLATES).concat([WHATSAPP_TEMPLATE]);

  allTemplates.forEach((template) => {
    const card = document.createElement("div");
    card.className = "attendance-card";

    const title = document.createElement("h3");
    title.textContent = template.label;
    card.appendChild(title);

    const val = getUpdatedTemplateValue(template);

    let rows = 17;
    if (template === WHATSAPP_TEMPLATE) {
      rows = 15;
    } else if (template === SERVICE_ORDER_TEMPLATE) {
      rows = 8;
    }

    card.appendChild(
      createCopyField(
        Object.assign({ multiline: true, rows: rows, editable: true }, template, { value: val })
      )
    );

    container.appendChild(card);
  });
};

// Carrega configurações personalizadas do localStorage ou usa padrão do config.js
const loadSettings = () => {
  const savedOperator = localStorage.getItem("attendance_operador");
  const savedRole = localStorage.getItem("attendance_cargo");

  if (savedOperator !== null) {
    ATTENDANCE_META.operador = savedOperator;
  }
  if (savedRole !== null) {
    ATTENDANCE_META.cargo = savedRole;
  }
};

// Carrega senhas da sessão salvos no localStorage
const loadSessionCredentials = () => {
  const ams = localStorage.getItem("session_ams_password");
  const gpon = localStorage.getItem("session_gpon_password");
  const mk1 = localStorage.getItem("session_mikrotik1");
  const mk2 = localStorage.getItem("session_mikrotik2");
  const alm = localStorage.getItem("session_almoxerifado");

  if (ams !== null) CREDENTIALS.password = ams;
  if (gpon !== null) CREDENTIALS.gponPassword = gpon;
  if (mk1 !== null) CREDENTIALS.mikrotik1 = mk1;
  if (mk2 !== null) CREDENTIALS.mikrotik2 = mk2;
  if (alm !== null) CREDENTIALS.almoxerifado = alm;
};

// Inicializa o Painel de Configurações do Operador
const initSettingsPanel = () => {
  const panel = document.getElementById("settingsPanel");
  const btnSettings = document.getElementById("btnSettings");
  const btnSave = document.getElementById("btnSaveSettings");
  const btnCancel = document.getElementById("btnCancelSettings");
  
  const inputName = document.getElementById("opName");
  const inputRole = document.getElementById("opRole");

  if (!panel || !btnSettings || !btnSave || !btnCancel || !inputName || !inputRole) return;

  btnSettings.addEventListener("click", () => {
    inputName.value = ATTENDANCE_META.operador;
    inputRole.value = ATTENDANCE_META.cargo;
    panel.classList.toggle("hidden");
  });

  btnCancel.addEventListener("click", () => {
    panel.classList.add("hidden");
  });

  btnSave.addEventListener("click", () => {
    const name = inputName.value.trim();
    const role = inputRole.value.trim();

    if (!name || !role) {
      showToast("Erro", "Por favor, preencha todos os campos.", "info");
      return;
    }

    localStorage.setItem("attendance_operador", name);
    localStorage.setItem("attendance_cargo", role);
    
    ATTENDANCE_META.operador = name;
    ATTENDANCE_META.cargo = role;

    showToast("Salvo!", "Informações do operador salvas com sucesso.", "success");
    panel.classList.add("hidden");

    const container = document.getElementById("attendanceTemplates");
    if (container) {
      container.innerHTML = "";
      renderAttendanceTemplates();
    }
  });
};

// Inicializa o modal de Senhas de Inicialização
const initPasswordsModal = () => {
  const modal = document.getElementById("passwordsModal");
  const btnTrigger = document.getElementById("btnPasswords");
  const btnSave = document.getElementById("btnSavePasswords");
  const btnCancel = document.getElementById("btnCancelPasswords");

  const inputAms = document.getElementById("pwdAms");
  const inputGpon = document.getElementById("pwdGpon");
  const inputMk1 = document.getElementById("pwdMikrotik1");
  const inputMk2 = document.getElementById("pwdMikrotik2");
  const inputAlm = document.getElementById("pwdAlmoxerifado");

  if (!modal || !btnSave || !btnCancel || !inputAms || !inputGpon || !inputMk1 || !inputMk2 || !inputAlm) return;

  const openModal = () => {
    inputAms.value = CREDENTIALS.password;
    inputGpon.value = CREDENTIALS.gponPassword;
    inputMk1.value = CREDENTIALS.mikrotik1;
    inputMk2.value = CREDENTIALS.mikrotik2;
    inputAlm.value = CREDENTIALS.almoxerifado;
    modal.classList.remove("hidden");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
  };

  // Abre modal sempre na inicialização
  openModal();

  if (btnTrigger) {
    btnTrigger.addEventListener("click", openModal);
  }

  btnCancel.addEventListener("click", closeModal);

  btnSave.addEventListener("click", () => {
    const ams = inputAms.value.trim();
    const gpon = inputGpon.value.trim();
    const mk1 = inputMk1.value.trim();
    const mk2 = inputMk2.value.trim();
    const alm = inputAlm.value.trim();

    if (!ams || !gpon || !mk1 || !mk2 || !alm) {
      showToast("Erro", "Por favor, preencha todas as senhas.", "info");
      return;
    }

    localStorage.setItem("session_ams_password", ams);
    localStorage.setItem("session_gpon_password", gpon);
    localStorage.setItem("session_mikrotik1", mk1);
    localStorage.setItem("session_mikrotik2", mk2);
    localStorage.setItem("session_almoxerifado", alm);

    CREDENTIALS.password = ams;
    CREDENTIALS.gponPassword = gpon;
    CREDENTIALS.mikrotik1 = mk1;
    CREDENTIALS.mikrotik2 = mk2;
    CREDENTIALS.almoxerifado = alm;

    showToast("Salvo!", "Senhas da sessão atualizadas.", "success");
    closeModal();

    // Re-renderizar credenciais e operações
    const credContainer = document.getElementById("credentials");
    if (credContainer) {
      credContainer.innerHTML = "";
      renderCredentials();
    }
    const opContainer = document.getElementById("operations");
    if (opContainer) {
      opContainer.innerHTML = "";
      renderOperations();
    }
  });
};

// Inicializa a Barra de Busca Dinâmica
const initSearch = () => {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    // 1. Chat (Respostas Rápidas)
    const quickReplies = document.querySelectorAll("#quickReplies .copy-field");
    let hasVisibleQuickReplies = false;
    quickReplies.forEach((el) => {
      const terms = el.getAttribute("data-search-terms") || "";
      if (terms.includes(query)) {
        el.style.display = "";
        hasVisibleQuickReplies = true;
      } else {
        el.style.display = "none";
      }
    });
    toggleSectionVisibility("secQuickReplies", hasVisibleQuickReplies);

    // 2. Senhas e Logins
    const credentials = document.querySelectorAll("#credentials .credential-wrapper");
    let hasVisibleCredentials = false;
    credentials.forEach((el) => {
      const terms = el.getAttribute("data-search-terms") || "";
      if (terms.includes(query)) {
        el.style.display = "";
        hasVisibleCredentials = true;
      } else {
        el.style.display = "none";
      }
    });
    toggleSectionVisibility("secCredentials", hasVisibleCredentials);

    // 3. Operações
    const operations = document.querySelectorAll("#operations > *");
    let hasVisibleOperations = false;
    operations.forEach((el) => {
      const terms = el.getAttribute("data-search-terms") || "";
      if (terms.includes(query)) {
        el.style.display = "";
        hasVisibleOperations = true;
      } else {
        el.style.display = "none";
      }
    });
    toggleSectionVisibility("secOperations", hasVisibleOperations);

    // 4. Cards de Atendimento (Templates + Script OS)
    const cards = document.querySelectorAll("#attendanceTemplates .attendance-card");
    cards.forEach((el) => {
      const title = el.querySelector("h3")?.textContent.toLowerCase() || "";
      const textarea = el.querySelector("textarea")?.value.toLowerCase() || "";
      if (title.includes(query) || textarea.includes(query)) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });
  });
};

const toggleSectionVisibility = (sectionId, isVisible) => {
  const sec = document.getElementById(sectionId);
  if (!sec) return;
  if (isVisible) {
    sec.classList.remove("hidden");
  } else {
    sec.classList.add("hidden");
  }
};

// Inicialização Geral
document.addEventListener("DOMContentLoaded", () => {
  loadSessionCredentials();
  loadSettings();
  renderNavLinks();
  renderList("quickReplies", QUICK_REPLIES);
  renderCredentials();
  renderOperations();
  renderAttendanceTemplates();
  initSettingsPanel();
  initPasswordsModal();
  initSearch();
});
