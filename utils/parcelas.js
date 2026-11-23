const {randomUUID}=require('node:crypto');
function dividirEmParcelas(valor,n){if(!Number.isInteger(n)||n<1||n>48||typeof valor!=='number'||!Number.isFinite(valor)||valor<=0||Math.abs(valor*100-Math.round(valor*100))>1e-6)throw new Error('Parcelamento invalido');const cents=Math.round(valor*100),base=Math.floor(cents/n),resto=cents-base*n;if(base===0)throw new Error('Parcela com valor zero');return Array.from({length:n},(_,i)=>(base+(i===0?resto:0))/100);}
module.exports={dividirEmParcelas,randomUUID};
