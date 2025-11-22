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
    
    obtenerOperacionesDePlanta: async (_, { plantaId }) => {
      
      const costos = await prisma.costoIndirecto.findMany({
        where: { plantaId },
        distinct: ['operacionId'],
        include: { operacion: true }
      });
      return costos.map(c => c.operacion);
    }
  },

  Mutation: {
    
    login: async (_, { dni, nombre }) => {
      const usuarioExistente = await prisma.usuario.findUnique({ where: { dni } });
      if (usuarioExistente) {
        return usuarioExistente;
      }
     
      return await prisma.usuario.create({
        data: { dni, nombre: nombre || "Usuario Nuevo" }
      });
    },

    crearPlanta: async (_, { nombre }) => await prisma.planta.create({ data: { nombre } }),
    crearOperacion: async (_, { nombre }) => await prisma.operacion.create({ data: { nombre } }),
    crearRango: async (_, { nombre, orden }) => await prisma.rango.create({ data: { nombre, orden } }),

    
    asignarOperacionAPlanta: async (_, { plantaId, operacionId }) => {
      try {
        
        const rangos = await prisma.rango.findMany();
        
        if (rangos.length === 0) return false;
        for (const rango of rangos) {
          await prisma.costoIndirecto.upsert({
            where: {
              plantaId_operacionId_rangoId: {
                plantaId: plantaId,
                operacionId: operacionId,
                rangoId: rango.id
              }
            },
            update: {},
            create: {
              plantaId: plantaId,
              operacionId: operacionId,
              rangoId: rango.id,
              monto: 0.00 
            }
          });
        }
        
        return true;
      } catch (error) {
        console.error("Error al asignar:", error);
        throw new Error("No se pudo asignar la operación");
      }
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


async function asegurarRangosCompletos() {
  const rangosCompletos = [
    { nombre: '300 KG', orden: 1 },
    { nombre: '500 KG', orden: 2 },
    { nombre: '1 T', orden: 3 },
    { nombre: '3 T', orden: 4 },
    { nombre: '5 T', orden: 5 },
    { nombre: '10 T', orden: 6 },
    { nombre: '20 T', orden: 7 },
    { nombre: '30 T', orden: 8 }
  ];

  console.log('⚡ Verificando rangos...');
  
  for (const rango of rangosCompletos) {
    try {
      await prisma.rango.create({ data: rango });
    } catch (e) {
      if (e.code === 'P2002') {
      } else {
        console.error("Error desconocido al crear rango:", e);
      }
    }
  }
  console.log('✅ Verificación de rangos terminada.');
}
asegurarRangosCompletos();


const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 Servidor listo en: ${url}`);