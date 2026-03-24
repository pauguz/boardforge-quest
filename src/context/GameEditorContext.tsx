import React, { createContext, useContext, useState, useCallback } from 'react';
import { PieceType, BoardPiece, VictoryCondition, Position } from '@/types/game';
import { getValidMoves, getEuropeanCaptures, checkVictory } from '@/utils/movement';

interface PlayState {
  pieces: BoardPiece[];
  turn: 1 | 2;
  selected: Position | null;
  validMoves: Position[];
  winner: number | null;
  initialPieces: BoardPiece[];
}

interface GameEditorContextType {
  boardRows: number;
  boardCols: number;
  setBoardRows: (n: number) => void;
  setBoardCols: (n: number) => void;
  gamePieceTypes: PieceType[];
  addGamePieceType: (name: string, imageUrl: string) => void;
  updateGamePieceType: (id: string, updates: Partial<PieceType>) => void;
  removeGamePieceType: (id: string) => void;

  boardPieces: BoardPiece[];
  setBoardPieces: React.Dispatch<React.SetStateAction<BoardPiece[]>>;
  currentPlayer: 1 | 2;
  setCurrentPlayer: (p: 1 | 2) => void;
  victoryConditions: VictoryCondition[][];
  addVictoryCondition: (vc: VictoryCondition, j:number) => void;
  removeVictoryCondition: (j:number, i: number) => void;
  isPlaying: boolean;
  playState: PlayState | null;
  startGame: () => void;
  stopGame: () => void;
  handlePlayClick: (row: number, col: number) => void;
}

const Ctx = createContext<GameEditorContextType | null>(null);

export function useGameEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGameEditor must be inside GameEditorProvider');
  return ctx;
}

export function GameEditorProvider({ children }: { children: React.ReactNode }) {
  const [boardRows, setBoardRows] = useState(8);
  const [boardCols, setBoardCols] = useState(8);
  const [pieceTypes, setPieceTypes] = useState<PieceType[]>([]);
  const [boardPieces, setBoardPieces] = useState<BoardPiece[]>([]);
  const [selectedPieceTypeId, setSelectedPieceTypeId] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [victoryConditions, setVictoryConditions] = useState<VictoryCondition[][]>([[],[]]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playState, setPlayState] = useState<PlayState | null>(null);

  const addPieceType = useCallback((name: string, imageUrl: string) => {
    setPieceTypes(prev => [...prev, {
      id: crypto.randomUUID(), name, imageUrl, movements: [], captureMode: 'indian',
    }]);
  }, []);

  const updatePieceType = useCallback((id: string, updates: Partial<PieceType>) => {
    setPieceTypes(prev => prev.map(pt => pt.id === id ? { ...pt, ...updates } : pt));
  }, []);

  const removePieceType = useCallback((id: string) => {
    setPieceTypes(prev => prev.filter(pt => pt.id !== id));
    setBoardPieces(prev => prev.filter(bp => bp.pieceTypeId !== id));
  }, []);

  const addVictoryCondition = useCallback(
    (vc: VictoryCondition, j: number) => {
      setVictoryConditions(prev =>
        prev.map((group, index) => index === j ? [...group, vc] : group)
      );
    },
    []
  );
  
  const removeVictoryCondition = useCallback(
    (i: number, j: number) => {
      setVictoryConditions(prev =>
        prev.map((group, index) =>
          index === j
            ? group.filter((_, idx) => idx !== i)
            : group
        )
      );
    },
    []
  );

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setPlayState({
      pieces: boardPieces.map(p => ({ ...p })),
      turn: 1,
      selected: null,
      validMoves: [],
      winner: null,
      initialPieces: boardPieces.map(p => ({ ...p })),
    });
  }, [boardPieces]);

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setPlayState(null);
  }, []);

  const handlePlayClick = useCallback((row: number, col: number) => {
    if (!playState || playState.winner) return;
    const { pieces, turn, selected, validMoves } = playState;

    if (selected && validMoves.some(m => m.row === row && m.col === col)) {
      const movingPiece = pieces.find(p => p.row === selected.row && p.col === selected.col);
      if (!movingPiece) return;
      const pt = pieceTypes.find(t => t.id === movingPiece.pieceTypeId);
      if (!pt) return;

      let newPieces = pieces.filter(p => !(p.row === selected.row && p.col === selected.col));
      if (pt.captureMode === 'indian') {
        newPieces = newPieces.filter(p => !(p.row === row && p.col === col));
      }
      const movedPiece = { ...movingPiece, row, col };
      newPieces.push(movedPiece);

      if (pt.captureMode === 'european') {
        const ec = getEuropeanCaptures({ row, col }, turn, newPieces);
        newPieces = newPieces.filter(p => !ec.some(c => c.row === p.row && c.col === p.col));
      }

      const winner = checkVictory(newPieces, playState.initialPieces, victoryConditions[turn-1], turn);
      setPlayState({
        ...playState, pieces: newPieces, turn: turn === 1 ? 2 : 1,
        selected: null, validMoves: [], winner,
      });
      return;
    }

    const clickedPiece = pieces.find(p => p.row === row && p.col === col && p.player === turn);
    if (clickedPiece) {
      const pt = pieceTypes.find(t => t.id === clickedPiece.pieceTypeId);
      if (!pt) return;
      const { moves } = getValidMoves(clickedPiece, pt, pieces, boardRows, boardCols);
      setPlayState({ ...playState, selected: { row, col }, validMoves: moves });
    } else {
      setPlayState({ ...playState, selected: null, validMoves: [] });
    }
  }, [playState, pieceTypes, boardRows, boardCols, victoryConditions]);

  return (
    <Ctx.Provider value={{
      boardRows, boardCols, setBoardRows, setBoardCols,
      gamePieceTypes: pieceTypes, addGamePieceType: addPieceType, updateGamePieceType: updatePieceType, removeGamePieceType: removePieceType,
      boardPieces, setBoardPieces,
      currentPlayer, setCurrentPlayer,
      victoryConditions, addVictoryCondition, removeVictoryCondition,
      isPlaying, playState, startGame, stopGame, handlePlayClick,
    }}>
      {children}
    </Ctx.Provider>
  );
}
