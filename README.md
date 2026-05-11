<div align="center">

# 🐱 Lar Bola de Pelos

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

**Site institucional do abrigo de gatos localizado em Jaboatão dos Guararapes – PE**  
*Conectando gatinhos que precisam de lar a famílias amorosas*

[🌐 Acessar Site](https://lar-bola-de-pelos.vercel.app/) • [📱 Instagram](https://www.instagram.com/larboladepelos) • [💬 WhatsApp](https://wa.me/5581999204111)

</div>

---

## 📋 Sobre o Projeto

O **Lar Bola de Pelos** é um site institucional desenvolvido para facilitar **adoções**, **apadrinhamentos** e **doações** para o abrigo de gatos. O projeto foi construído com foco em:

- ✨ Interface intuitiva e acolhedora
- 🎯 Facilidade para encontrar gatos disponíveis
- 🌍 Suporte multilíngue (Português/Inglês)
- 📱 Layout totalmente responsivo
- 🎨 Tema claro/escuro

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| 🐱 **Catálogo de Gatos** | Lista de gatos disponíveis com filtros por sexo e idade |
| 💝 **Apadrinhamento** | Programa de contribuição mensal para ajudar os gatinhos |
| 💰 **Doações** | Múltiplas formas de doar (itens, PIX, serviços) |
| 📞 **Contato** | Formulário que redireciona para o WhatsApp |
| 🔐 **Painel Admin** | Área protegida para gerenciar os gatos (CRUD completo) |
| 🌙 **Tema Escuro/Claro** | Alternância de tema para melhor experiência |
| 🌐 **Dois Idiomas** | Suporte a Português e Inglês via i18n próprio |

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com variáveis CSS
- **JavaScript** - Interatividade e lógica do cliente
- **Font Awesome 6** - Ícones vetoriais

### Backend & Database
- **Supabase** - Plataforma backend com:
  - PostgreSQL como banco de dados
  - Autenticação de usuários
  - Storage para fotos dos gatos
  - Políticas de segurança (RLS)

### Recursos Adicionais
- **i18n próprio** - Sistema de tradução caseiro
- **LocalStorage** - Persistência de tema e idioma

---

## 📁 Estrutura do Projeto

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


---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Editor de código (recomendado: VS Code)
- Conta gratuita no [Supabase](https://supabase.com)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Leticinha007/lar-bola-de-pelos.git

# 2. Acesse a pasta do projeto
cd lar-bola-de-pelos

# 3. Abra com um servidor local
# Opção A: Live Server no VS Code
# Opção B: Python
python -m http.server 8000

# Opção C: Node.js
npx serve
```

---

## 🗄️ Configuração do Supabase

### 1. Criar projeto no Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto (gratuito)
- Anote a **URL** e **Anon Key** (em *Settings → API*)

### 2. Configurar banco de dados
No **SQL Editor** do Supabase, execute o arquivo `supabase-setup.sql`:
 
```sql
-- Criar tabela de gatos
CREATE TABLE gatos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade VARCHAR(50) NOT NULL,
    sexo VARCHAR(20) NOT NULL,
    historia TEXT,
    imagem_url TEXT,
    disponivel BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE gatos ENABLE ROW LEVEL SECURITY;

-- Política: qualquer pessoa pode visualizar os gatos
CREATE POLICY "Gatos visíveis para todos" ON gatos
    FOR SELECT USING (true);

-- Política: apenas usuários autenticados (admin) podem inserir
CREATE POLICY "Admin pode inserir gatos" ON gatos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política: apenas usuários autenticados (admin) podem atualizar
CREATE POLICY "Admin pode atualizar gatos" ON gatos
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política: apenas usuários autenticados (admin) podem deletar
CREATE POLICY "Admin pode deletar gatos" ON gatos
    FOR DELETE USING (auth.role() = 'authenticated');

-- Criar bucket no storage (execute via interface ou SQL)
-- Opção via SQL (alternativa):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gatos', 'gatos', true);

-- Nota: O bucket 'gatos' precisa ser criado manualmente no Storage
-- ou execute o SQL acima para criar via código
```

### 3. Criar bucket de armazenamento  
- Vá em *Storage → New Bucket*
- Nome: `gatos`
- Marque: ✅ **Public bucket**

### 4. Configurar credenciais  
Edite o arquivo `js/supabase-config.js` com a URL e Anon Key

### 5. Criar usuário administrador
- Vá em *Authentication → Users*
- Clique em *Add user*
- E-mail: `admin@larboladepelos.com`
- Senha: (escolha uma segura)
- ✅ Confirm e-mail automaticamente

---

## 🌐 Deploy

O site é **100% estático** e pode ser hospedado gratuitamente em:

### Opção 1: GitHub Pages
```bash
# Push para o GitHub
git push origin main

# Ative em: Settings → Pages → Deploy from branch (main)

```

### Opção 2: Netlify (recomendado)
- Arraste a pasta do projeto para [app.netlify.com](https://app.netlify.com/drop)
- Ou conecte seu repositório GitHub
- Build command: (deixe em branco)
- Publish directory: `./`

### Opção 3: Vercel
```bash
npm i -g vercel
vercel
```

**Vantagens:**
- ✅ HTTPS automático
- ✅ Deploy contínuo
- ✅ Domínio personalizado
- ✅ Totalmente gratuito

⚠️ **Importante:** O Supabase já fornece backend, então **não é necessário** servidor próprio!

---

## 🤝 Como Contribuir

Contribuições são **super bem-vindas**! 🎉

1. Faça um fork do projeto
2. Clone seu fork: `git clone https://github.com/Leticinha007/lar-bola-de-pelos.git`
3. Crie uma branch: `git checkout -b minha-feature`
4. Commit suas mudanças: `git commit -m 'Adiciona feature'`
5. Push: `git push origin minha-feature`
6. Abra um Pull Request

---

### Sugestões de melhoria
- 🐛 Reportar bugs via [Issues](https://github.com/Leticinha007/lar-bola-de-pelos/issues)
- 💡 Sugerir novas features
- 📝 Melhorar documentação
- 🎨 Contribuir com design
- 🌍 Ajudar com novas traduções

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- 🐾 **Todos os gatinhos** que inspiram este projeto
- 🚀 [Supabase](https://supabase.com) - Backend incrível e gratuito
- 🎨 [Font Awesome](https://fontawesome.com) - Ícones maravilhosos
- 📸 Fotos dos gatinhos (adicionar créditos)
- 💙 **Apoiadores e voluntários** do abrigo

---

## 📞 Contato do Abrigo

<div align="center">

| | | |
|:---:|:---:|:---:|
| 📱 **WhatsApp** | 📷 **Instagram** | ✉️ **E-mail** |
| [(81) 99920-4111](https://wa.me/5581999204111) | [@larboladepelos](https://www.instagram.com/larboladepelos) | [larboladepelos@gmail.com](mailto:larboladepelos@gmail.com) |

**Endereço:** Jaboatão dos Guararapes – PE, Brasil

</div>

---

<div align="center">
  
**Feito com ❤️ para os gatinhos do Lar Bola de Pelos**

⭐ Não esqueça de deixar uma estrela no repositório! ⭐

</div>
