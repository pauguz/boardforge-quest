import React from 'react'
import {BoardGrid as Bg} from '@/components/BoardGrid'
import { useGeneralEditor } from '@/context/GeneralEditorContext'
import TransitionPage from './transitionPage';
import { useGameEditor } from '@/context/GameEditorContext';

const Board = ({ st = 1, request = 0 }: any) => {
  const {status} = useGeneralEditor();
  const {
      boardRows, boardCols, boardPieces, setBoardPieces,
      currentPlayer, isPlaying, setIsPlaying, playState, handlePlayClick, victoryConditions,
      stopGame
    } = useGameEditor();
  const {selectedPieceTypeIndex, pieceTypes, addPieceType }=useGeneralEditor();

  const handleCellClick = (row: number, col: number) => {
    if (isPlaying) {
      handlePlayClick(row, col);
      return;
    }
    const existing = boardPieces.find(p => p.row === row && p.col === col);
    if (existing) {
      setBoardPieces(prev => prev.filter(p => !(p.row === row && p.col === col)));
    } 
    else if (selectedPieceTypeIndex !== null) {
      setBoardPieces(prev => [...prev, {
        pieceTypeIndex: selectedPieceTypeIndex, player: currentPlayer, row, col,
      }]);  
    }

  };
  const pieces = isPlaying && playState ? playState.pieces : boardPieces;
  const targetCells = victoryConditions.flat()
    .filter(vc => vc.mode === 'arrival' && vc.targetCells)
    .flatMap(vc => vc.targetCells!);
  return (
    status===2? <TransitionPage st={st} request={request}/>:
    <>
      <Bg
        rows={boardRows}
        cols={boardCols}
        pieces={pieces}
        pieceTypes={pieceTypes}
        validMoves={playState?.validMoves}
        selected={playState?.selected}
        targetCells={targetCells}
        winner={playState?.winner}
        onCellClick={handleCellClick}
        onVolverClick={() => stopGame() }
      />
    </>


  )
}

export default Board
