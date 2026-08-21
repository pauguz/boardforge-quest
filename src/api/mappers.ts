
import { BoardPiece, PlayState } from "@/types/game";

export function mapSalaToPlayState(node: any, piezas: any[]): PlayState {
  const dispin: Array<{idx?: number, code?: string, player: 1|2, row: number, col: number}> 
  = typeof node.dispin === 'string' 
    ? JSON.parse(node.dispin) 
    : (node.dispin ?? []);

      const pieces: BoardPiece[] = dispin.map(entry => ({
        pieceTypeIndex: entry.idx ?? piezas.findIndex(p => p.codigo === entry.code),
        player:         entry.player,
        row:            entry.row,
        col:            entry.col,
      }));

  return {
    pieces,
    initialPieces: pieces,
    turn:          1,
    selected:      null,
    validMoves:    [],
    winner:        null,
  };
}