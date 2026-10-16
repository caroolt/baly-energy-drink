# BALY — Unleash the Flavor

Experiência conceitual independente de portfólio, sem vínculo oficial com a BALY.
Vite, TypeScript, HTML, CSS, GSAP 3.15, ScrollTrigger e ScrollSmoother. Sem WebGL ou renderização 3D.

## Estado atual

Direção: **uma lata, uma cor por vez.** Hero com título em máscara e uma lata, manifesto fixado cujas palavras
acendem com o scroll, palco de sete sabores fixado em que a rolagem da página troca o sabor sozinha (com snap
e splash de cor), conjunto final e rodapé enxuto. Setas, teclado, marcadores e gesto horizontal rolam até o sabor
escolhido, então o scroll e os controles ficam sempre sincronizados.
ScrollSmoother funciona somente em desktop com ponteiro preciso; mobile usa rolagem nativa.
Com movimento reduzido não há pin, animação ou suavização: o palco vira um slider comum com setas.

O logo e os sete PNGs originais de `baly.zip` estão integrados, preservados byte a byte.
Somente logo e Tradicional são solicitados na abertura; os demais produtos carregam sob demanda.

Validação: build TypeScript/Vite, dez testes de navegador, oito assets originais verificados e
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
