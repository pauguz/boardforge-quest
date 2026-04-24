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
  code: string;
  name: string;
  imageUrl: string;
  movements: MovementRule[];
  captureMode: CaptureMode;
  imageFile: File;
}

export interface BoardPiece {
  pieceTypeCode: string;
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
  pieceTypeCode: string;
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


export function getUtilPieceTypes(bps: BoardPiece[], bts: PieceType[]){
  const generosUnicos = [...new Set(bps.map(c => c.pieceTypeCode))];
  return   bts.filter(reg => generosUnicos.includes(reg.code));
}