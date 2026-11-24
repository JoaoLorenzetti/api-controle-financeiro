const test=require('node:test');
const assert=require('node:assert/strict');
const {periodoAnterior}=require('../utils/relatorioPeriodo');
test('periodo anterior tem a mesma duracao',()=>assert.deepEqual(periodoAnterior({inicio:'2026-11-01',fim:'2026-11-30'}),{inicio:'2026-10-02',fim:'2026-10-31'}));
test('periodo anterior atravessa o ano',()=>assert.deepEqual(periodoAnterior({inicio:'2026-01-01',fim:'2026-01-01'}),{inicio:'2025-12-31',fim:'2025-12-31'}));
