import { BoardPiece, PieceType, PlayState } from "../types/game";


export function getUtilPieceTypes(bps: BoardPiece[], bts: PieceType[]): PieceType[] {
  const indicesUnicos = [...new Set(bps.map(p => p.pieceTypeIndex))];
  return bts.filter((_, i) => indicesUnicos.includes(i));
}

export function toDispin(state: PlayState) {  // ya no necesita pieces
  return state.initialPieces.map(piece => ({
    idx:    piece.pieceTypeIndex,
    player: piece.player,
    row:    piece.row,
    col:    piece.col,
  }));
}

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