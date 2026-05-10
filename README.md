# Lar Bola de Pelos 🐾

Site institucional do abrigo de gatos **Lar Bola de Pelos**, localizado em Jaboatão dos Guararapes – PE. Desenvolvido para facilitar adoções, apadrinhamentos e doações, conectando gatinhos que precisam de lar a famílias amorosas.

## Páginas

| Página | Descrição |
|---|---|
| `index.html` | Home com hero, stats, destaques e depoimentos |
| `adocao.html` | Catálogo de gatos disponíveis para adoção com filtros |
| `apadrinhamento.html` | Programa de apadrinhamento mensal |
| `doacao.html` | Formas de doação (itens, PIX, serviços) |
| `contato.html` | Formulário de contato (redireciona para WhatsApp) |
| `admin.html` | Painel administrativo para gerenciar os gatos |

## Tecnologias

- **HTML / CSS / JavaScript** — sem frameworks ou ferramentas de build
- **Supabase** — banco de dados (PostgreSQL), autenticação e armazenamento de fotos
- **Font Awesome 6** — ícones
- **i18n próprio** — suporte a Português e Inglês via `js/i18n.js`

## Estrutura do projeto

```
lar-bola-de-pelos/
├── index.html
├── adocao.html
├── apadrinhamento.html
├── doacao.html
├── contato.html
├── admin.html
├── supabase-setup.sql      # Script de configuração do banco
├── css/
│   └── style.css
├── js/
│   ├── supabase-config.js  # Credenciais do Supabase
│   ├── main.js             # Lógica principal
│   ├── admin.js            # Painel admin
│   └── i18n.js             # Sistema de tradução
└── images/
    └── ...
```

## Configuração do Supabase

### 1. Criar o projeto

Acesse [supabase.com](https://supabase.com), crie um novo projeto e anote a **URL** e a **Anon Key** (em *Settings → API*).

### 2. Criar as tabelas e políticas

No **SQL Editor** do Supabase, execute o arquivo `supabase-setup.sql`.

### 3. Criar o bucket de fotos

Em *Storage → New Bucket*, crie um bucket chamado `gatos` marcando a opção **Public bucket**.

### 4. Configurar as credenciais

Edite o arquivo `js/supabase-config.js` com os seus dados:

```js
const SUPABASE_URL      = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY';
```

### 5. Criar o usuário admin

Em *Authentication → Users → Add user*, crie o e-mail e senha que serão usados para acessar o painel em `admin.html`.

## Deploy

O site é 100% estático e pode ser publicado em qualquer plataforma:

- **GitHub Pages** — *Settings → Pages → Deploy from branch*
- **Netlify** — arraste a pasta do projeto ou conecte o repositório
- **Vercel** — importe o repositório e faça o deploy direto

Não é necessário nenhum servidor back-end.

## Funcionalidades

- Catálogo de gatos com filtros por sexo e idade, alimentado pelo Supabase
- Formulário de contato que envia mensagem formatada direto para o WhatsApp do abrigo
- Painel admin protegido por autenticação para cadastrar, editar e remover gatos
- Suporte a tema claro/escuro
- Layout responsivo para mobile
- Suporte a dois idiomas (PT-BR / EN)

## Contato do abrigo

- **Instagram:** [@larboladepelos](https://www.instagram.com/larboladepelos)
- **WhatsApp:** (81) 99920-4111
- **E-mail:** larboladepelos@gmail.com
