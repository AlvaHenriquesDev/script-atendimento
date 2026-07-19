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
    const headerEnd = val.indexOf("\n\n");
    if (headerEnd !== -1) {
      const body = val.substring(headerEnd + 2);
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


// ============================================================
// Gerador integrado de O.S. + Informativo para o grupo.
// Os dados são preenchidos uma única vez e reutilizados nos dois textos.
// ============================================================
const SERVICE_ORDER_TYPES = {
  desconexao: {
    label: "Desconexão da ONU",
    title: "DESCONEXÃO O.N.U.",
    instruction:
      "(CHECAR CABEAMENTO E VERIFICAR CONDIÇÕES DE USO DOS EQUIPAMENTOS DA VOCÊ TELECOM)",
    showPower: false,
    installation: false,
  },
  modulacao: {
    label: "Modulação de porta",
    title: "O.S. MODULAÇÃO DE PORTA",
    instruction:
      "CHECAR MODULAÇÃO DA PORTA (CHECAR CABEAMENTO E VERIFICAR CONDIÇÕES DE USO DOS EQUIPAMENTOS DA VOCÊ TELECOM)",
    showPower: false,
    installation: false,
  },
  potencia: {
    label: "Potência fora do padrão",
    title: "O.S. POTÊNCIA FORA DO PADRÃO",
    instruction:
      "(CHECAR CABEAMENTO E VERIFICAR CONDIÇÕES DE USO DOS EQUIPAMENTOS DA VOCÊ TELECOM)",
    showPower: true,
    installation: false,
  },
  instalacao: {
    label: "Instalação",
    title: "O.S. INSTALAÇÃO",
    instruction: "REALIZAR INSTALAÇÃO CONFORME OS DADOS ABAIXO.",
    showPower: false,
    installation: true,
  },
};

const injectServiceGeneratorStyles = () => {
  if (document.getElementById("serviceGeneratorStyles")) return;

  const style = document.createElement("style");
  style.id = "serviceGeneratorStyles";
  style.textContent = `
    .service-generator {
      grid-column: 1 / -1;
    }

    .service-generator__description {
      margin: -4px 0 18px;
      opacity: 0.8;
      line-height: 1.5;
    }

    .service-generator__form {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }

    .service-generator__field {
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }

    .service-generator__field--wide {
      grid-column: span 2;
    }

    .service-generator__field--full {
      grid-column: 1 / -1;
    }

    .service-generator__field label {
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      opacity: 0.9;
    }

    .service-generator__field input,
    .service-generator__field select,
    .service-generator__field textarea,
    .service-generator__output textarea {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 8px;
      background: rgba(2, 8, 23, 0.5);
      color: inherit;
      padding: 11px 12px;
      font: inherit;
      outline: none;
    }

    .service-generator__field input:focus,
    .service-generator__field select:focus,
    .service-generator__field textarea:focus,
    .service-generator__output textarea:focus {
      border-color: #22d3ee;
      box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.12);
    }

    .service-generator__field textarea {
      min-height: 78px;
      resize: vertical;
    }

    .service-generator__outputs {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    .service-generator__output {
      min-width: 0;
      padding: 14px;
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 10px;
      background: rgba(2, 8, 23, 0.3);
    }

    .service-generator__output h4 {
      margin: 0 0 10px;
      font-size: 0.95rem;
    }

    .service-generator__output textarea {
      min-height: 315px;
      resize: vertical;
      line-height: 1.45;
      white-space: pre-wrap;
    }

    .service-generator__actions,
    .service-generator__output-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }

    .service-generator__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 40px;
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 8px;
      padding: 9px 14px;
      background: rgba(15, 23, 42, 0.75);
      color: inherit;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .service-generator__button:hover {
      border-color: #22d3ee;
    }

    .service-generator__button--primary {
      background: rgba(8, 145, 178, 0.28);
      border-color: rgba(34, 211, 238, 0.55);
    }

    .service-generator__hidden {
      display: none !important;
    }

    @media (max-width: 1100px) {
      .service-generator__form {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 760px) {
      .service-generator__form,
      .service-generator__outputs {
        grid-template-columns: 1fr;
      }

      .service-generator__field--wide,
      .service-generator__field--full {
        grid-column: auto;
      }
    }
  `;
  document.head.appendChild(style);
};

const createServiceGeneratorField = ({
  id,
  label,
  placeholder = "",
  type = "text",
  value = "",
  options = [],
  wide = false,
  full = false,
  rows = 3,
}) => {
  const wrapper = document.createElement("div");
  wrapper.className = "service-generator__field";
  if (wide) wrapper.classList.add("service-generator__field--wide");
  if (full) wrapper.classList.add("service-generator__field--full");

  const fieldLabel = document.createElement("label");
  fieldLabel.htmlFor = id;
  fieldLabel.textContent = label;
  wrapper.appendChild(fieldLabel);

  let field;
  if (type === "select") {
    field = document.createElement("select");
    options.forEach((optionCfg) => {
      const option = document.createElement("option");
      option.value = optionCfg.value;
      option.textContent = optionCfg.label;
      field.appendChild(option);
    });
  } else if (type === "textarea") {
    field = document.createElement("textarea");
    field.rows = rows;
  } else {
    field = document.createElement("input");
    field.type = type;
  }

  field.id = id;
  field.name = id;
  field.placeholder = placeholder;
  field.value = value;
  field.autocomplete = "off";
  wrapper.appendChild(field);

  return { wrapper, field };
};

const createServiceGeneratorCard = () => {
  const card = document.createElement("div");
  card.className = "attendance-card service-generator";
  card.setAttribute(
    "data-search-terms",
    "gerador ordem serviço os informativo grupo desconexão onu modulação porta potência fora padrão instalação"
  );

  const title = document.createElement("h3");
  title.textContent = "Gerador de O.S. + Informativo";
  card.appendChild(title);

  const description = document.createElement("p");
  description.className = "service-generator__description";
  description.textContent =
    "Preencha os dados uma única vez. A O.S. para o protocolo e o informativo para o grupo serão atualizados automaticamente.";
  card.appendChild(description);

  const form = document.createElement("div");
  form.className = "service-generator__form";

  const fields = {};
  const addField = (cfg) => {
    const created = createServiceGeneratorField(cfg);
    fields[cfg.id] = created.field;
    form.appendChild(created.wrapper);
    return created;
  };

  addField({
    id: "osGenType",
    label: "TIPO DE O.S.",
    type: "select",
    options: Object.entries(SERVICE_ORDER_TYPES).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  });
  addField({ id: "osGenProtocol", label: "PROTOCOLO", placeholder: "Ex.: 15143185" });
  addField({
    id: "osGenReason",
    label: "MOTIVO",
    placeholder: "Ex.: DESCONEXÃO",
    value: "DESCONEXÃO",
  });
  addField({
    id: "osGenClient",
    label: "CLIENTE",
    placeholder: "Razão social ou nome do cliente",
    wide: true,
  });
  addField({
    id: "osGenFantasy",
    label: "NOME FANTASIA (OPCIONAL)",
    placeholder: "Ex.: PROMED LAB",
    wide: true,
  });
  addField({
    id: "osGenPlan",
    label: "PLANO",
    placeholder: "Ex.: (80) CORP METROLAN REMOTO GPON",
    full: true,
  });

  const openingCreated = addField({
    id: "osGenOpening",
    label: "ABERTURA",
    placeholder: "Ex.: 16/07/2026 14:57",
    wide: true,
  });
  openingCreated.wrapper.id = "osGenOpeningWrapper";

  const ctoCreated = addField({ id: "osGenCto", label: "CTO", placeholder: "Ex.: MCP.02.75.03" });
  ctoCreated.wrapper.id = "osGenCtoWrapper";
  const portCreated = addField({ id: "osGenPort", label: "PORTA", placeholder: "Ex.: 08" });
  portCreated.wrapper.id = "osGenPortWrapper";
  const powerCreated = addField({
    id: "osGenPower",
    label: "POTÊNCIA",
    placeholder: "Ex.: -40.00 dBm",
  });
  powerCreated.wrapper.id = "osGenPowerWrapper";
  addField({
    id: "osGenPhone",
    label: "TELEFONE PARA CONTATO",
    placeholder: "Ex.: 559681163230",
  });

  addField({
    id: "osGenAddress",
    label: "ENDEREÇO",
    placeholder: "Rua, avenida, número e complemento",
    wide: true,
  });
  addField({ id: "osGenDistrict", label: "BAIRRO", placeholder: "Ex.: PACOVAL" });
  addField({ id: "osGenCity", label: "CIDADE", placeholder: "Ex.: MACAPÁ" });
  addField({
    id: "osGenReference",
    label: "REFERÊNCIA",
    placeholder: "Ex.: prédio branco e amarelo",
    wide: true,
  });
  addField({
    id: "osGenHours",
    label: "HORÁRIO DE FUNCIONAMENTO / DISPONIBILIDADE",
    placeholder: "Ex.: HORÁRIO COMERCIAL ou MANHÃ",
    wide: true,
  });
  const equipmentCreated = addField({
    id: "osGenEquipment",
    label: "EQUIPAMENTO",
    placeholder: "Ex.: ROUTERBOARD 750 GR3 - ONU NOKIA G-010G-P",
    full: true,
  });
  equipmentCreated.wrapper.id = "osGenEquipmentWrapper";

  const responsibleCreated = addField({
    id: "osGenResponsible",
    label: "RESPONSÁVEL PELA INSTALAÇÃO",
    placeholder: "Ex.: 96991356885 - Alberdan Viana",
    wide: true,
  });
  responsibleCreated.wrapper.id = "osGenResponsibleWrapper";

  const installCreated = addField({
    id: "osGenInstall",
    label: "INSTALAR",
    placeholder: "Ex.: ONU + BRIDGE",
    wide: true,
  });
  installCreated.wrapper.id = "osGenInstallWrapper";

  addField({
    id: "osGenNotes",
    label: "OBSERVAÇÕES DA O.S. (OPCIONAL)",
    placeholder: "Informações adicionais para o técnico",
    type: "textarea",
    full: true,
    rows: 3,
  });

  card.appendChild(form);

  const outputs = document.createElement("div");
  outputs.className = "service-generator__outputs";

  const createOutputBlock = (heading, id, rows, copyLabel) => {
    const block = document.createElement("div");
    block.className = "service-generator__output";

    const blockTitle = document.createElement("h4");
    blockTitle.textContent = heading;
    block.appendChild(blockTitle);

    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.rows = rows;
    textarea.readOnly = true;
    textarea.setAttribute("aria-label", heading);
    block.appendChild(textarea);

    const actions = document.createElement("div");
    actions.className = "service-generator__output-actions";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "service-generator__button service-generator__button--primary";
    copyButton.textContent = copyLabel;
    actions.appendChild(copyButton);

    block.appendChild(actions);
    outputs.appendChild(block);

    return { textarea, copyButton };
  };

  const osOutput = createOutputBlock(
    "O.S. para colocar no protocolo",
    "osGeneratedOutput",
    18,
    "Copiar O.S."
  );
  const infoOutput = createOutputBlock(
    "Informativo para enviar no grupo",
    "infoGeneratedOutput",
    18,
    "Copiar informativo"
  );

  card.appendChild(outputs);

  const bottomActions = document.createElement("div");
  bottomActions.className = "service-generator__actions";

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "service-generator__button";
  clearButton.textContent = "Limpar todos os campos";
  bottomActions.appendChild(clearButton);

  card.appendChild(bottomActions);

  const getValue = (id) => (fields[id]?.value || "").trim();

  const updateOutputs = () => {
    const selectedType = SERVICE_ORDER_TYPES[getValue("osGenType")] || SERVICE_ORDER_TYPES.desconexao;
    const powerWrapper = document.getElementById("osGenPowerWrapper");
    const ctoWrapper = document.getElementById("osGenCtoWrapper");
    const portWrapper = document.getElementById("osGenPortWrapper");
    const openingWrapper = document.getElementById("osGenOpeningWrapper");
    const responsibleWrapper = document.getElementById("osGenResponsibleWrapper");
    const installWrapper = document.getElementById("osGenInstallWrapper");
    const equipmentWrapper = document.getElementById("osGenEquipmentWrapper");

    if (powerWrapper) {
      powerWrapper.classList.toggle("service-generator__hidden", !selectedType.showPower);
    }
    if (ctoWrapper) {
      ctoWrapper.classList.toggle("service-generator__hidden", selectedType.installation);
    }
    if (portWrapper) {
      portWrapper.classList.toggle("service-generator__hidden", selectedType.installation);
    }
    if (openingWrapper) {
      openingWrapper.classList.toggle("service-generator__hidden", !selectedType.installation);
    }
    if (responsibleWrapper) {
      responsibleWrapper.classList.toggle("service-generator__hidden", !selectedType.installation);
    }
    if (installWrapper) {
      installWrapper.classList.toggle("service-generator__hidden", !selectedType.installation);
    }
    if (equipmentWrapper) {
      equipmentWrapper.classList.toggle("service-generator__hidden", selectedType.installation);
    }

    const protocol = getValue("osGenProtocol");
    const reason = getValue("osGenReason");
    const client = getValue("osGenClient");
    const fantasy = getValue("osGenFantasy");
    const plan = getValue("osGenPlan");
    const opening = getValue("osGenOpening");
    const cto = getValue("osGenCto");
    const port = getValue("osGenPort");
    const power = getValue("osGenPower");
    const phone = getValue("osGenPhone");
    const address = getValue("osGenAddress");
    const district = getValue("osGenDistrict");
    const city = getValue("osGenCity");
    const reference = getValue("osGenReference");
    const hours = getValue("osGenHours");
    const equipment = getValue("osGenEquipment");
    const responsible = getValue("osGenResponsible");
    const install = getValue("osGenInstall");
    const notes = getValue("osGenNotes");

    let osLines;

    if (selectedType.installation) {
      osLines = [
        "****************** ORDEM DE SERVIÇO ******************",
        selectedType.title,
        selectedType.instruction,
        "",
        `PLANO: ${plan}`,
        `ABERTURA: ${opening}`,
        `ENDEREÇO: ${address}`,
        `BAIRRO: ${district}`,
        `CIDADE: ${city}`,
        `REFERÊNCIA: ${reference}`,
        "",
        `RESPONSÁVEL PELA INSTALAÇÃO: ${responsible}`,
        "",
        `INSTALAR: ${install}`,
        `DISPONIBILIDADE: ${hours}`,
        `CONTATO: ${phone}`,
      ];
    } else {
      osLines = [
        "****************** ORDEM DE SERVIÇO ******************",
        selectedType.title,
        selectedType.instruction,
        "",
        `CTO: ${cto}`,
        `PORTA: ${port}`,
      ];

      if (selectedType.showPower) {
        osLines.push(`POTÊNCIA: ${power}`);
      }

      osLines.push(
        `ENDEREÇO: ${address}`,
        `BAIRRO: ${district}`,
        `CIDADE: ${city}`,
        `REFERÊNCIA: ${reference}`,
        `HORÁRIO DE DISPONIBILIDADE: ${hours}`,
        `EQUIPAMENTO: ${equipment}`,
        `TELEFONE PARA CONTATO: ${phone}`
      );
    }

    if (notes) {
      osLines.push(`OBSERVAÇÕES: ${notes}`);
    }

    osOutput.textarea.value = osLines.join("\n");

    const infoLines = [
      "🚨 ATENÇÃO - CLIENTE CORPORATIVO 🚨",
      `PROTOCOLO: ${protocol}`,
      `MOTIVO: *${selectedType.installation ? "INSTALAÇÃO" : reason}*`,
      `CLIENTE: ${client}`,
    ];

    if (fantasy) {
      infoLines.push(`NOME FANTASIA: ${fantasy}`);
    }

    infoLines.push(`PLANO: ${plan}`);

    if (selectedType.installation) {
      infoLines.push(
        `ABERTURA: ${opening}`,
        `ENDEREÇO: ${address}`,
        `BAIRRO: ${district}`,
        `CIDADE: ${city}`,
        `REFERÊNCIA: ${reference}`,
        `RESPONSÁVEL PELA INSTALAÇÃO: ${responsible}`,
        `INSTALAR: ${install}`,
        `DISPONIBILIDADE: ${hours}`,
        `CONTATO: ${phone}`
      );
    } else {
      infoLines.push(
        `ENDEREÇO: ${address}`,
        `BAIRRO: ${district}`,
        `CIDADE: ${city}`,
        `REFERÊNCIA: ${reference}`,
        `HORÁRIO DE FUNCIONAMENTO: ${hours}`,
        `EQUIPAMENTO: ${equipment}`,
        `TELEFONE PARA CONTATO: ${phone}`
      );
    }

    if (notes) {
      infoLines.push(`OBSERVAÇÕES: ${notes}`);
    }

    infoOutput.textarea.value = infoLines.join("\n");
  };

  Object.values(fields).forEach((field) => {
    field.addEventListener("input", updateOutputs);
    field.addEventListener("change", updateOutputs);
  });

  const bindCopy = (button, textarea, label) => {
    button.addEventListener("click", () => {
      copyToClipboard(textarea.value, {
        onSuccess: () => {
          const originalText = button.textContent;
          button.textContent = "Copiado!";
          showToast("Copiado!", `${label} copiado para a área de transferência.`, "success");
          setTimeout(() => {
            button.textContent = originalText;
          }, 1500);
        },
      });
    });
  };

  bindCopy(osOutput.copyButton, osOutput.textarea, "O.S.");
  bindCopy(infoOutput.copyButton, infoOutput.textarea, "Informativo");

  clearButton.addEventListener("click", () => {
    const confirmed = window.confirm("Deseja limpar todos os campos do gerador?");
    if (!confirmed) return;

    Object.values(fields).forEach((field) => {
      if (field.tagName === "SELECT") {
        field.selectedIndex = 0;
      } else {
        field.value = "";
      }
    });
    fields.osGenReason.value = "DESCONEXÃO";
    updateOutputs();
    showToast("Campos limpos", "O gerador está pronto para um novo atendimento.", "success");
  });

  updateOutputs();
  return card;
};

const renderAttendanceTemplates = () => {
  const container = document.getElementById("attendanceTemplates");
  if (!container) return;

  injectServiceGeneratorStyles();
  container.appendChild(createServiceGeneratorCard());

  const allTemplates = ATTENDANCE_TEMPLATES.concat([WHATSAPP_TEMPLATE]);

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
  const amsLogin = localStorage.getItem("session_ams_login");

  if (ams !== null) CREDENTIALS.password = ams;
  if (gpon !== null) CREDENTIALS.gponPassword = gpon;
  if (mk1 !== null) CREDENTIALS.mikrotik1 = mk1;
  if (mk2 !== null) CREDENTIALS.mikrotik2 = mk2;
  if (alm !== null) CREDENTIALS.almoxerifado = alm;
  if (amsLogin !== null) CREDENTIALS.login = amsLogin;
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

  const inputOpName = document.getElementById("modalOpName");
  const inputAmsLogin = document.getElementById("modalAmsLogin");

  if (!modal || !btnSave || !btnCancel || !inputOpName || !inputAmsLogin) return;

  const openModal = () => {
    inputOpName.value = ATTENDANCE_META.operador;
    inputAmsLogin.value = CREDENTIALS.login;
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
    const opName = inputOpName.value.trim();
    const amsLogin = inputAmsLogin.value.trim();

    if (!opName || !amsLogin) {
      showToast("Erro", "Por favor, preencha o operador e o login AMS.", "info");
      return;
    }

    localStorage.setItem("attendance_operador", opName);
    localStorage.setItem("session_ams_login", amsLogin);

    ATTENDANCE_META.operador = opName;
    CREDENTIALS.login = amsLogin;

    showToast("Salvo!", "Operador e login AMS atualizados.", "success");
    closeModal();

    const container = document.getElementById("attendanceTemplates");
    if (container) {
      container.innerHTML = "";
      renderAttendanceTemplates();
    }

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
      const staticTerms = el.getAttribute("data-search-terms") || "";
      const fieldText = Array.from(el.querySelectorAll("input, textarea, select"))
        .map((field) => `${field.value || ""} ${field.options?.[field.selectedIndex]?.text || ""}`)
        .join(" ")
        .toLowerCase();

      if (title.includes(query) || staticTerms.includes(query) || fieldText.includes(query)) {
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
