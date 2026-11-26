const test=require('node:test'),assert=require('node:assert/strict');
const {parcela,ciclo,dataISO}=require('../utils/fatura');
const c={dia_fechamento:3,dia_vencimento:10};
test('antes do fechamento',()=>assert.equal(parcela('2026-11-02',1,c).referencia,'2026-11'));
test('no fechamento',()=>assert.equal(parcela('2026-11-03',1,c).referencia,'2026-12'));
test('terceira parcela e virada do ano',()=>assert.equal(parcela('2026-12-20',3,{dia_fechamento:25,dia_vencimento:5}).referencia,'2027-03'));
test('mes curto',()=>assert.equal(dataISO(2027,2,31),'2027-02-28'));
test('intervalo de fechamento',()=>assert.deepEqual(ciclo(2026,11,10),{inicio:'2026-10-10',fim:'2026-11-09'}));
