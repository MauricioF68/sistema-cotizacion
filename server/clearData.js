import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando limpieza de datos de prueba...');
  await prisma.costoIndirecto.deleteMany({});
  console.log('✅ Registros de Costos eliminados.');
  await prisma.planta.deleteMany({});
  console.log('✅ Registros de Plantas eliminados.');
  await prisma.operacion.deleteMany({});
  console.log('✅ Registros de Operaciones eliminados.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });