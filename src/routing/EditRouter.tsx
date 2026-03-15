import { GameEditorProvider } from '@/context/GameEditorContext'
import DownloadPage from '@/pages/downloadPage'
import Editor from '@/pages/Editor'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const EditRouter = () => {
  return (
    <GameEditorProvider>
        <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="download" element={<DownloadPage/>} />
        </Routes>
    </GameEditorProvider>


  )
}

export default EditRouter
