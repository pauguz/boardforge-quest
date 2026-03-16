import { GameEditorProvider } from '@/context/GameEditorContext'
import TransitionPage from '@/pages/transitionPage'
import Editor from '@/pages/Editor'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const EditRouter = () => {
  return (
    <GameEditorProvider>
        <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="download" element={<TransitionPage/>} />
        </Routes>
    </GameEditorProvider>


  )
}

export default EditRouter
