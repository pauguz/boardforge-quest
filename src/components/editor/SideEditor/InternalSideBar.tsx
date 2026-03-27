import { useGeneralEditor } from '@/context/GeneralEditorContext';
import { PieceSidebar } from './PieceSidebar';
import BoxSideBar from './BoxSideBar';
import MoneySideBar from './MoneySideBar';

const BARS = {
  '1': PieceSidebar,
  '2': BoxSideBar,
  '3': BoxSideBar,
  '4': MoneySideBar
};

const InternalSideBar = () => {
    const {
      selectedMenuId, setSelectedMenuId
    } = useGeneralEditor();
    const Render= BARS[selectedMenuId] || PieceSidebar;

  return (
    <Render key={selectedMenuId} />
  )
}

export default InternalSideBar
