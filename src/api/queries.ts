export const QUERY_PIEZAS_POR_JUEGO = `
  query CargarPiezas($juegoId: Int!) {
    piezaTipoCollection(filter: { juego_id: { eq: $juegoId } }) {
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
`;


