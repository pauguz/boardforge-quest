import React from 'react'
import { BoardGrid } from './BoardGrid'
import { useGeneralEditor } from '@/context/GeneralEditorContext'
import TransitionPage from './transitionPage';

const Board = (props: any={st:1, request:0}) => {
  const {status} = useGeneralEditor();
  return (
    status===2? <TransitionPage st={props.st} request={props.request}/>:
    <>
      <BoardGrid/>
    </>


  )
}

export default Board
