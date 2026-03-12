import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from "../pages/Index";
import Editor from "../pages/Editor";
import NotFound from "../pages/NotFound";
import Ayuda from "../pages/Ayuda";
import DownloadPage from '@/pages/downloadPage';
import Testing from '@/pages/testing';
import EditRouter from './EditRouter';

const GenRouter = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/editor/*" element={<EditRouter />} />
      <Route path="/ayuda" element={<Ayuda />}/>
      <Route path="/testing" element={<Testing />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  </BrowserRouter>
  )
}

export default GenRouter
