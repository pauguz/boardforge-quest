import { GameEditorProvider } from "@/context/GameEditorContext";
import { TopBar } from "@/components/editor/TopBar";
import { BoardGrid } from "@/components/editor/BoardGrid";
import { PieceSidebar } from "@/components/editor/PieceSidebar";

const Editor = () => (
  <GameEditorProvider>
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <BoardGrid />
        <PieceSidebar />
      </div>
    </div>
  </GameEditorProvider>
);

export default Editor;
