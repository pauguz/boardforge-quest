import React from 'react'

const Ayuda = () => {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <h1>Creacion de Fichas</h1>
      
      <p> Tu mismo puedes decidir que usar como ficha. Escoge una imagen de tus archivos y podrás usarla </p>

      <p> También deberás definir su movimiento, que puedes imaginar como una suma</p>

      <p> Seria muy engorroso tener que añadir todos los movimientos manualmente, asi que puedes usar las opciones rotar y rango</p>

      <p> Por ultimo, puedes definir como se captura a las fichas del enemigo</p>
      

      <h1>Condiciona la victoria</h1>

      <p> Decide como se gana el juego, para ello primero selecciona una ficha </p>

      <p> Escoge el modo extinción si quieres que la partida acaba cuando todas esas fichas sean capturadas</p>

      <p> Escoge el modo llegada si quieres que la partida se acabe cuando ese tipo de ficha alcance a una posición específica</p>
      

    </div>
  )
}

export default Ayuda
