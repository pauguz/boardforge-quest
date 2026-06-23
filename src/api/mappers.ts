
import { BoardPiece, PlayState } from "@/types/game";

interface PiezaTipoGQL {
  codigo: string;
  simbolo: string;
  movimientos: Record<string, unknown>;
  cm: string;
  img_url: string;
}

interface DispinEntry {
  code: string;
  player: 1 | 2;
  row: number;
  col: number;
}

export function mapSalaToPlayState(data: any): PlayState {
  const node = data.salaCollection.edges[0]?.node;
  if (!node) throw new Error('Sala no encontrada');

  const piezas: PiezaTipoGQL[] = node.juego.piezaTipoCollection.edges.map(
    (e: any) => e.node
  );

  const dispin: DispinEntry[] = node.juego.dispin ?? [];

  const pieces: BoardPiece[] = dispin.map(entry => {
    const tipo = piezas.find(p => p.codigo === entry.code);
    return {
      pieceTypeCode: entry.code,
      simbolo:       tipo?.simbolo ?? '?',
      player:        entry.player,
      row:           entry.row,
      col:           entry.col,
    };
  });

  return {
    pieces,
    initialPieces: pieces,
    turn:          (node.turn % 2 === 0 ? 1 : 2) as 1 | 2,
    selected:      null,
    validMoves:    [],
    winner:        null,
  };
}