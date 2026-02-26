import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from "../pages/Index";
import Editor from "../pages/Editor";
import NotFound from "../pages/NotFound";
import Ayuda from "../pages/Ayuda";
//import Testing from '@/pages/testing';

const GenRouter = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/ayuda" element={<Ayuda />}/>
      {/* <---    <Route path="/testing" element={<Testing />} /> */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  </BrowserRouter>
  )
}

export default GenRouter
