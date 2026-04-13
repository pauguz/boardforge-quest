import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Ayuda from "../pages/Ayuda";
//import TestRouter from './TestRouter';
import Editor from '@/pages/Editor';
import LudiSala from '@/pages/LudiSala';



const GenRouter = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/ayuda" element={<Ayuda />}/>
      <Route path="/sala/:roomId" element={<LudiSala />}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  )
}

export default GenRouter
