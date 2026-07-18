# Script de Atendimento (Vanilla JS)

Painel interativo e moderno para operadores de suporte, desenvolvido em HTML, CSS e JavaScript puros (sem frameworks, build ou dependências). 

Basta **dar dois cliques em `index.html`** para abrir no seu navegador. Tudo roda localmente (`file://`), preservando a compatibilidade sem servidor.

---

## 🛠️ Novidades e Melhorias Premium (UI/UX)

O painel foi completamente reformulado com foco em produtividade, segurança visual e design premium:
1. **Design Glassmorphism Cyber-Dark:** Estilo visual moderno com efeito de vidro fosco (`backdrop-filter: blur`), gradientes azuis/roxos profundos, luzes neon e micro-animações.
2. **Setup de Senhas na Inicialização (Modal):** Ao abrir a página, um modal centralizado pergunta as senhas da sessão (AMS, GPON, Mikrotik 1, Mikrotik 2) para carregar no painel. Os dados são persistidos de forma segura no navegador (`localStorage`) para evitar digitação repetida nas próximas vezes.
3. **Controle de Senhas (Show/Hide):** Credenciais confidenciais são mascaradas por padrão (`••••••••`). O operador pode usar o ícone de "olho" para revelá-las. Clicar no botão copia o valor real diretamente para a área de transferência.
4. **Notificações Flutuantes (Toasts):** Um balão animado no canto da tela confirma exatamente qual informação foi copiada com sucesso, incluindo uma barra de progresso de autoclose.
5. **Barra de Pesquisa Dinâmica:** Permite filtrar instantaneamente respostas rápidas, credenciais, comandos e cards de relatórios à medida que você digita. Seções sem correspondência são ocultadas automaticamente.
6. **Persistência do Operador:** Configurações de Operador e Cargo podem ser editadas diretamente na tela e salvas em persistência local, atualizando automaticamente os cabeçalhos de todos os relatórios em tempo real.

---

## 📂 Estrutura de Arquivos

```
index.html                    # Esqueleto da página + modais + container de toasts
css/style.css                 # Estilos visuais, efeitos glassmorphism e animações
js/config.js                  # ← EDITE AQUI: Textos, links externos e modelos
js/credentials.js             # ← EDITE AQUI: Logins padrão e IPs (não versionado)
js/credentials.example.js     # Modelo seguro de credenciais para versionamento no Git
js/clipboard.js               # Lógica genérica de cópia segura para a área de transferência
js/clock.js                   # Relógio digital com atualização de segundos em tempo real
js/render.js                  # Renderização dos componentes, barra de busca, modal de senhas e toasts
```

---

## ⚙️ Onde Customizar

| Quero mudar...                     | Arquivo e Variável |
|-------------------------------------|--------------------|
| Respostas rápidas de chat           | `js/config.js` → `QUICK_REPLIES` |
| Link de sistemas (CRM, GLPI...)    | `js/config.js` → `EXTERNAL_LINKS` |
| Modelos de atendimento (Lentidão...) | `js/config.js` → `ATTENDANCE_TEMPLATES` |
| Modelo de O.S.                      | `js/config.js` → `SERVICE_ORDER_TEMPLATE` |
| Modelo do WhatsApp                  | `js/config.js` → `WHATSAPP_TEMPLATE` |
| Logins e IPs padrão                 | `js/credentials.js` → `CREDENTIALS` |

---

## 🔒 Segurança das Credenciais

O projeto mantém a facilidade de rodar localmente sem banco de dados, mas adiciona as seguintes proteções:
* **Mascaramento Visual:** Senhas não ficam expostas na tela à vista de terceiros.
* **Ignorado no Git:** O arquivo `js/credentials.js` está no `.gitignore` para evitar envio acidental de senhas reais ao GitHub. Quem clonar o repositório deve copiar o `credentials.example.js` e renomeá-lo para `credentials.js`.
* **Remoção de Comando Destrutivo:** O antigo comando "Reset Geral" que executava exclusão de diretórios no roteador foi totalmente removido por segurança.

---

## 🌐 Publicação e Compartilhamento

Como o projeto é composto apenas de arquivos estáticos, você pode compartilhar com a equipe de duas formas:
1. **Offline:** Compactar a pasta em um arquivo `.zip` e distribuir. Qualquer pessoa só precisa descompactar e dar dois cliques no `index.html`.
2. **Online:** Hospedar a pasta em um servidor web interno ou em serviços como GitHub Pages, Netlify ou Vercel.
