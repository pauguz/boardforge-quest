export function generateRoomId() {
    return Math.random().toString(36).substring(2, 8);
  }

export const incremento = (sc:number, inc:number=1, dir="salasCreadas")=> {const r=sc+inc; return r.toString();} 

export const localInt = (key:string)=>{return parseInt(localStorage.getItem(key));}

export function toBinaryString (num, bits = 5) {
    return num.toString(2).padStart(bits, '0');
  };


export  function base64ToBlob(base64String) {
    // Separar el encabezado ("data:image/png;base64,") de los datos puros
    const byteString = atob(base64String.split(',')[1]);
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
    
    // Crear un array de bytes
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    // Retornar el objeto listo para ser subido
    return new Blob([ab], { type: mimeString });
  }

export function ficheroToBlob(fichero){
  return fichero.map(item => ({...item,
                        imageBlob: base64ToBlob(item.imageUrl)}
                      ));
  }

