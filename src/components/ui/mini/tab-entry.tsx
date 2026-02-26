import { title } from "process";
import { dummy } from "@/utils/dummy";
interface TabEntryProps {
  title: string;
  isActive?: boolean; // Añadido para que puedas resaltar la pestaña actual
  func: any;
}

const TabEntry = ({ title='Bob', isActive = false, func= dummy}: TabEntryProps) => {
  return (
    <div onClick={func} style={{display: 'flex', height:'100%'}}
      className={`
        relative px-6 py-2 cursor-pointer transition-all duration-200
        /* Bordes redondeados solo arriba */
        rounded-t-xl 
        /* Efecto de sobresalir (Elevación) */
        ${isActive 
          ? "bg-white text-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-10" 
          : "bg-gray-200 text-gray-500 hover:bg-gray-100 "}
      `}
    >
      <span className="text-sm font-medium whitespace-nowrap">
        {title}
      </span>
      
      {/* Efecto de "pestaña conectada" (opcional) */}
      {isActive && (
        <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-white z-20" />
      )}
    </div>
  );
};

const TabCreator= ()=>{
  return <TabEntry title="+"/>
}
export {TabEntry, TabCreator}
