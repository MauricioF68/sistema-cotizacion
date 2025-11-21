import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const typeDefs = `#graphql
  type Planta { id: ID! nombre: String! }
  type Operacion { id: ID! nombre: String! }
  type Rango { id: ID! nombre: String! orden: Int }
  type Usuario { id: ID! dni: String! nombre: String }

  type CostoIndirecto {
    id: ID!
    monto: Float!
    plantaId: Int!
    operacionId: Int!
    rangoId: Int!
  }

  type Query {
    obtenerPlantas: [Planta]
    obtenerOperaciones: [Operacion] # Catálogo global
    obtenerRangos: [Rango]
    # Costos filtrados por Planta
    obtenerCostos(plantaId: Int!): [CostoIndirecto]
    # Operaciones que YA tiene asignada una planta (para no mostrar repetidas)
    obtenerOperacionesDePlanta(plantaId: Int!): [Operacion]
  }

  type Mutation {
    # Login Mágico: Ingresa o Registra
    login(dni: String!, nombre: String): Usuario

    crearPlanta(nombre: String!): Planta
    crearOperacion(nombre: String!): Operacion # Crea en el catálogo global
    crearRango(nombre: String!, orden: Int!): Rango
    
    # LA CLAVE: Asigna una operación existente a una planta y genera los ceros
    asignarOperacionAPlanta(plantaId: Int!, operacionId: Int!): Boolean
    
    guardarCosto(plantaId: Int!, operacionId: Int!, rangoId: Int!, monto: Float!): CostoIndirecto
  }
`;

const resolvers = {
  Query: {
    obtenerPlantas: async () => await prisma.planta.findMany(),
    obtenerOperaciones: async () => await prisma.operacion.findMany(),
    obtenerRangos: async () => await prisma.rango.findMany({ orderBy: { orden: 'asc' } }),
    
    obtenerCostos: async (_, { plantaId }) => {
      return await prisma.costoIndirecto.findMany({ where: { plantaId } });
    },

    // Devuelve qué operaciones ya tiene configuradas esta planta
    obtenerOperacionesDePlanta: async (_, { plantaId }) => {
      // Buscamos costos distintos para saber qué operaciones hay
      const costos = await prisma.costoIndirecto.findMany({
        where: { plantaId },
        distinct: ['operacionId'],
        include: { operacion: true }
      });
      return costos.map(c => c.operacion);
    }
  },

  Mutation: {
    // LOGIN "FIND OR CREATE"
    login: async (_, { dni, nombre }) => {
      const usuarioExistente = await prisma.usuario.findUnique({ where: { dni } });
      if (usuarioExistente) {
        return usuarioExistente;
      }
      // Si no existe, lo creamos
      return await prisma.usuario.create({
        data: { dni, nombre: nombre || "Usuario Nuevo" }
      });
    },

    crearPlanta: async (_, { nombre }) => await prisma.planta.create({ data: { nombre } }),
    crearOperacion: async (_, { nombre }) => await prisma.operacion.create({ data: { nombre } }),
    crearRango: async (_, { nombre, orden }) => await prisma.rango.create({ data: { nombre, orden } }),

    // ASIGNACIÓN MANUAL (Tu propuesta)
    asignarOperacionAPlanta: async (_, { plantaId, operacionId }) => {
      const rangos = await prisma.rango.findMany();
      
      const costosIniciales = rangos.map(rango => ({
        plantaId,
        operacionId,
        rangoId: rango.id,
        monto: 0.00
      }));

      // Usamos createMany para insertar todo de golpe
      // El skipDuplicates evita error si le dan clic dos veces
      await prisma.costoIndirecto.createMany({
        data: costosIniciales,
        skipDuplicates: true 
      });

      return true;
    },

    guardarCosto: async (_, { plantaId, operacionId, rangoId, monto }) => {
      return await prisma.costoIndirecto.upsert({
        where: { plantaId_operacionId_rangoId: { plantaId, operacionId, rangoId } },
        update: { monto },
        create: { plantaId, operacionId, rangoId, monto }
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 Servidor listo en: ${url}`);