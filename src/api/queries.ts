// src/api/queries.ts

// src/api/queries.ts
export const QUERY_LUDISALAS = `
  query {
    ludisalaCollection {
      edges {
        node {
          sala_id
          nombre_juego
          enjuego
          alto
          ancho
        }
      }
    }
  }
`;


export const QUERY_SALA = `
  query CargarSala($salaId: Int!) {
    salaCollection(filter: { id: { eq: $salaId } }) {
      edges {
        node {
          id
          turn
          enjuego
          juego {
            id
            nombre
            alto
            ancho
            dispin
            piezaTipoCollection {
              edges {
                node {
                  codigo
                  simbolo
                  movimientos
                  cm
                  img_url
                }
              }
            }
          }
          jugadorCollection {
            edges {
              node {
                id
                posicion
              }
            }
          }
        }
      }
    }
  }
`;