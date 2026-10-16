export type Flavor = {
  id: string;
  name: string;
  display: string;
  headline: string;
  copy: string;
  mood: string;
  color: string;
  ink: string;
  accent: string;
  art: 'pressure' | 'sun' | 'slice' | 'seeds' | 'duo' | 'pearl' | 'stars';
  tilt: number;
};

export const flavors: Flavor[] = [
  { id: 'tradicional', name: 'Tradicional', display: 'ORIGINAL.', headline: 'Tudo começa\ncom intensidade.', copy: 'O ponto de partida.\nO resto é só o começo.', mood: 'O PRIMEIRO IMPACTO', color: '#191919', ink: '#fbbe00', accent: '#ffdd69', art: 'pressure', tilt: -13 },
  { id: 'tropical', name: 'Tropical', display: 'TROPICAL.', headline: 'Mude\no clima.', copy: 'Sol na composição.\nUma nova direção.', mood: 'ESTADO SOLAR', color: '#ffb900', ink: '#29230b', accent: '#ff6b19', art: 'sun', tilt: 11 },
  { id: 'maca-verde', name: 'Maçã Verde', display: 'VERDE.', headline: 'Quebre\na mesmice.', copy: 'Saia da linha.\nEncontre seu próximo favorito.', mood: 'FORA DO ÓBVIO', color: '#b6e62c', ink: '#173a1d', accent: '#2b9537', art: 'slice', tilt: -10 },
  { id: 'melancia', name: 'Melancia', display: 'MELANCIA.', headline: 'Entre\nde cabeça.', copy: 'Um universo inteiro\npara você explorar.', mood: 'MERGULHO VERMELHO', color: '#f44958', ink: '#3f101d', accent: '#b6ed4d', art: 'seeds', tilt: 12 },
  { id: 'morango-pessego', name: 'Morango e Pêssego', display: 'DOSE DUPLA.', headline: 'Dois sabores.\nOutra dimensão.', copy: 'Um encontro improvável.\nUma combinação que fica.', mood: 'DOIS MUNDOS SE ENCONTRAM', color: '#ff9971', ink: '#611831', accent: '#f3294d', art: 'duo', tilt: -12 },
  { id: 'coco-acai', name: 'Coco e Açaí', display: 'OUTRO CLIMA.', headline: 'Mude de\natmosfera.', copy: 'Dê espaço ao inesperado.\nVeja tudo de outro jeito.', mood: 'UMA NOVA FREQUÊNCIA', color: '#e6e7e5', ink: '#35334e', accent: '#9571ae', art: 'pearl', tilt: 9 },
  { id: 'tadaly', name: 'Tadaly', display: 'TADALY.', headline: 'O inesperado\ntem presença.', copy: 'Siga a curiosidade.\nO próximo movimento é seu.', mood: 'ALÉM DO ESPERADO', color: '#1648e9', ink: '#fff6db', accent: '#fbbe00', art: 'stars', tilt: -9 },
];

export const productPath = (id: string) => `/assets/products/${id}.png`;
