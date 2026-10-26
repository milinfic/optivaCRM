# Optiva CRM — Frontend

Aplicação web do Optiva CRM, construída com Angular e Angular Material. O frontend oferece telas para autenticação, dashboard, clientes, oportunidades, interações, relatórios e configurações.

## Requisitos

- Node.js compatível com Angular 20
- npm
- API do Optiva CRM disponível para autenticação e operações de dados

## Instalação e execução

Na pasta `front`, instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm ci
npm start
```

A aplicação fica disponível em `http://localhost:4200`. O servidor de desenvolvimento usa a configuração `development` do Angular CLI e recarrega a aplicação quando os arquivos são alterados.

Para executar a API e configurar o banco de dados, consulte o [README da raiz](../README.md).

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor Angular para desenvolvimento. |
| `npm run build` | Gera o build de produção em `dist/`. |
| `npm run watch` | Gera o build de desenvolvimento e observa alterações. |
| `npm test` | Executa os testes unitários com Karma e Jasmine. |
| `npm run ng -- <comando>` | Executa um comando do Angular CLI local. |

Exemplos:

```bash
npm run ng -- generate component components/example
npm run build -- --configuration development
```

## Configuração da API

A URL base da API é exportada por `src/environments/environment.ts`. Atualmente esse arquivo importa o valor de `environment.dev.ts`, que aponta para:

```text
http://localhost:3000
```

Para alterar o endereço usado localmente, edite `src/environments/environment.dev.ts`. Existe também `environment.prod.ts`, mas o `angular.json` ainda não configura substituição de arquivos (`fileReplacements`) para produção. Portanto, o build de produção continua usando a URL importada por `environment.ts` até essa configuração ser adicionada.

As chamadas HTTP usam cookies de sessão com `withCredentials`. A API precisa estar em execução e permitir requisições com credenciais a partir da origem do frontend. A autenticação e o CORS são configurados no backend.

## Rotas

As rotas são definidas em `src/app/app.routes.ts`. As telas abaixo do layout principal são protegidas pelo `authGuard`.

| Caminho | Tela |
| --- | --- |
| `/login` | Login |
| `/dashboard` | Dashboard |
| `/clients/list` | Lista de clientes |
| `/clients/new` | Cadastro de cliente |
| `/clients/:id` | Detalhes do cliente |
| `/clients/:id/edit` | Edição de cliente |
| `/opportunities/list` | Lista de oportunidades |
| `/opportunities/new` | Cadastro de oportunidade |
| `/opportunities/:id` | Detalhes da oportunidade |
| `/opportunities/:id/edit` | Edição de oportunidade |
| `/interactions` | Interações |
| `/reports` | Relatórios |
| `/settings` | Configurações |

Nas ações da lista de clientes, cadastro, edição e detalhes são abertos em diálogos em telas maiores; em telas de até 700 px, a navegação usa as rotas correspondentes. As rotas também podem ser acessadas diretamente.

## Organização do código

```text
src/
├── app/
│   ├── components/       Telas e componentes por funcionalidade
│   ├── constants/         Mensagens e constantes da aplicação
│   ├── guards/            Proteção de rotas
│   ├── interceptors/      Tratamento de requisições HTTP e sessão
│   ├── layouts/           Estrutura principal, barra superior e navegação
│   ├── services/          Integração HTTP por domínio
│   ├── shared/            Diretivas e utilitários compartilhados
│   ├── ux/                Componentes visuais reutilizáveis
│   ├── app.config.ts      Providers globais
│   └── app.routes.ts      Configuração de rotas
├── assets/                Imagens e ícones
├── environments/          Endpoints por ambiente
├── styles/                CSS global por área da interface
├── themes/                Temas CSS
└── main.ts                Inicialização da aplicação
```

Os componentes são standalone. As funcionalidades ficam em `components/` e as chamadas à API devem passar pelos serviços em `services/`. Componentes de interface compartilhados, como tabela, paginação, cabeçalhos e shell de modal, ficam em `ux/`.

## Autenticação e sessão

- O `authGuard` valida o perfil antes de permitir acesso às rotas protegidas.
- O `AuthInterceptor` trata erros de sessão, tenta renovar a sessão e redireciona para o login quando ela expira.
- As requisições incluem cookies do navegador; tokens não são armazenados no frontend.

## Interface e temas

Os estilos globais são carregados por `src/styles.css`. As folhas específicas de layout ficam em `src/styles/`, e os temas `dark`, `blue` e `white` ficam em `src/themes/`. O tema padrão é definido no `angular.json`; o `ThemeService` aplica a preferência selecionada durante a execução.

O shell compartilhado de modal está em `src/app/ux/modal/shell/modal.shell.ux.ts`. Use esse componente para manter cabeçalho, ícone, corpo e rodapé consistentes nos diálogos.

## Build e testes

```bash
npm run build
npm test
```

O build de produção é configurado no `angular.json`, incluindo limites de tamanho para o bundle inicial e para estilos de componentes. Os testes usam Jasmine e Karma, conforme a configuração Angular do projeto.
