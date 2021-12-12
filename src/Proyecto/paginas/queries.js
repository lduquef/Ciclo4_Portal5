import {gql} from "@apollo/client"

const GET_AVANCES = gql  `
query Query($idProyecto: String!) {
    listarAvancesProyecto(idProyecto: $idProyecto) {
      _id
      proyecto {
        nombre
      }
      estudiante {
        nombre
      }
      descripcion
      observaciones
      fechaAvance
      fechaObservacion
    }
  }

`;

export {GET_AVANCES};