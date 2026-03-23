import { Direction, BoardPiece, PieceType, Position, VictoryCondition } from '@/types/game';

export function getRotations(dx: number, dy: number): Direction[] {
  const set = new Set<string>();
  const results: Direction[] = [];
  const candidates: [number, number][] = [
    [dx, dy], [-dx, dy], [dx, -dy], [-dx, -dy],
    [dy, dx], [-dy, dx], [dy, -dx], [-dy, -dx],
  ];
  for (const [x, y] of candidates) {
    const key = `${x},${y}`;
    if (!set.has(key) && (x !== 0 || y !== 0)) {
      set.add(key);
      results.push({ dx: x, dy: y });
    }
  }
  return results;
}

export function findDirections(pt: PieceType, dir:Direction): boolean{
  let ret=false;
  for (const n of pt.movements){
    ret = ret || (n.direction.dx===dir.dx && n.direction.dy===dir.dy)
    if (ret) break;
  }
  return ret
}

type SmartArray<T> = T extends Array<infer U> 
  ? Array<SmartArray<U>> 
  : T;

/**
 * Crea un Proxy que permite aritmética de índices negativos (estilo Python).
 * Soporta lectura y escritura recursiva.
 */
export function createSmartArray<T>(arr: T[]): SmartArray<T> {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      // 1. Si no es un índice numérico (ej: 'map', 'length', 'push'), usamos el original
      if (typeof prop === 'symbol' || isNaN(Number(prop))) {
        const value = Reflect.get(target, prop, receiver);
        // Si el valor es una función, debemos bindearla al target original
        return typeof value === 'function' ? value.bind(target) : value;
      }

      let index = Number(prop);
      if (index < 0 || index>=target.length) index %= target.length;

      const value = target[index];

      // 2. Recursividad para arrays anidados
      if (Array.isArray(value)) {
        return createSmartArray(value);
      }

      return value;
    },

    set(target, prop, value): boolean {
      // Si no es un índice numérico, seteo normal
      if (typeof prop === 'symbol' || isNaN(Number(prop))) {
        return Reflect.set(target, prop, value);
      }

      let index = Number(prop);
      if (index < 0 || index>=target.length) index %= target.length;

      target[index] = value;
      if (Array.isArray(value)) {
        return createSmartArray(value);
      }

      return true;
    }
  }) as unknown as SmartArray<T>;
}



export function polarCoordinates(arr:number[][], dim: number[]){
  const ret=arr.map(dup =>{return dup});
  return ret;
}

export function getValidMoves(
  piece: BoardPiece,
  pieceType: PieceType,
  allPieces: BoardPiece[],
  rows: number,
  cols: number
): { moves: Position[]; captures: Position[] } {
  const moves: Position[] = [];
  const captures: Position[] = [];

  for (const rule of pieceType.movements) {
    const dirs = rule.rotate
      ? getRotations(rule.direction.dx, rule.direction.dy)
      : [rule.direction];

    for (const dir of dirs) {
      const maxSteps =
        rule.type === 'range' ? (rule.range || 1)
        : Math.max(rows, cols);

      for (let s = 1; s <= maxSteps; s++) {
        const r = piece.row + dir.dy * s;
        const c = piece.col + dir.dx * s;
        if (r < 0 || r >= rows || c < 0 || c >= cols) break;

        const occ = allPieces.find(p => p.row === r && p.col === c);
        if (occ) {
          if (occ.player !== piece.player && pieceType.captureMode === 'indian') {
            moves.push({ row: r, col: c });
            captures.push({ row: r, col: c });
          }
          break;
        }
        moves.push({ row: r, col: c });
      }
    }
  }
  return { moves, captures };
}

export function getEuropeanCaptures(
  pos: Position,
  player: 1 | 2,
  pieces: BoardPiece[]
): Position[] {
  const captured: Position[] = [];
  const dirs = [
    { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
    { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
  ];
  for (const d of dirs) {
    const ar = pos.row + d.dy;
    const ac = pos.col + d.dx;
    const adj = pieces.find(p => p.row === ar && p.col === ac);
    if (adj && adj.player !== player) {
      const or2 = ar + d.dy;
      const oc = ac + d.dx;
      const opp = pieces.find(p => p.row === or2 && p.col === oc);
      if (opp && opp.player === player) {
        captured.push({ row: ar, col: ac });
      }
    }
  }
  return captured;
}

export function checkVictory(
  currentPieces: BoardPiece[],
  initialPieces: BoardPiece[],
  conditions: VictoryCondition[],
  plyr: number
): number | null {
  for (const vc of conditions) {
    if (vc.mode === 'arrival' && vc.targetCells) {
      for (const p of currentPieces) {
        if (p.pieceTypeId === vc.pieceTypeId) {
          if (vc.targetCells.some(t => t.row === p.row && t.col === p.col && p.player===plyr)) {
            return p.player;
          }
        }
      }
    } else if (vc.mode === 'capture') {
      for (const player of [1, 2] as const) {
        const hadInitially = initialPieces.some(
          p => p.pieceTypeId === vc.pieceTypeId && p.player === player
        );
        if (!hadInitially) continue;
        const hasNow = currentPieces.some(
          p => p.pieceTypeId === vc.pieceTypeId && p.player === player
        );
        if (!hasNow) return player === 1 ? 2 : 1;
      }
    }
  }
  return null;
}
