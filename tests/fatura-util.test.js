const test=require('node:test');
const assert=require('node:assert/strict');
const {dataISO,ciclo,proximoMes}=require('../utils/fatura');
test('dataISO ajusta fechamento para fevereiro',()=>assert.equal(dataISO(2027,2,31),'2027-02-28'));
test('ciclo de novembro com fechamento dia 10',()=>assert.deepEqual(ciclo(2026,11,10),{inicio:'2026-10-11',fim:'2026-11-10'}));
test('transicao dezembro para janeiro',()=>assert.deepEqual(proximoMes(2026,12),{ano:2027,mes:1}));
