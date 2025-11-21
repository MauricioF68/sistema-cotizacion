-- CreateTable
CREATE TABLE "Planta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Operacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Rango" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CostoIndirecto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monto" REAL NOT NULL,
    "plantaId" INTEGER NOT NULL,
    "operacionId" INTEGER NOT NULL,
    "rangoId" INTEGER NOT NULL,
    CONSTRAINT "CostoIndirecto_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Planta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CostoIndirecto_operacionId_fkey" FOREIGN KEY ("operacionId") REFERENCES "Operacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CostoIndirecto_rangoId_fkey" FOREIGN KEY ("rangoId") REFERENCES "Rango" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Planta_nombre_key" ON "Planta"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Operacion_nombre_key" ON "Operacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Rango_nombre_key" ON "Rango"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CostoIndirecto_plantaId_operacionId_rangoId_key" ON "CostoIndirecto"("plantaId", "operacionId", "rangoId");
