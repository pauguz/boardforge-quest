import { createSmartArray } from "./movement";

export function dummy(): void{
  console.log("Pestania creada")
}

export function testClockArit():void{
  
  
  interface User { id: number; name: string; }
  
  const matrix = createSmartArray<User[]>([
    [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
    [{ id: 3, name: 'Charlie' }, { id: 4, name: 'David' }]
  ]);
  
  // Escritura en índice negativo
  matrix[-1][-1] = { id: 99, name: 'Zack' };
  
  // Lectura en índice negativo
  console.log(matrix[-1][-1].name); // "Zack"
}