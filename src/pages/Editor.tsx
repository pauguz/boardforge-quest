import { TopBar } from "@/components/editor/TopBar";
import { PieceSidebar } from "@/components/editor/SideEditor/PieceSidebar";
import SelectBar from "@/components/editor/SelectBar";
import OptionSideBar from "@/components/editor/SideEditor/OptionSideBar";
import Board from "@/components/editor/Board";
const Editor = () => (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <SelectBar/>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Board />
        <PieceSidebar />
        <OptionSideBar/>
      </div>
    </div>
);

export default Editor;
