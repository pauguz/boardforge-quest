import { incremento, localInt } from "@/utils/roomCode";
import CloseButton from "../ui/mini/closeButton";
import { deleteRoom, listarJugadoresSala, unirseASala } from "@/services/salaService";

const SalaHeader = ({ isCreator, datos, localId, mag, setError, myPosition, setMyPosition, actualizarJugadores }) => (
    <div>
      {isCreator && <CloseButton 
                    onDelete={()=>{console.log('sala eliminada?'); deleteRoom(datos, localId, setError); 
                    localStorage.setItem("salasCreadas",  incremento(localInt("salasCreadas"), -1) 
                    ) }}/>}
        {datos.enjuego === '0' && (
          <div>
            <p>{datos.jugadores_actuales}/{mag} jugadores en la sala</p>
            <button 
              onClick={() => {
                unirseASala(datos, setMyPosition, setError, () => {
                  listarJugadoresSala(datos, localId, setMyPosition, actualizarJugadores);
                }); 
              }}
              disabled={myPosition !== null || datos.jugadores_actuales >= mag}
            >
              {myPosition ? `Jugador ${myPosition}` : 'Unirse'}
            </button>
          </div>
        )}
    </div>
  );

export default SalaHeader;