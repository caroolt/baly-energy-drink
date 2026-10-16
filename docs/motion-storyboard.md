# UNLEASH THE FLAVOR — storyboard implementado

## Direção aprovada e ajuste mais recente

Landing page conceitual para jovens adultos e avaliação em portfólio. Explorar os sete sabores é a ação principal.
Hero Tradicional → manifesto curto → slider imersivo → conjunto dos sete produtos → créditos.
O último pedido do usuário adapta o explorador a um slider com splash de cor inspirado em comerciais de bebidas.

## Transição do slider

1. Gatilho: botão anterior/próximo, escolha direta, seta do teclado, Home/End ou gesto horizontal.
2. 0–300 ms: composição anterior recua e desaparece; inicia-se o splash atrás do produto.
3. 40–860 ms: silhueta líquida irregular e gotas expandem-se, cobrindo todo o cenário com a nova cor.
4. 320–1.080 ms: produto entra na diagonal; arte e título entram em tempos distintos.
5. Repouso: uma única cena visível; nome, contador, estado dos controles e anúncio acessível sincronizados.
6. Cliques durante transições: última seleção entra em fila, sem cenas simultâneas persistentes.

Produtos só podem mudar de posição, escala, inclinação e opacidade. Nunca simular costas ou giro 360°.
A composição deve sobreviver sem movimento. A navegação vertical permanece livre.

## Universos

Tradicional: preto e amarelo / pressão e arcos de luz.
Tropical: amarelo solar / folhas e planos líquidos, sem presumir ingredientes.
Maçã Verde: verde ácido / cortes e diagonais.
Melancia: vermelho / sementes e arcos verdes.
Morango e Pêssego: pêssego e vermelho / campos que se encontram.
Coco e Açaí: branco perolado e violeta / ritmo de repouso.
Tadaly: azul elétrico e dourado / estrelas e faixas, sem alegações de ingredientes.

## Assets e validação

- Oito PNGs originais integrados e conferidos byte a byte com `baly.zip`.
- Arte fotográfica complementar gerada, convertida para WebP e aplicada em camadas; embalagens intactas.
- Recortes, escala, ícones e composição final revisados em desktop/mobile.
- Navegação, gestos, seleção direta, teclado, fila de transições e movimento reduzido verificados.
- Carga inicial medida em 1,80 MB; LCP 3,82 s e CLS 0 em simulação mobile a 4 Mbps/150 ms e CPU 4× mais lenta.
- A meta inicial de LCP 2,5 s não foi atingida nesse cenário restrito. A lata original de 1,62 MB domina o carregamento.
- Não há medição de Core Web Vitals de usuários reais nem garantia de 60 fps em todos os dispositivos.

Os testes agora incluem o carregamento dos produtos originais e das sete latas no encerramento.
O relatório detalhado está em `docs/validation.md`. Prêmios e avaliação externa não são alegados.
