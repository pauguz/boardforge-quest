import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PieceType, BoardPiece, VictoryCondition, Position, getUtilPieceTypes } from '@/types/game';
import { getValidMoves, getEuropeanCaptures, checkVictory } from '@/utils/movement';
import { useGeneralEditor } from './GeneralEditorContext';
import { PlayState } from '@/types/game';

interface GameEditorContextType {
  boardRows: number;
  boardCols: number;
  setBoardRows: (n: number) => void;
  setBoardCols: (n: number) => void;
  getBoardPieceTypeCodes ,
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
  const general= useGeneralEditor()
  if (!ctx) {
    throw new Error('useGameEditor must be inside GameEditorProvider');
  }
  if (!general) {
    throw new Error('GameEditorProvider must be a child of GeneralEditorProvider');
  }  return ctx;
}

export function GameEditorProvider({ children }: { children: React.ReactNode}) {
  const [boardRows, setBoardRows] = useState(8);
  const [boardCols, setBoardCols] = useState(8);
  const [boardPieces, setBoardPieces] = useState<BoardPiece[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [victoryConditions, setVictoryConditions] = useState<VictoryCondition[][]>([[],[]]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playState, setPlayState] = useState<PlayState | null>(null);


  const {pieceTypes, selectedPieceTypeCode}=useGeneralEditor();

  const getBoardPieceTypeCodes = useCallback(
    ()=>{return  getUtilPieceTypes(boardPieces, pieceTypes);}, 
    [boardPieces, pieceTypes]
  )

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
    //Movimiento
    if (selected && validMoves.some(m => m.row === row && m.col === col)) {
      const movingPiece = pieces.find(p => p.row === selected.row && p.col === selected.col);
      if (!movingPiece) return;
      const pt = pieceTypes.find(t => t.code === movingPiece.pieceTypeCode);
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
    //Seleccion
    const clickedPiece = pieces.find(p => p.row === row && p.col === col && p.player === turn);
    if (clickedPiece) {
      const pt = pieceTypes.find(t => t.code === clickedPiece.pieceTypeCode);
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
      boardPieces, setBoardPieces,
      currentPlayer, setCurrentPlayer,
      victoryConditions, addVictoryCondition, removeVictoryCondition,
      isPlaying, playState, startGame, stopGame, handlePlayClick, getBoardPieceTypeCodes
    }}>
      {children}
    </Ctx.Provider>
  );
}
