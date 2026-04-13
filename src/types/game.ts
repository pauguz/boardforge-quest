export interface Direction {
  dx: number;
  dy: number;
}

export interface MovementRule {
  direction: Direction;
  type: 'range' | 'indefinite';
  range?: number;
  rotate: boolean;
}

export type CaptureMode = 'indian' | 'european';

export interface PieceType {
  id: string;
  name: string;
  imageUrl: string;
  movements: MovementRule[];
  captureMode: CaptureMode;
}

export interface BoardPiece {
  pieceTypeId: string;
  player: 1 | 2;
  row: number;
  col: number;
}

export interface Position {
  row: number;
  col: number;
}

export type VictoryMode = 'arrival' | 'capture';

export interface VictoryCondition {
  mode: VictoryMode;
  pieceTypeId: string;
  targetCells?: Position[];
}

export interface PlayState {
  pieces: BoardPiece[];
  turn: 1 | 2;
  selected: Position | null;
  validMoves: Position[];
  winner: number | null;
  initialPieces: BoardPiece[];
}