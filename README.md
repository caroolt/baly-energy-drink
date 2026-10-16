# BALY — Unleash the Flavor

Experiência conceitual independente de portfólio, sem vínculo oficial com a BALY.
Vite, TypeScript, HTML, CSS, GSAP 3.15, ScrollTrigger e ScrollSmoother. Sem WebGL ou renderização 3D.

## Estado atual

A base funcional contém hero tipográfico, manifesto, slider de sete sabores com splash vetorial animado,
seleção direta, setas, gesto horizontal, teclado e composição final navegável.
O slider não avança automaticamente e não captura a rolagem vertical.
ScrollSmoother funciona somente em desktop com ponteiro preciso; mobile usa rolagem nativa.
A preferência de movimento reduzido desliga animações de entrada, parallax, splash e suavização.

O logo e os sete PNGs originais de `baly.zip` estão integrados, preservados byte a byte.
Frutas, folhas e um splash âmbar complementam as composições, usando uma folha fotográfica gerada
para este projeto. O SVG animado expande a cor do próximo sabor até cobrir o cenário.
Os produtos e a folha fotográfica são carregados conforme a exploração; somente logo e Tradicional
são solicitados na abertura.

Validação: build TypeScript/Vite, nove testes de navegador, oito assets originais verificados e
inspeção de composições desktop/mobile. Veja [docs/validation.md](docs/validation.md) para evidências e limites.

## Executar

Requer Node.js 22.12+ (ambiente validado com 24.19.0) e npm.

```sh
npm ci
npm run dev
```

Em ambientes com cache padrão do npm sem permissão de escrita:

```sh
npm ci --cache /tmp/baly-npm-cache
```

## Validar

```sh
npm run build
npm test
npm run check:assets
```

O build inclui verificação TypeScript. Os testes Playwright usam Chromium em `/usr/bin/chromium`;
defina `CHROMIUM_PATH` se estiver em outro local. Os testes verificam os sete sabores, retorno ao início,
fila de cliques rápidos, teclado, layouts de 320/375/768/1440 px, retorno da composição final,
movimento reduzido e eventos de gesto horizontal. São testes funcionais, não uma aprovação estética.
`check:assets` verifica os oito PNGs. Para conferir que permanecem idênticos ao ZIP fornecido:

```sh
sha256sum -c docs/original-assets.sha256
```

A prévia integrada do fluxo de configuração do ambiente não expõe este servidor local.
O site foi verificado diretamente em Chromium e por HTTP. Para executar fora desse painel,
use os comandos de desenvolvimento acima ou sirva `dist/` em uma hospedagem estática após o build.

## Organização

- `src/flavors.ts`: nomes, cores, textos e inclinações por sabor.
- `src/slider.ts`: máquina de transição, splash, preload limitado e navegação acessível.
- `src/art.ts`: grafismos vetoriais originais e silhueta do splash.
- `src/main.ts`: montagem das cenas, navegação por âncoras e animações de rolagem.
- `src/style.css`: direção tipográfica, composição e layouts responsivos.
- `docs/motion-storyboard.md`: ritmo, narrativa e pendências visuais.

Os rótulos e proporções dos produtos devem ser preservados. `docs/source-assets/` contém a origem
da arte complementar; o navegador utiliza sua versão WebP para reduzir a transferência.
O build gera `dist/`, pronto para hospedagem estática. A publicação em hospedagem ainda não foi realizada.
