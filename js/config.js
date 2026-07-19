// ============================================================
// CONFIGURAÇÃO — edite este arquivo para customizar textos e links.
// Nenhum outro arquivo .js precisa ser tocado para isso.
// Tudo aqui vira variável global simples (sem módulos ES) para
// funcionar abrindo o index.html direto no navegador (file://).
// ============================================================

// Links dos sistemas usados no atendimento.
var EXTERNAL_LINKS = [
  {
    label: "INTEGRATOR",
    url: "https://app2.vocetelecom.vc/",
  },

  {
    label: "GUIA IP FIXO",
    url: "file:///C:/Users/Aguinaldo/Downloads/script-atendimento/script-atendimento/js/guia-ip-fixo.html",
  },

  {
    label: "GUIA BLOCO DE IP",
    url: "js/bloco-ip.pdf",
  },

  {
    label: "REDIREC. PORTAS",
    url: "js/redirecionamento-portas.pdf",
  },

  {
    label: "ATIVAÇÃO DE RB",
    url: "js/ativacao-rb.pdf",
  },

  {
    label: "GUIA EOIP",
    url: "js/eoip.html",
  },

  {
    label: "CRM",
    url: "https://assine2.vocetelecom.com.br/",
  },

  {
    label: "GETEC",
    url: "http://360.vocetelecom.net.br/getec/index/",
  },

  {
    label: "ZAB - CORP",
    url: "https://zabbix.vocetelecom.vc/zabbix.php?action=dashboard.view&dashboardid=1",
  },

  {
    label: "GLPI",
    url: "https://glpi.vocetelecom.vc/glpi",
  },

  {
    label: "GRAFANA",
    url: "http://10.2.199.7:3000/",
  },

  {
    label: "Guia MESH",
    url: "http://alvahenriquesdev.github.io/guias-corporativos",
  },

  {
    label: "GUIA GERÊNCIA",
    url: "js/guia-gerencia-rb.html",
  },

  {
    label: "CLIENTES CORP",
    url: "https://docs.google.com/spreadsheets/d/1sXOn-y6UQ6Cdjjz168HxnKWZHU7A3jMEMxElU9YxGAc/edit?gid=1093840528#gid=1093840528",
  },

  {
    label: "Plantão",
    url: "https://docs.google.com/spreadsheets/d/1bYWbrM1x1eMJjCK22ty05zyFBj7j5hg4/edit?pli=1&gid=1040812121#gid=1040812121",
  },
];

// Respostas rápidas de chat.
var QUICK_REPLIES = [
  {
    id: "bomDia",
    label: "Bom dia",
    value: "Bom dia! Em que posso ajudar?",
  },

  {
    id: "boaTarde",
    label: "Boa tarde",
    value: "Boa tarde! Em que posso ajudar?",
  },

  {
    id: "boaNoite",
    label: "Boa noite",
    value: "Boa noite! Em que posso ajudar?",
  },

  {
    id: "algoMais",
    label: "Algo mais?",
    value: "Algo mais em que eu possa ajudar?",
  },

  {
    id: "obrigado",
    label: "Obrigado!",
    value: "Obrigado por escolher a Você Telecom!",
  },
];

// Testes de latência.
var LATENCY_TESTS = [
  {
    id: "teste1",
    label: "Latência 1 (BEL)",
    value: "ping bel.ptt.br -t",
  },

  {
    id: "teste2",
    label: "Latência 2 (SP)",
    value: "ping sp.ptt.br -t",
  },
];

// Modelo de abertura de O.S.
var SERVICE_ORDER_TEMPLATE = {
  id: "os",
  label: "Script O.S.",
  value:
    "DESCONEXÃO DA O.N.U. — CHECAR O CABEAMENTO E VERIFICAR AS CONDIÇÕES DE USO DOS EQUIPAMENTOS DA VOCÊ TELECOM.\n\n" +
    "CTO:\n" +
    "PORTA:\n" +
    "OBSERVAÇÕES:",
};

// Informações do operador.
var ATTENDANCE_META = {
  operador: "AGUINALDO NETO",
  cargo: "ASSISTENTE NOC CORE JR. (CORPORATIVO)",
};

// Cabeçalho utilizado nos modelos de atendimento.
function attendanceHeader() {
  return (
    "OPERADOR: " +
    ATTENDANCE_META.operador +
    "\n" +
    "CARGO: " +
    ATTENDANCE_META.cargo +
    "\n\n"
  );
}

// Assinatura utilizada nos informativos.
function attendanceSignature() {
  return (
    "Atenciosamente,\n\n" +
    ATTENDANCE_META.operador +
    "\n" +
    "Assistente NOC/CORE\n" +
    "Você Telecom."
  );
}

// Modelos de registro de atendimento.
var ATTENDANCE_TEMPLATES = [
  {
    id: "att1",
    label: "Campo 1 — Lentidão",
    value:
      attendanceHeader() +
      "RELATO DO CLIENTE:\n" +
      "- INFORMOU LENTIDÃO DE ACESSO\n\n" +
      "ANÁLISE E PROCEDIMENTOS:\n" +
      "- MAC APAGADO\n" +
      "- GERÊNCIA DO EQUIPAMENTO\n" +
      "- TEMPERATURA: OK\n" +
      "- SINAL DE FIBRA: OK\n" +
      "- REINICIALIZAÇÃO REMOTA\n" +
      "- TESTE DE LATÊNCIA NO DNS GOOGLE: SEM PERDAS\n\n" +
      "TESTES SOLICITADOS AO CLIENTE:",
  },

  {
    id: "att2",
    label: "Campo 2 — Desconexão",
    value:
      attendanceHeader() +
      "RELATO DO CLIENTE:\n" +
      "- DESCONEXÃO\n\n" +
      "ANÁLISE E PROCEDIMENTOS:\n" +
      "- PPPoE DESCONECTADO\n" +
      "- ONU INATIVA\n" +
      "- CTO COM OUTROS CLIENTES ATIVOS E CONECTADOS\n" +
      "- NECESSÁRIA ABERTURA DE CHAMADO\n\n" +
      "HORÁRIO INFORMADO AO CLIENTE:\n" +
      "CONTATO DO ATENDIMENTO:",
  },

  {
    id: "att3",
    label: "Campo 3 — Genérico",
    value:
      attendanceHeader() +
      "SOLICITAÇÃO DO CLIENTE:\n" +
      "- \n\n" +
      "ANÁLISE E PROCEDIMENTOS:\n" +
      "- \n\n" +
      "RESULTADO DO ATENDIMENTO:\n" +
      "- ",
  },

  {
    id: "att4",
    label: "Zabbix — Alteração de IP",
    value:
      "TÍTULO: ALTERAÇÃO DE IP DE MONITORAMENTO DE HOST NO ZABBIX- ([CÓDIGO]) - [PLANO] - [CLIENTE] - [ENDEREÇO]\n\n" +
      "INFORMAÇÃO:\n" +
      "Solicito a alteração do IP de monitoramento do host no Zabbix, conforme as evidências anexadas.\n\n" +

      "CÓDIGO:\n" +
      "CNPJ:\n" +
      "PLANO:\n" +
      "EQUIPAMENTO:\n\n" +
      "IP ANTIGO DE MONITORAMENTO:\n" +
      "IP NOVO/ATUAL:\n" +
      "SENHA:\n\n" +
      "EVIDÊNCIAS ANEXADAS",
  },

  {
    id: "att7",
    label: "Zabbix — Inclusão de Host",
    value:
      "TÍTULO: INCLUSÃO DE HOST NO ZABBIX PARA MONITORAMENTO - [CLIENTE]\n\n" +

      "SOLICITO A INCLUSÃO DO IP DE MONITORAMENTO DO HOST DO PLANO DO CLIENTE [CLIENTE] NO ZABBIX.\n\n" +

      "CLIENTE CORPORATIVO: [CLIENTE]\n" +
      "CÓDIGO:\n" +
      "CNPJ:\n\n" +
      "PLANO:\n\n" +
      "DADOS DE ACESSO:\n\n" +
      "PPPOE:\n" +
      "IP DE GERÊNCIA:\n" +
      "SENHA:\n" +
      "EQUIPAMENTO:\n" +
      "SERIAL:",
  },

  {
    id: "att8",
    label: "Zabbix — Remoção de Host",
    value:
      "TÍTULO: SOLICITAÇÃO DE REMOÇÃO DE HOST DO MONITORAMENTO VIA ZABBIX - ([CÓDIGO]) - [PLANO] - [CLIENTE] - [ENDEREÇO]\n\n" +
      "INFORMAÇÃO:\n\n" +
      "SOLICITO A REMOÇÃO DO HOST DO MONITORAMENTO VIA ZABBIX, TENDO EM VISTA QUE O CLIENTE NÃO FAZ MAIS PARTE DO ESCOPO DO CORPORATIVO.\n\n" +
      "DADOS DO CLIENTE:\n\n" +
      "CLIENTE:\n" +
      "CÓDIGO:\n" +
      "CNPJ:\n" +
      "PLANO:\n" +
      "ENDEREÇO:\n\n" +
      "DADOS DO HOST:\n\n" +
      "IP DE MONITORAMENTO:\n" +
      "EQUIPAMENTO:\n" +
      "SERIAL:\n\n" +
      "MOTIVO DA REMOÇÃO:\n" +
      "- CLIENTE NÃO FAZ MAIS PARTE DO ESCOPO DO CORPORATIVO.\n\n" +
      "EVIDÊNCIAS ANEXADAS: SIM",
  },

  {
    id: "att5",
    label: "Manutenção — Cliente específico",
    value:
      "🚨 INFORMATIVO DE MANUTENÇÃO PROGRAMADA 🚨\n\n" +
      "Prezados, boa noite.\n\n" +
      "Informamos que, no dia [DATA], a partir das [HORÁRIO], será realizada uma manutenção corretiva em um trecho da infraestrutura que atende o ponto [NOME DO PONTO].\n\n" +
      "A intervenção será necessária para [INFORMAR O MOTIVO DA MANUTENÇÃO], prevenindo possíveis rompimentos ou degradações de sinal.\n\n" +
      "Durante a atividade, poderá ocorrer indisponibilidade temporária no serviço do ponto informado.\n\n" +
      "Previsão de duração da atividade: [DURAÇÃO].\n\n" +
      "Agradecemos a compreensão.\n\n" +
      attendanceSignature(),
  },

  {
    id: "att6",
    label: "Manutenção — Vários clientes",
    value:
      "🚨 INFORMATIVO DE MANUTENÇÃO PROGRAMADA 🚨\n\n" +
      "Prezados,\n\n" +
      "Informamos que será realizada uma manutenção corretiva programada na região onde se encontram pontos ativos atendidos pela Você Telecom.\n\n" +
      "Durante a execução da atividade, poderá ocorrer indisponibilidade temporária do serviço, bem como desconexões pontuais nos planos localizados nos seguintes bairros ou regiões:\n\n" +
      "- [BAIRRO/REGIÃO 1]\n" +
      "- [BAIRRO/REGIÃO 2]\n" +
      "- [BAIRRO/REGIÃO 3]\n\n" +
      "DATA E HORÁRIO DA MANUTENÇÃO:\n" +
      "[DATA], com início às [HORÁRIO].\n\n" +
      "PREVISÃO DE DURAÇÃO:\n" +
      "[DURAÇÃO].\n\n" +
      "A intervenção é necessária para garantir a estabilidade, a melhoria contínua e a qualidade dos serviços prestados.\n\n" +
      "A Você Telecom agradece a compreensão.\n\n" +
      "Em caso de dúvidas, permanecemos à disposição por meio dos canais abaixo:\n\n" +
      "WHATSAPP:\n" +
      "0800 280 3223 | 0800 701 2005 | 3333-3333\n\n" +
      "SAC:\n" +
      "0800 701 2005 | 0800 280 3223 | (96) 3312-5400\n\n" +
      "E-MAIL:\n" +
      "corporativo@vocetelecom.vc\n\n" +
      attendanceSignature(),
  },
];

// Modelo de abertura de O.S. pelo WhatsApp.
var WHATSAPP_TEMPLATE = {
  id: "osZap",
  label: "Script WhatsApp",
  value:
    "⚠️ ATENÇÃO! CLIENTE CORPORATIVO\n\n" +
    "*ABERTURA DE O.S.*\n\n" +
    "PROTOCOLO:\n" +
    "CLIENTE:\n" +
    "PLANO:\n" +
    "MOTIVO:\n" +
    "DATA E HORÁRIO DA ABERTURA:\n" +
    "ENDEREÇO:\n" +
    "BAIRRO:\n" +
    "CIDADE:\n" +
    "EQUIPAMENTO:\n" +
    "HORÁRIO DE DISPONIBILIDADE:\n" +
    "TELEFONE PARA CONTATO:\n" +
    "OBSERVAÇÕES:",
};