# Lucas Babetto Atelier — Website

**Lucas Babetto Atelier** é o site oficial do atelier de moda feminina de Lucas Babetto, estilista e designer de moda sediado em Maringá, Paraná. O site foi desenvolvido com o mais alto padrão de qualidade, com estética Squarespace/haute couture, usando HTML, CSS e JavaScript puros.

---

## ✅ Funcionalidades Implementadas

### 🎬 Splash Screen (Pré-entrada)
- Tela de entrada elegante com fundo preto, partículas douradas animadas
- "Lucas Babetto Atelier" em tipografia Playfair Display
- Tagline: "Peças exclusivas para momentos especiais ✨"
- **Música ambiente** gerada via Web Audio API (melodia pentatônica suave) — toca ao clicar na tela
- Transição automática após 4 segundos com fade elegante para o site principal

### 🎥 Hero com Slideshow Cinemático
- Slideshow de imagens reais do atelier (5 fotos do Instagram)
- Efeito **Ken Burns** (zoom/pan suave) em cada imagem
- Crossfade automático a cada 5,5 segundos
- Overlay escuro gradiente para leitura do texto
- **Não-interativo** (usuário não pode pausar/controlar)
- Texto sobreposto: Lucas Babetto / ATELIER / tagline / botões CTA

### 🧭 Navegação
- Navbar fixa com efeito glassmorphism ao scroll
- Links: Início | Sobre | Coleção | Serviços | Agendamento | Contato
- Hamburger menu responsivo para mobile
- Link ativo destacado conforme seção visível

### 📖 Sobre o Atelier
- Texto completo sobre o trabalho do Lucas Babetto
- Imagem real do Instagram
- Stats: +300 peças criadas, 100% exclusivo, Maringá
- Tags de features: atendimento marcado, online/presencial, somente venda, sob medida

### 🖼️ Coleção / Portfólio
**3 Fotos reais do Instagram com cards interativos:**
1. Vestido Verde Esmeralda — formatura medicina
2. Elegância Sob Medida — vestido 2 em 1 renda bordada
3. Arte Bordada à Mão — cristais e strass

**3 Vídeos do Instagram (pausáveis):**
1. `https://www.instagram.com/p/Cs8-guzgEfl/` — Assimetria e elegância
2. `https://www.instagram.com/p/C2x72ffPRAu/` — Coleção "Florecer"
3. `https://www.instagram.com/p/C3lqFsHAV6t/` — Peça exclusiva

### 💼 Serviços (6 cards)
- Vestidos Sob Medida
- Bordado Artesanal
- Vestidos de Formatura
- Vestidos de Noiva
- Vestidos de Debutante
- Ocasiões Especiais

### 📅 Agendamento
- Formulário com: Nome, E-mail, Telefone/WhatsApp, Mensagem
- Integração com **Web3Forms** (envio para atelier.lucasbabetto@gmail.com)
- Mensagem de sucesso após envio
- Info de contato completa ao lado do formulário

### 📞 Contato
- Endereço, telefone, email, horário
- Links para Instagram e WhatsApp
- Google Maps embed
- Cards elegantes com ícones

### 🟢 WhatsApp Flutuante
- Botão pulsante no canto inferior direito
- Link direto: `https://api.whatsapp.com/message/UZQ2XM2FZ7H5E1?...`
- Tooltip "Fale conosco" ao hover

### 🔻 Footer
- Logo + tagline + redes sociais
- Navegação completa + serviços + contato
- Copyright: "© 2026 Lucas Babetto Atelier. Todos os direitos reservados."
- Nota de direitos intelectuais

---

## 📁 Estrutura de Arquivos

```
index.html           — Página principal (single-page)
css/
  style.css          — Estilos completos (luxury design)
  audio-note.css     — Nota sobre o sistema de áudio
js/
  main.js            — JavaScript principal
README.md            — Documentação
```

---

## 🎨 Design

| Elemento       | Valor                                |
|----------------|--------------------------------------|
| Cor Principal  | `#0a0a0a` (preto)                   |
| Cor Gold       | `#C5A55A` (champagne dourado)       |
| Cor Creme      | `#f8f4ef` (creme elegante)          |
| Fonte Títulos  | Playfair Display (Google Fonts)     |
| Fonte Elegante | Cormorant Garamond                  |
| Fonte Corpo    | Montserrat                          |
| Ícones         | Font Awesome 6.5                    |
| Animações      | AOS (scroll-triggered)              |

---

## 📬 Dados de Contato (do site)

| Campo     | Valor                                     |
|-----------|-------------------------------------------|
| Email     | Atelier.lucasbabetto@gmail.com           |
| Telefone  | +55 44 99900-3789                        |
| WhatsApp  | https://api.whatsapp.com/message/UZQ2XM2FZ7H5E1?autoload=1&app_absent=0&utm_source=ig |
| Instagram | https://www.instagram.com/lucas.babetto/reels/ |
| Endereço  | R. Chicago, 16 - Jardim Los Angeles, Maringá - PR, 87080-420 |
| Horário   | Segunda a Sexta                          |

---

## ⚙️ Configuração do Formulário de Agendamento

Para ativar o envio de emails real, configure o **Web3Forms**:

1. Acesse https://web3forms.com e crie uma conta gratuita
2. Gere um Access Key para o email `atelier.lucasbabetto@gmail.com`
3. No arquivo `js/main.js`, substitua o valor `access_key` na função `sendViaWeb3Forms`

Alternativamente, configure **EmailJS**:
1. Acesse https://www.emailjs.com
2. Crie um Service e dois Templates (um para o atelier, um de confirmação para o cliente)
3. Substitua `'YOUR_EMAILJS_PUBLIC_KEY'`, `'service_id'`, `'template_atelier'`, `'template_client'`

---

## 🚀 Deploy

Para publicar o site, use a aba **Publish** do painel. O site é 100% estático — não requer servidor backend.

---

## 🔧 Próximos Passos Recomendados

1. **Configurar Web3Forms** com access key real para ativar envio de emails
2. **Adicionar favicon** com o logo do atelier
3. **SEO avançado** — Open Graph tags, schema.org markup para local business
4. **Vídeos reais** — quando disponíveis em formato MP4, substituir o slideshow por video background real
5. **Galeria expandida** — adicionar lightbox para visualização em tela cheia das fotos
6. **Depoimentos reais** — substituir os depoimentos placeholder por comentários reais de clientes
7. **Analytics** — adicionar Google Analytics / Meta Pixel

---

*Site desenvolvido com padrão Squarespace — HTML5, CSS3, JavaScript Vanilla*
