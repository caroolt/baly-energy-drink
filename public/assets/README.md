# Assets originais

Os oito PNGs foram recebidos no arquivo `baly.zip` e integrados sem qualquer alteração de conteúdo ou bytes.
Não substituir as latas por recriações. Caminhos:

- `brand/logo.png`
- `products/tradicional.png`
- `products/tropical.png`
- `products/maca-verde.png`
- `products/melancia.png`
- `products/morango-pessego.png`
- `products/coco-acai.png`
- `products/tadaly.png`

Executar `npm run check:assets` para verificar a presença. Os hashes estão em `docs/original-assets.sha256`.
Preservar transparência, proporções e rótulos.
As dimensões nos elementos de imagem só reservam espaço; `object-fit: contain` preserva a proporção original.
`art/flavor-ingredients.webp` contém a arte fotográfica complementar gerada para o projeto: maçã verde,
melancia, morango, pêssego, coco, açaí, folha e splash âmbar, em uma grade de quatro colunas e duas linhas.
O original está em `docs/source-assets/flavor-ingredients.png`. A conversão WebP preserva dimensões e alpha.
Os recortes são feitos no CSS, sem gerar embalagens novas ou modificar os produtos.
Tropical usa folhas e Tadaly usa grafismos abstratos, sem presumir seus ingredientes.
