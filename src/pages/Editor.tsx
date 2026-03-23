import { TopBar } from "@/components/editor/TopBar";
import { PieceSidebar } from "@/components/editor/SideEditor/PieceSidebar";
import SelectBar from "@/components/editor/SelectBar";
import OptionSideBar from "@/components/editor/SideEditor/OptionSideBar";
import Board from "@/components/editor/Board/Board";
import GeneralEditorProvider from "@/context/GeneralEditorContext";
import { GameEditorProvider } from "@/context/GameEditorContext";
//import InternalSideBar from "@/components/editor/SideEditor/InternalSideBar";
const Editor = () => (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <GeneralEditorProvider>
          <SelectBar/>
          <GameEditorProvider>
            <TopBar />
            <div className="flex flex-1 overflow-hidden">
              <Board />
              <PieceSidebar/>
              <OptionSideBar/>
            </div>
          </GameEditorProvider>
      </GeneralEditorProvider>
    </div>
);

export default Editor;
