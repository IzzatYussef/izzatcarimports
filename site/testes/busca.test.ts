import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { Busca } from '../src/lib/busca';

const ix = JSON.parse(readFileSync('public/dados/busca.json', 'utf-8'));
const b = new Busca(ix);

describe('busca do catalogo', () => {
  it('"xc60" acha anuncio escrito "Xc 60"', () => {
    const r = b.procurar({ q: 'lanterna xc60' });
    expect(r.some((x) => x.id === 'MLB4779038537')).toBe(true);
  });
  it('acha pelo codigo gravado (OEM) sem hifen', () => {
    const alvo = b.itens.find((x) => x.o && x.o.split(' ')[0].length >= 7)!;
    const cod = alvo.o.split(' ')[0];
    expect(b.procurar({ q: cod }).some((x) => x.id === alvo.id)).toBe(true);
  });
  it('tolera erro de digitacao', () => {
    expect(b.procurar({ q: 'amortecdor' }).length).toBeGreaterThan(0);
  });
  it('filtro de marca, modelo e ano', () => {
    const r = b.procurar({ marca: 'Volvo', modelo: 'XC60', ano: 2020 });
    expect(r.length).toBeGreaterThan(50);
    expect(r.every((x) => x.b === 'Volvo' && x.m === 'XC60' && x.y && x.y[0] <= 2020 && x.y[1] >= 2020)).toBe(true);
  });
  it('ano solto na busca vira filtro', () => {
    const r = b.procurar({ q: 'palio 2010' });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => !x.y || (x.y[0] <= 2010 && x.y[1] >= 2010))).toBe(true);
  });
  it('ordem por preco', () => {
    const r = b.procurar({ marca: 'Fiat', ordem: 'asc' });
    for (let i = 1; i < r.length; i++) expect(r[i].p).toBeGreaterThanOrEqual(r[i - 1].p);
  });
});
