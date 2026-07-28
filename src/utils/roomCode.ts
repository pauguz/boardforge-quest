export function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8);
  }

export const incremento = (sc:number, inc:number=1, dir="salasCreadas")=> {const r=sc+inc; return r.toString();} 

export const localInt = (key:string)=>{return parseInt(localStorage.getItem(key));}



