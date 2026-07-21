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
          dispin
          juego_id
        }
      }
    }
  }
`;

export const QUERY_LUDISALA_POR_CODE = `
  query CargarSala($codigo: String!) {
    ludisalaCollection(filter: { codigo: { eq: $codigo } }) {
      edges {
        node {
          sala_id
          nombre_juego
          enjuego
          alto
          ancho
          dispin
          juego_id
        }
      }
    }
  }
`;

export const QUERY_PIEZAS_POR_JUEGO = `
  query CargarPiezas($juegoId: Int!) {
    piezaTipoCollection(filter: { juego_id: { eq: $juegoId } }) {
      edges {
        node {
          codigo
          simbolo
          movimientos
          cm
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