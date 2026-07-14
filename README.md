# Script de Atendimento (vanilla JS)

Sem build, sem npm, sem servidor. Dê **dois cliques em `index.html`** e abre
no navegador. Tudo é HTML + CSS + JS puro.

## Estrutura

```
index.html                    # esqueleto da página + containers vazios
css/style.css                 # todo o visual (substitui style.css + style2.css)
js/config.js                  # ← EDITE AQUI: textos, links, modelos
js/credentials.js             # ← EDITE AQUI: logins e senhas (não versionado)
js/credentials.example.js     # modelo sem segredos, seguro para compartilhar
js/clipboard.js               # 1 função genérica de copiar (substitui as ~15 antigas)
js/clock.js                   # relógio (substitui horas.js)
js/render.js                  # monta a página a partir dos dados de config
```

Os scripts são carregados como `<script>` normal (sem `type="module"`) de
propósito: módulos ES são bloqueados por CORS quando o arquivo é aberto
direto com `file://`, então funcionariam no `npm run dev` mas dariam tela
branca ao abrir por duplo clique. Por isso tudo aqui usa `var`/funções
globais simples em vez de `import`/`export`.

## Onde customizar

| Quero mudar...                     | Arquivo                     |
|-------------------------------------|------------------------------|
| Respostas rápidas de chat           | `js/config.js` → `QUICK_REPLIES` |
| Modelos de atendimento (campos 1-3) | `js/config.js` → `ATTENDANCE_TEMPLATES` |
| Modelo de O.S. / WhatsApp           | `js/config.js`               |
| Links de sistemas (CRM, GLPI...)    | `js/config.js` → `EXTERNAL_LINKS` |
| Logins e senhas                     | `js/credentials.js`          |
| Cores, fontes, espaçamento          | `css/style.css`              |

Adicionar um novo botão de resposta rápida, por exemplo, é só acrescentar um
item no array — nenhum HTML ou função nova é necessário:

```js
var QUICK_REPLIES = [
  // ...existentes
  { id: "aguarde", label: "Aguarde", value: "Um momento, por favor." },
];
```

## Sobre as credenciais (leia antes de usar com dados reais)

O `script_alfa.html` original tinha senhas reais em texto puro no HTML,
incluindo um comando de reset destrutivo (`rm -f` + `cfgcli -r all`)
copiável por qualquer pessoa com acesso à página — isso foi mantido
funcional para não quebrar o fluxo da equipe, mas **não é uma solução
definitiva**:

- Qualquer pessoa com acesso à pasta consegue abrir `js/credentials.js`
  num editor de texto e ler tudo.
- O botão de reset agora pede confirmação antes de copiar, mas isso só
  evita clique acidental — não é controle de acesso.

**Caminho recomendado para produção:** mover login/senha e a ação de reset
para um backend autenticado (com log de quem acessou o quê), e o front-end
chamar uma API em vez de copiar o comando bruto. Isso exigiria sair do
modelo "arquivo estático aberto por duplo clique" — se topar, me avise que
monto essa versão também.

Se for continuar assim mesmo:
1. Troque todas as senhas que já estavam no HTML original (foram expostas).
2. Se usar Git, confira `git status` antes de qualquer `git add` — o
   `.gitignore` já exclui `js/credentials.js`, mas vale checar.

## Bugs do original corrigidos

- IDs duplicados (`logGPON` repetido — o botão "Senha Datacom" na prática
  copiava o login GPON).
- `senhaRG()` definida duas vezes em `clipboard.js`.
- `<a>` dentro de `<button>` (HTML inválido).
- `</script>` órfão no fim do body.
- `verificarHorario()` que não fazia nada (alarme nunca implementado) —
  removida; a função `tick()` em `clock.js` é o lugar certo para
  reintroduzir isso se quiser.
- `app.js` vazio e `style2.css` órfão não foram trazidos — avise se tinham
  algo que deveria ter sido aproveitado.

## Compartilhando com a equipe

Como não tem build, dá pra zipar a pasta inteira e mandar por e-mail, ou
colocar num compartilhamento de rede — qualquer pessoa só precisa dar
duplo clique no `index.html`. Se quiser publicar num link (sem precisar
copiar arquivo), qualquer host estático simples serve (GitHub Pages,
Netlify, ou até uma pasta compartilhada num servidor interno).
