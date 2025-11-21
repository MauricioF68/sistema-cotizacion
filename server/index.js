import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';

//Conexión
const prisma = new PrismaClient();

const typeDefs = `#graphql
  type Planta {
    id: ID!
    nombre: String!
  }

  type Operacion {
    id: ID!
    nombre: String!
  }

  type Rango {
    id: ID!
    nombre: String!
    orden: Int
  }

  type CostoIndirecto {
    id: ID!
    monto: Float!
    plantaId: Int!
    operacionId: Int!
    rangoId: Int!
  }

  # CONSULTAS 
  type Query {
    obtenerPlantas: [Planta]
    obtenerOperaciones: [Operacion]
    obtenerRangos: [Rango]
    # Esta es la consulta clave para llenar la matriz:
    obtenerCostos(plantaId: Int!): [CostoIndirecto]
  }

  # MUTACIONES
  type Mutation {
    # Permite crear datos maestros iniciales
    crearPlanta(nombre: String!): Planta
    crearOperacion(nombre: String!): Operacion
    crearRango(nombre: String!, orden: Int!): Rango

    # guardar/actualizar 
    guardarCosto(plantaId: Int!, operacionId: Int!, rangoId: Int!, monto: Float!): CostoIndirecto
  }
`;

const resolvers = {
  Query: {
    obtenerPlantas: async () => await prisma.planta.findMany(),
    obtenerOperaciones: async () => await prisma.operacion.findMany(),
    obtenerRangos: async () => await prisma.rango.findMany({ orderBy: { orden: 'asc' } }),
    
    obtenerCostos: async (_, { plantaId }) => {
      return await prisma.costoIndirecto.findMany({
        where: { plantaId: plantaId }
      });
    }
  },
  Mutation: {
    crearPlanta: async (_, { nombre }) => {
      return await prisma.planta.create({ data: { nombre } });
    },
    crearOperacion: async (_, { nombre }) => {
      return await prisma.operacion.create({ data: { nombre } });
    },
    crearRango: async (_, { nombre, orden }) => {
      return await prisma.rango.create({ data: { nombre, orden } });
    },
   
    guardarCosto: async (_, { plantaId, operacionId, rangoId, monto }) => {
      return await prisma.costoIndirecto.upsert({
        where: {
          plantaId_operacionId_rangoId: {
            plantaId,
            operacionId,
            rangoId
          }
        },
        update: { monto }, 
        create: {          
          plantaId,
          operacionId,
          rangoId,
          monto
        }
      });
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(` Servidor : ${url}`);