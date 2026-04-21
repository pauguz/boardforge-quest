import React from 'react'
import { BoardGrid } from './BoardGrid'
import { useGeneralEditor } from '@/context/GeneralEditorContext'
import TransitionPage from './transitionPage';

const Board = ({ st = 1, request = 0 }: any) => {
  const {status} = useGeneralEditor();
  return (
    status===2? <TransitionPage st={st} request={request}/>:
    <>
      <BoardGrid/>
    </>


  )
}

export default Board
