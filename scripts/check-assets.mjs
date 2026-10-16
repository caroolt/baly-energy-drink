import { readFile } from 'node:fs/promises';

const paths = [
  'brand/logo.png',
  ...['tradicional', 'tropical', 'maca-verde', 'melancia', 'morango-pessego', 'coco-acai', 'tadaly'].map(name => `products/${name}.png`),
];
const missing = [];
for (const path of paths) {
  try {
    const data = await readFile(new URL(`../public/assets/${path}`, import.meta.url));
    if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('O arquivo não é PNG.');
    console.log(`OK ${path} (${data.readUInt32BE(16)} × ${data.readUInt32BE(20)})`);
  } catch (error) {
    missing.push(path);
    console.error(`PENDENTE ${path}: ${error.code === 'ENOENT' ? 'original não recebido no workspace' : error.message}`);
  }
}
if (missing.length) {
  console.error(`\n${missing.length} asset(s) original(is) pendente(s). A integração visual não está concluída.`);
  process.exitCode = 1;
}
