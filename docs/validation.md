# Validação da experiência

## Verificações realizadas

- `npm run check:assets`: oito PNGs presentes e válidos.
- Comparação binária com `baly.zip`: os oito arquivos são idênticos aos originais.
- `npm run build`: TypeScript estrito e Vite aprovados.
- `npm test`: nove testes Playwright passaram em Chromium.
- Navegação por todos os sabores, volta ao primeiro, anúncios acessíveis e seleção final.
- Cliques rápidos: último pedido vence, com apenas uma cena ativa ao repousar.
- Teclado: setas, Home/End, foco da âncora de exploração e botões com nomes acessíveis.
- Layouts de 320, 375, 768 e 1440 px: sem overflow horizontal ou sobreposição de texto e índice.
- Movimento reduzido: sem splash, animações de entrada ou ScrollSmoother.
- Gesto horizontal: teste de eventos e verificação adicional via emulação real de toque CDP.
- Build de produção: HTTP 200, imagens carregadas e nenhum erro JavaScript nas verificações.
- Inspeção visual de hero, sabores e conjunto final em desktop/mobile, com PNGs reais.

O painel de prévia do fluxo de configuração do ambiente não fornece uma prévia web do servidor local.
O erro informado nesse painel não foi reproduzido na aplicação pelo navegador de teste.
Não foi feita publicação externa.

## Medição de laboratório

Chromium, contexto novo, viewport 375 × 812, toque/mobile, CPU com desaceleração 4×,
download limitado a 4 Mbps e latência de 150 ms. Servidor local com build de produção.

| Medida | Resultado |
| --- | --- |
| Recursos iniciais transferidos | 1.796.336 bytes (~1,80 MB), sem incluir o documento HTML |
| LCP | 3.820 ms |
| CLS observado | 0 |
| Imagens solicitadas na abertura | Logo e lata Tradicional |
| Arte complementar entregue posteriormente | ~587 KiB WebP, em lugar de ~2,4 MiB PNG |

A meta inicial de carga de 2 MB foi atendida; a meta de LCP de 2,5 s não foi atingida neste cenário.
A imagem Tradicional de 1,62 MB é o recurso dominante. Os PNGs originais foram preservados conforme o briefing.
Isso não é medição de campo e não comprova INP ou 60 fps em todos os dispositivos. Safari/iOS real não foi testado.

## Revisão de direção de arte

Autoavaliação editorial (1–5), não certificação ou premiação externa:

| Dimensão | Nota | Evidência / limite |
| --- | --- | --- |
| Identidade e originalidade | 4 | Produtos reais, amarelo/preto e linguagem própria de splash |
| Tipografia e hierarquia | 4 | Display condensado, títulos monumentais e controles constantes |
| Qualidade dos assets | 4 | Embalagens intactas; frutas geradas e recortadas em CSS |
| Narrativa e movimento | 4 | Hero, manifesto, exploração voluntária e reencontro dos sete sabores |
| Interações | 4 | Setas, toque, índice, teclado e proteção contra cliques concorrentes |
| Responsividade | 4 | Composições verticais, índice de toque e conjunto final em duas fileiras |
| Acessibilidade | 4 | Movimento reduzido, nomes acessíveis, foco e anúncio do sabor; sem auditoria assistiva completa |
| Performance e manutenção | 3 | TypeScript modular, carga adiada e assets de apoio otimizados; LCP limitado pelo PNG original |
| Clareza do objetivo | 4 | Explorar sabores é a ação principal; conceito independente identificado |
