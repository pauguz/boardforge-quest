import { useGeneralEditor } from '@/context/GeneralEditorContext';
import { PieceSidebar } from './OptionalSideBars/PieceSidebar';
import BoxSideBar from './BoxSideBar';
import MoneySideBar from './OptionalSideBars/MoneySideBar';

const BARS = [
   PieceSidebar,
   BoxSideBar,
   BoxSideBar,
   MoneySideBar]

const InternalSideBar = () => {
    const {
      selectedMenuIndex: selectedMenuId, setSelectedMenuIndex: setSelectedMenuId
    } = useGeneralEditor();
    const Render= BARS[selectedMenuId] || PieceSidebar;

  return (
    <Render key={selectedMenuId} />
  )
}

export default InternalSideBar
