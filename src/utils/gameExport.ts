import { PieceType, BoardPiece, VictoryCondition } from '@/types/game';

export function exportGameAsHTML(
  boardRows: number,
  boardCols: number,
  pieceTypes: PieceType[],
  pieces: BoardPiece[],
  victoryConditions: VictoryCondition[][]
): string {
  const gameData = JSON.stringify({
    boardRows, boardCols,
    pieceTypes: pieceTypes.map(pt => ({
      id: pt.id, name: pt.name, imageUrl: pt.imageUrl,
      movements: pt.movements, captureMode: pt.captureMode,
    })),
    pieces: pieces.map(p => ({
      pieceTypeId: p.pieceTypeId, player: p.player, row: p.row, col: p.col,
    })),
    victoryConditions,
  });

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Juego de Mesa</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#141820;color:#e0d0b0;font-family:system-ui,sans-serif}
#info{margin:16px;font-size:20px}
#board{display:inline-grid;gap:1px;background:#333;padding:1px;border-radius:4px}
.cell{width:56px;height:56px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative}
.cell.light{background:#c4a86a}
.cell.dark{background:#5e4c32}
.cell.valid::after{content:'';position:absolute;width:14px;height:14px;border-radius:50%;background:rgba(212,160,36,0.5)}
.cell.selected{box-shadow:inset 0 0 0 3px #facc15}
.cell.target{box-shadow:inset 0 0 0 2px #ef4444}
.piece{width:80%;height:80%;object-fit:contain;border-radius:50%}
.piece.p1{border:2px solid #4488ff}
.piece.p2{border:2px solid #ff4444}
#winner{margin:16px;font-size:28px;color:#d4a024;font-weight:bold}
#restart{margin-top:8px;padding:8px 32px;background:#d4a024;color:#141820;border:none;border-radius:6px;cursor:pointer;font-size:16px;font-weight:600;display:none}
#restart:hover{background:#c49020}
</style></head><body>
<div id="info">Turno: Jugador 1</div>
<div id="board"></div>
<div id="winner"></div>
<button id="restart" onclick="init()">Reiniciar</button>
<script>
const G=${gameData};
let S;
function init(){
S={pieces:G.pieces.map(p=>({...p})),init:G.pieces.map(p=>({...p})),turn:1,sel:null,vm:[],winner:null};
document.getElementById('winner').textContent='';
document.getElementById('restart').style.display='none';
render();
}
function rots(dx,dy){
const s=new Set(),r=[];
for(const[x,y]of[[dx,dy],[-dx,dy],[dx,-dy],[-dx,-dy],[dy,dx],[-dy,dx],[dy,-dx],[-dy,-dx]]){
const k=x+','+y;if(!s.has(k)&&(x||y)){s.add(k);r.push({dx:x,dy:y})}}return r;
}
function validMoves(piece){
const pt=G.pieceTypes.find(t=>t.id===piece.pieceTypeId);
if(!pt)return{moves:[],caps:[]};
const moves=[],caps=[];
for(const rule of pt.movements){
const dirs=rule.rotate?rots(rule.direction.dx,rule.direction.dy):[rule.direction];
for(const dir of dirs){
const max=rule.type==='unit'?1:rule.type==='range'?(rule.range||1):Math.max(G.boardRows,G.boardCols);
for(let s=1;s<=max;s++){
const r=piece.row+dir.dy*s,c=piece.col+dir.dx*s;
if(r<0||r>=G.boardRows||c<0||c>=G.boardCols)break;
const occ=S.pieces.find(p=>p.row===r&&p.col===c);
if(occ){if(occ.player!==piece.player&&pt.captureMode==='indian'){moves.push({row:r,col:c});caps.push({row:r,col:c})}break}
moves.push({row:r,col:c})}}}return{moves,caps};
}
function euroCaps(pos,pl){
const c=[];
for(const d of[{dx:0,dy:1},{dx:0,dy:-1},{dx:1,dy:0},{dx:-1,dy:0}]){
const ar=pos.row+d.dy,ac=pos.col+d.dx;
const adj=S.pieces.find(p=>p.row===ar&&p.col===ac);
if(adj&&adj.player!==pl){const opp=S.pieces.find(p=>p.row===ar+d.dy&&p.col===ac+d.dx);
if(opp&&opp.player===pl)c.push({row:ar,col:ac})}}return c;
}
function chkWin(turn){
for(const vc of G.victoryConditions[turn-1]){
if(vc.mode==='arrival'&&vc.targetCells){
for(const p of S.pieces)
if(p.pieceTypeId===vc.pieceTypeId&&vc.targetCells.some(t=>t.row===p.row&&t.col===p.col&&p.player==turn ))return p.player;} 
else if(vc.mode==='capture'){for(const pl of[1,2]){if(!S.init.some(p=>p.pieceTypeId===vc.pieceTypeId&&p.player===pl))continue; if(!S.pieces.some(p=>p.pieceTypeId===vc.pieceTypeId&&p.player===pl))return pl===1?2:1;}}
}return null;}
function click(r,c){
if(S.winner)return;
if(S.sel&&S.vm.some(m=>m.row===r&&m.col===c)){
const mp=S.pieces.find(p=>p.row===S.sel.row&&p.col===S.sel.col);
const pt=G.pieceTypes.find(t=>t.id===mp.pieceTypeId);
S.pieces=S.pieces.filter(p=>!(p.row===S.sel.row&&p.col===S.sel.col));
if(pt.captureMode==='indian')S.pieces=S.pieces.filter(p=>!(p.row===r&&p.col===c));
mp.row=r;mp.col=c;S.pieces.push(mp);
if(pt.captureMode==='european'){const ec=euroCaps({row:r,col:c},S.turn);S.pieces=S.pieces.filter(p=>!ec.some(e=>e.row===p.row&&e.col===p.col))}
const w=chkWin(S.turn);
if(w){S.winner=w;document.getElementById('winner').textContent='¡Jugador '+w+' ha ganado!';document.getElementById('restart').style.display='block'}
S.turn=S.turn===1?2:1;S.sel=null;S.vm=[];
}else{
const cp=S.pieces.find(p=>p.row===r&&p.col===c&&p.player===S.turn);
if(cp){const{moves}=validMoves(cp);S.sel={row:r,col:c};S.vm=moves}
else{S.sel=null;S.vm=[]}}
render();
}
function render(){
const b=document.getElementById('board');
b.style.gridTemplateColumns='repeat('+G.boardCols+',56px)';
b.innerHTML='';
const tcs=G.victoryConditions.filter(v=>v.mode==='arrival'&&v.targetCells).flatMap(v=>v.targetCells);
for(let r=0;r<G.boardRows;r++)for(let c=0;c<G.boardCols;c++){
const d=document.createElement('div');
d.className='cell '+((r+c)%2===0?'light':'dark');
if(S.sel&&S.sel.row===r&&S.sel.col===c)d.classList.add('selected');
if(S.vm.some(m=>m.row===r&&m.col===c))d.classList.add('valid');
if(tcs.some(t=>t.row===r&&t.col===c))d.classList.add('target');
d.onclick=(()=>{const rr=r,cc=c;return()=>click(rr,cc)})();
const piece=S.pieces.find(p=>p.row===r&&p.col===c);
if(piece){const pt=G.pieceTypes.find(t=>t.id===piece.pieceTypeId);
if(pt){const img=document.createElement('img');img.src=pt.imageUrl;img.className='piece p'+piece.player;img.alt=pt.name;img.draggable=false;d.appendChild(img)}}
b.appendChild(d)}
if(!S.winner)document.getElementById('info').textContent='Turno: Jugador '+S.turn;
}
init();
</script></body></html>`;
}
