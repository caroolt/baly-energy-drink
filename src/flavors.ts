export type Flavor = {
  id: string;
  name: string;
  display: string;
  headline: string;
  color: string;
  ink: string;
  accent: string;
  tilt: number;
  description: string;
  sizes: string[];
  zero: boolean;
  caffeine: string;
  taurine: string;
  per: string;
};

export const flavors: Flavor[] = [
  { id: 'tradicional', name: 'Tradicional', display: 'ORIGINAL.', headline: 'Tudo começa\ncom intensidade.', color: '#191919', ink: '#fbbe00', accent: '#ffdd69', tilt: -13, description: 'Com uma combinação de Taurina, Cafeína e Vitaminas do Complexo B, o Baly Tradicional é o sabor que conquistou o Brasil, não importa o rolê, a gente tá junto sempre. Baly é o melhor do rolê!', sizes: ['250ml', '473ml', '2L'], zero: true, caffeine: '60mg', taurine: '765mg', per: '250ml' },
  { id: 'tropical', name: 'Tropical', display: 'TROPICAL.', headline: 'Mude\no clima.', color: '#ffb900', ink: '#29230b', accent: '#ff6b19', tilt: 11, description: 'Baly Tropical, a mistura de sabores que traz o gostinho brasileiro em um mix de frutas amarelas. Combinando os sabores das frutas tropicais, esse sabor é como o verão o ano todo.', sizes: ['250ml', '473ml', '2L'], zero: true, caffeine: '64mg', taurine: '800mg', per: '200ml' },
  { id: 'maca-verde', name: 'Maçã Verde', display: 'VERDE.', headline: 'Quebre\na mesmice.', color: '#b6e62c', ink: '#173a1d', accent: '#2b9537', tilt: -10, description: 'Preferido de muitos, o Baly Maçã Verde é um sabor simples e autêntico perfeito para quem aprecia a leveza da maçã verde.', sizes: ['250ml', '473ml', '2L'], zero: true, caffeine: '64mg', taurine: '800mg', per: '200ml' },
  { id: 'melancia', name: 'Melancia', display: 'MELANCIA.', headline: 'Entre\nde cabeça.', color: '#f44958', ink: '#3f101d', accent: '#b6ed4d', tilt: 12, description: 'Baly Melancia já conquistou muitos consumidores por todo o Brasil, trazendo toda a refrescância da fruta.', sizes: ['250ml', '473ml', '2L'], zero: true, caffeine: '64mg', taurine: '800mg', per: '200ml' },
  { id: 'morango-pessego', name: 'Morango e Pêssego', display: 'DOSE DUPLA.', headline: 'Dois sabores.\nOutra dimensão.', color: '#ff9971', ink: '#611831', accent: '#f3294d', tilt: -12, description: 'Um sabor complexo que combina, sem misturar, os sabores das frutas, esse energético consegue trazer os sabores do morango contrastando com a suculência do pêssego, preservando cada fruta de uma forma única. Um produto sem igual e que conquista 10 a cada 10 amantes de energéticos.', sizes: ['250ml', '473ml', '2L'], zero: true, caffeine: '64mg', taurine: '800mg', per: '200ml' },
  { id: 'coco-acai', name: 'Coco e Açaí', display: 'OUTRO CLIMA.', headline: 'Mude de\natmosfera.', color: '#e6e7e5', ink: '#35334e', accent: '#9571ae', tilt: 9, description: 'O Baly Coco e Açaí une paixões nacionais ao sabor Baly, criando uma experiência de sabor única.', sizes: ['250ml', '473ml', '2L'], zero: false, caffeine: '64mg', taurine: '800mg', per: '200ml' },
  { id: 'tadaly', name: 'Tadaly', display: 'TADALY.', headline: 'O inesperado\ntem presença.', color: '#1648e9', ink: '#fff6db', accent: '#fbbe00', tilt: -9, description: 'Baly Tadaly é a energia que te leva pra cima! Um sucesso do Carnaval de 2026, esse sabor continua surpreendendo paladares e sendo uma ótima escolha para drinks e combinações criativas.', sizes: ['473ml', '2L'], zero: false, caffeine: '64mg', taurine: '800mg', per: '200ml' },
];

export const productPath = (id: string) => `/assets/products/${id}.png`;
