# Solvia Landing

Landing page da Solvia — plataforma de crédito pessoal para o mercado brasileiro. Explica o produto, mostra os valores disponíveis e direciona o usuário ao WhatsApp para iniciar o processo (sem formulários).

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 8](https://vitejs.dev)
- [React Router](https://reactrouter.com) (`createBrowserRouter`, ver `src/router.tsx`)
- [Tailwind CSS 4](https://tailwindcss.com) (tokens em `src/styles/globals.css`)
- [Motion](https://motion.dev) para animações
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) como gate anti-bots do chat (ver `docs/proteccion-anti-bots.md`)
- [Oxlint](https://oxc.rs) como linter
- [pnpm](https://pnpm.io) como package manager

## Requisitos

- Node.js 20+
- pnpm

## Uso

```bash
pnpm install
pnpm dev        # servidor de desenvolvimento com HMR
pnpm build      # typecheck + build de produção
pnpm preview    # preview do build
pnpm lint       # oxlint
pnpm typecheck  # tsc --noEmit
```

## Estrutura

```
src/
├── components/
│   ├── layout/          # Navbar, Footer, Layout (contém o <Outlet /> com transição de rota)
│   ├── sections/         # Seções da landing (hero, benefícios, valores, passos, serviços, sobre, depoimentos, vídeos, contato, faq)
│   ├── motion/           # Wrappers de animação (reveal, counter, variants)
│   ├── ui/               # Componentes base (button, card, badge, heading, icon)
│   └── floating-chat-widget.tsx  # Widget flutuante de chat/WhatsApp global (protegido com Cloudflare Turnstile)
├── pages/                # HomePage e JobsPage (/careers)
├── router.tsx            # Rotas com createBrowserRouter ("/" e "/careers")
├── data/                 # Conteúdo em JSON por seção (copy, sem lógica)
├── lib/                  # Utilitários (ponte de chat, scroll até hash, etc.)
├── styles/globals.css    # Design tokens Tailwind v4 (brand/neutral)
└── types/content.types.ts
```

O fluxo de conversão é: o usuário vê o produto → passa pelo `SimulatorSection` (simulador de valores) → é direcionado ao WhatsApp. O `AmountSelectorSection` fica comentado em `home-page.tsx` até que o produto tenha condições reais definidas, e não há formulário de contato tradicional. A página `/careers` (`JobsPage`) mostra as vagas abertas da Solvia (dado estático em `src/data/jobs.json`), sem candidatura online.

A seção de Perguntas Frequentes (`FaqSection`, conteúdo em `src/data/faq.json`) fica no final da landing, antes do footer.

## Pendências

- `src/data/contact.json` → `social.instagram` e `social.facebook` já apontam para os handles reais da Solvia (`solvia_brasil` / `solviabrasil`); revisar antes de publicar caso mudem.
- `VITE_TURNSTILE_SITE_KEY` não está configurada (não existe `.env` nem `.env.example` no repositório). Sem essa env var o widget do Turnstile nunca é renderizado e o botão de WhatsApp do chat fica desabilitado em todos os ambientes (fail-closed, intencional). Ver `docs/proteccion-anti-bots.md` para o passo a passo de Cloudflare + Vercel.
- Ativar manualmente **Vercel Bot Protection / Attack Challenge Mode** no dashboard da Vercel (não é configuração de código).

## Documentação adicional

Ver `docs/`:

- `seo-implementacion.md` — metadados, sitemap, robots, JSON-LD
- `formulario-email-whatsapp.md` — decisão de substituir o formulário por WhatsApp
- `deteccion-pais-dialectos.md` — estratégia para adaptar o dialeto conforme o país do visitante
- `deploy-aws-godaddy.md` — passos de deploy (S3 + CloudFront + ACM + DNS na GoDaddy)
- `proteccion-anti-bots.md` — Cloudflare Turnstile + Vercel Bot Protection
