import { title } from "process";
import { dummy } from "@/utils/dummy";
interface TabEntryProps {
  title: string;
  isActive?: boolean; // Añadido para que puedas resaltar la pestaña actual
  func: any;
}

const TabEntry = ({ title='Bob', isActive = false, func= dummy}: TabEntryProps) => {
  return (
      <div 
        onClick={func} 
        style={{ display: 'flex', height: '100%', alignItems: 'center' }}
        className={`
          relative px-6 cursor-pointer transition-all duration-300
          rounded-t-xl border-t border-x border-transparent
          /* Estado Base (Oscuro e Inactivo) */
          ${isActive 
            ? "bg-[#1e1e1e] text-white z-10 shadow-[0_-8px_20px_rgba(0,0,0,0.6)] border-white/10" 
            : "bg-[#121212] text-gray-500 hover:bg-[#181818] hover:text-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]"}
        `}
      >
        <span className={`text-sm font-medium whitespace-nowrap transition-colors ${isActive ? "opacity-100" : "opacity-70"}`}>
          {title}
        </span>
        
        {/* Línea de acento superior opcional para dar más "fuerza" al activo */}
        {isActive && (
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary rounded-t-xl" />
        )}


      </div>
  );
};

const TabCreator= ()=>{
  return <TabEntry title="+"/>
}
export {TabEntry, TabCreator}
