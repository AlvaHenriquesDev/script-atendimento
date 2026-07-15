// ============================================================
// CONFIGURAÇÃO — edite este arquivo para customizar textos e links.
// Nenhum outro arquivo .js precisa ser tocado para isso.
// Tudo aqui vira variável global simples (sem módulos ES) para
// funcionar abrindo o index.html direto no navegador (file://).
// ============================================================

// Links dos sistemas usados no atendimento.
var EXTERNAL_LINKS = [
  { label: "INTEGRATOR", url: "https://app2.vocetelecom.vc/" },
  { label: "CRM", url: "https://assine2.vocetelecom.com.br/" },
  { label: "GETEC", url: "http://360.vocetelecom.net.br/getec/index/" },
  {
    label: "ZAB - CORP",
    url: "https://zabbix.vocetelecom.vc/zabbix.php?action=dashboard.view&dashboardid=1",
  },
  { label: "GLPI", url: "https://glpi.vocetelecom.vc/glpi" },
  { label: "GRAFANA", url: "http://10.2.199.7:3000/" },
  { label: "Guia MESH", url: "http://alvahenriquesdev.github.io/guias-corporativos" },
{ label: "Teste", url: "http://google.com"}
];

// Respostas rápidas de chat. "editable: false" = campo fixo, oculto,
// só o botão aparece (igual ao comportamento do script original).
var QUICK_REPLIES = [
  { id: "bomDia", label: "Bom dia", value: "Bom dia! Em que posso ajudar?" },
  { id: "boaTarde", label: "Boa tarde", value: "Boa tarde! Em que posso ajudar?" },
  { id: "boaNoite", label: "Boa noite", value: "Boa noite! Em que posso ajudar?" },
  { id: "algoMais", label: "Algo mais?", value: "Algo mais que eu possa ajudar?" },
  { id: "obrigado", label: "Obrigado!", value: "Obrigado por escolher a Você Telecom!" },
];

// Testes de latência.
var LATENCY_TESTS = [
  { id: "teste1", label: "Latência 1 (BEL)", value: "ping bel.ptt.br -t" },
  { id: "teste2", label: "Latência 2 (SP)", value: "ping sp.ptt.br -t" },
];

// Modelo de abertura de O.S. (editável — o atendente preenche CTO/PORTA/OBS).
var SERVICE_ORDER_TEMPLATE = {
  id: "os",
  label: "Script O.S.",
  value:
    "DESCONEXÃO O.N.U. (CHECAR CABEAMENTO E VERIFICAR CONDIÇÕES DE USO DOS EQUIPAMENTOS DA VOCÊ TELECOM).\n" +
    "CTO:\n" +
    "PORTA:\n" +
    "OBS:",
};

// Cabeçalho reaproveitado nos modelos de atendimento, para não repetir
// operador/cargo em cada texto.
var ATTENDANCE_META = {
  operador: "ALVARO HENRIQUES",
  cargo: "SUPORTE N3 (CORPORATIVO)",
};

function attendanceHeader() {
  return "OPERADOR: " + ATTENDANCE_META.operador + "\nCARGO: " + ATTENDANCE_META.cargo;
}

// Modelos de registro de atendimento (os 3 campos + WhatsApp).
var ATTENDANCE_TEMPLATES = [
  {
    id: "att1",
    label: "Campo 1 — Lentidão",
    value:
      attendanceHeader() +
      "RELATO CLIENTE:\n" +
      "- INFORMOU LENTIDÃO DE ACESSO\n\n" +
      "ANALISE E PROCEDIMENTOS:\n" +
      "- MAC APAGADO\n" +
      "- GERENCIA DE EQUIPAMENTOS\n" +
      "- TEMPERATURA: OK\n" +
      "- SINAL DE FIBRA: OK\n" +
      "- REBOOT REMOTO\n" +
      "- TESTE DE LATENCIA DNS GOOGLE: SEM PERDAS\n\n" +
      "SOLICITADOS TESTES À CLIENTE",
  },
  {
    id: "att2",
    label: "Campo 2 — Desconexão",
    value:
      attendanceHeader() +
      "RELATO CLIENTE:\n" +
      "- DESCONEXÃO\n\n" +
      "ANALISE E PROCEDIMENTOS:\n" +
      "- PPPOE DESCONECTADO\n" +
      "- ONU INATIVA ()\n" +
      "- CTO COM CLIENTES ATIVOS E CONECTADOS\n" +
      "- NECESSÁRIA ABERTURA DE CHAMADO\n\n" +
      "HORARIO INFORMADO P/ CLIENTE:\n" +
      "CONTATO DO ATENDIMENTO:",
  },
  {
    id: "att3",
    label: "Campo 3 — Genérico",
    value: attendanceHeader() + "SOLICITAÇÃO DO CLIENTE:\n\nPROCEDIMENTOS:",
  },
];

var WHATSAPP_TEMPLATE = {
  id: "osZap",
  label: "Script WhatsApp",
  value:
    "ATENÇÂO! CLIENTE CORPORATIVO\n" +
    "*ABERTA O.S*\n" +
    "PROTOCOLO:\n" +
    "CLIENTE:\n" +
    "PLANO:\n" +
    "MOTIVO:\n" +
    "ABERTURA:\n" +
    "ENDEREÇO:\n" +
    "BAIRRO:\n" +
    "CIDADE:\n" +
    "EQUIPAMENTO:\n" +
    "HORARIO DE DISPONIBILIDADE:\n" +
    "TELEFONE PRA CONTATO:\n" +
    "OBS:",
};
