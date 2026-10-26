---
title: Parcial 1 — Modelo resuelto y banco de preguntas
description: Resolución del modelo de parcial (blanco) de Ingeniería de Datos I, con respuestas de las consignas visibles, preguntas del mismo estilo para completar los huecos, y un banco de práctica.
tags:
  - parcial
  - examen
  - indices
  - claves
  - sql
  - algebra relacional
  - uade
---

# Parcial 1 — Modelo resuelto y banco de preguntas

> Guía basada en el **"Parcial Blanco"** (modelo de examen) de la materia. Resuelve las consignas que trae el documento y **agrega preguntas del mismo estilo** para practicar los temas que el profe evalúa.

---

## Estructura del examen

| Parte | Contenido | Puntaje |
|-------|-----------|---------|
| **Teórica 1** | Desarrollar un concepto (ej. índices y claves). | 2 ptos |
| **Teórica 2** | 6 afirmaciones **Verdadero/Falso con justificación** (la incorrecta resta). | 0,5 c/u = 3 ptos |
| **Práctica Caso 1** | Identificar la **problemática** en códigos/representaciones y plantear la solución. | 2,5 ptos |
| **Práctica Caso 2** | Escribir **SQL** (crear tabla + operaciones). | 2,5 ptos |

**Reglas clave**: justificar SIEMPRE (sea V o F) · relacionar con las unidades de la cátedra · claridad y ortografía · mínimo 4 para aprobar.

> 🎯 **Datos del profe (anotaciones del parcial):**
> - **5 preguntas prácticas + 5 preguntas teóricas.**
> - En SQL importa la **estructura de la sentencia y los JOINs**, no tanto si "funciona" en un motor.
> - Entran **todos los temas**, con **énfasis en las filminas "adicional"**.
> - De **normalización**, hacer foco en las **primeras 3 formas normales** (1FN, 2FN, 3FN).

> ⚠️ Nota: el "blanco" deja en blanco la mitad de las consignas y trae una tabla "Aeropuertos" como imagen (que no pude leer). En esas partes **genero preguntas del mismo estilo** y lo marco con 🅰️ (respuesta modelo) y ✍️ (ejercicio generado).

---

## Parte Teórica

### 1. Índices y claves en Ingeniería de Datos *(2 ptos)* 🅰️

**Índices**: estructuras **auxiliares** que permiten localizar registros **rápidamente sin recorrer toda la tabla** (funcionan como el índice de un libro: dicen dónde está cada tema). Contienen **punteros** a las posiciones físicas de los registros.

| Índice | Descripción |
|--------|-------------|
| **Primario** | Sobre la **clave primaria**; suele ordenar físicamente el archivo; único. |
| **Clustered (agrupado)** | Ordena **físicamente** las filas según el índice. **Uno solo por tabla**. Bueno para rangos (fechas). Penaliza `INSERT/UPDATE/DELETE`. |
| **Secundario** | Sobre campos **no clave** (nombre, fecha, categoría). No ordena físicamente; puede haber varios. |
| **No agrupado (non-clustered)** | Estructura separada (árbol B o hash) con clave + puntero. Consume más espacio/E/S. |
| **Multinivel** | Jerarquía de índices (base de los **árboles B+**); eficiente en tablas muy grandes. |
| **Compuesto** | Usa 2+ columnas (ej. nombre + apellido). |
| **Único** | No permite duplicados (DNI, email). |
| **Hash** | Acceso directo por función hash; solo búsqueda **exacta** (no rangos). |

**Claves**: atributos que **identifican** registros y **relacionan** tablas.

| Clave | Descripción |
|-------|-------------|
| **Primaria (PK)** | Identifica de forma **única** cada tupla; **no puede ser nula**; una sola por tabla. |
| **Candidata** | Todo conjunto **mínimo** de atributos que podría ser PK (unicidad + minimalidad). Se elige una como PK; el resto quedan como **alternativas**. |
| **Foránea (FK)** | Referencia la **PK de otra tabla**; mantiene la **integridad referencial** (evita "huérfanos"). |
| **Compuesta** | PK formada por más de un atributo (ej. `id_alumno + id_curso`). |
| **Natural vs surrogada** | Natural = dato propio (DNI); surrogada = ID autoincremental (más estable). |

**Relación entre índices y claves**: al definir una **PK**, el SGBD crea automáticamente un **índice único** (y normalmente **clustered**) sobre ella. Las **FK** conviene **indexarlas** para acelerar los `JOIN`s. Elegir bien claves e índices impacta directamente en **integridad** (claves) y **rendimiento** (índices).

---

### 2. Verdadero/Falso con justificación *(0,5 c/u)*

#### 2.1 "Los sistemas de archivos evolucionaron para evitar redundancia de información." 🅰️

**FALSO.**
Los sistemas de archivos (planos) **no evitaban** la redundancia: al contrario, **eran su causa** (cada aplicación guardaba sus propios archivos y duplicaba datos). La evolución fue **desde** los sistemas de archivos **hacia** las bases de datos, que son las que **resuelven** la redundancia (mediante control centralizado y normalización). La frase invierte la relación causa-solución.

#### 2.2 "Las bases de datos NoSQL surgen por el volumen de datos creciente." 🅰️

**VERDADERO.**
NoSQL surge por el crecimiento masivo de datos (**Big Data**), la necesidad de **escalabilidad horizontal**, el manejo de datos **no estructurados/semiestructurados** y la **alta disponibilidad**, donde el modelo relacional (rígido, escalado vertical) quedaba limitado. No reemplaza a SQL, lo complementa.

#### 2.3 a 2.6 — Ejercicios generados en el mismo estilo ✍️

**2.3** "Un índice **clustered** ordena físicamente los datos, por lo que una tabla puede tener varios." →
**FALSO.** El clustered ordena físicamente las filas; como el orden físico es uno solo, **solo puede haber un índice clustered por tabla**. Los que pueden ser varios son los **secundarios/no agrupados**.

**2.4** "La clave primaria puede contener valores nulos si no hay otra forma de identificar el registro." →
**FALSO.** La PK **nunca** puede ser nula (integridad de entidad): debe identificar siempre a cada tupla. Para eso se usan claves **surrogadas** (ID autoincremental) si no hay un dato natural adecuado.

**2.5** "La propiedad **atomicidad** de ACID garantiza que los datos confirmados persistan aunque se corte la luz." →
**FALSO.** Que persistan ante fallos es **durabilidad**. La **atomicidad** es "todo o nada": o se ejecutan todos los pasos de la transacción o ninguno.

**2.6** "En SQL, el `INNER JOIN` equivale a una **selección sobre el producto cartesiano** de ambas tablas." →
**VERDADERO.** $A \bowtie B = \sigma_{A.pk = B.fk}(A \times B)$: se combinan todas las filas (producto cartesiano) y se filtran las que cumplen la condición de unión.

---

## Parte Práctica

### 3. Caso 1 — Identificar la problemática y solucionar *(2,5 ptos)*

> **Qué pide el profe**: analizar **todo lo que se pueda** — si el código/función **tiene sentido**, si hay **errores de sintaxis**, **qué hace** y cómo se corregiría.

#### 3.a Intersección de relaciones 🅰️

Dadas $R(A,B)$ y $S(B,A)$ y el resultado mostrado:

- $R = \{(2,5), (4,7), (9,10), (1,2)\}$
- $S = \{(2,1), (4,3)\}$ (¡columnas en orden **B, A**!)

**¿Qué se está realizando?** Una **intersección** (operación de conjunto del álgebra relacional), que requiere **compatibilidad de unión**: mismo número de atributos y mismos dominios **en el mismo orden**.

**Problemática (dos errores):**
1. **No son union-compatibles**: $R$ es $(A,B)$ pero $S$ es $(B,A)$. Antes de intersectar hay que **reordenar/renombrar** $S$ a $(A,B)$.
2. **El resultado es incorrecto**: el resultado mostrado $\{(2,5),(4,7),(9,10)\}$ es en realidad $R - S$ (la **diferencia**), no la intersección.

**Solución**: reordenar $S$ a $(A,B)$ → $S' = \{(1,2), (3,4)\}$, y luego intersectar:
$$R \cap S' = \{(1,2)\}$$
Solo la tupla $(1,2)$ es común a ambas.

#### 3.b Función con errores 🅰️

```sql
CREATE FUNCTION calcular_el10%(par_precio DECIMAL(10,2))
RETURNS DECIMAL(10,2)
BEGIN
    RETURN precio * 0.10;
END;
SELECT calcular_el90%( (precio_producto) FROM productos;
```

**¿Qué se está realizando?** Se define una **función escalar (UDF)** que calcula el 10% de un precio y se invoca dentro de un `SELECT`.

**Problemática (errores):**
1. **Nombre inválido**: `calcular_el10%` lleva `%`, que no es válido en un identificador.
2. **Variable indefinida**: el parámetro es `par_precio`, pero el cuerpo usa `precio`.
3. **Inconsistencia de nombre**: la llamada usa `calcular_el90%` y la función se llama `calcular_el10%`.
4. **Paréntesis extra y falta `;`**: `calcular_el90%( (precio_producto)` tiene un `(` de más y el `SELECT` no cierra con `;`.
5. *(En MySQL)*: faltaría `DELIMITER` para el `BEGIN…END`.

**Solución:**
```sql
CREATE FUNCTION calcular_el10(par_precio DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN par_precio * 0.10;
END;

SELECT calcular_el10(precio_producto) FROM productos;
```

#### 3.c y 3.d — Ejercicios generados en el mismo estilo ✍️

**3.c**
```sql
SELECT nombre, AVG(salario) FROM empleados;
```
**Problemática**: se mezcla una **columna simple** (`nombre`) con una **función agregada** (`AVG(salario)`) sin `GROUP BY` → resultado inconsistente/error.
**Solución**: `SELECT nombre, AVG(salario) FROM empleados GROUP BY nombre;` (o quitar `nombre` si solo interesa el promedio global).

**3.d**
```sql
CREATE TABLE pedidos (
  id INT,
  cliente VARCHAR(100),
  PRIMARY KEY (id),
  FOREIGN KEY (cliente) REFERENCES clientes(nombre)
);
```
**Problemática**: la `FOREIGN KEY` debe apuntar a la **clave primaria** de la tabla referenciada, no a un campo no-clave (`nombre`). Además `nombre` no garantiza unicidad.
**Solución**: referenciar la PK: `FOREIGN KEY (id_cliente) REFERENCES clientes(id)` (agregando la columna `id_cliente`).

---

### 4. Caso 2 — SQL sobre la tabla "Aeropuertos" *(2,5 ptos)*

> La tabla venía como imagen (no legible). Por las anotaciones del profe, este caso pide **funciones de agregación sobre la columna de pasajeros** ("mínimo de pasajeros", "diferencia entre el mayor y el menor"). Reconstruyo un esquema con `pasajeros`; ajustá las columnas a la imagen real.

**Tabla de ejemplo** (reconstrucción):

| id_aeropuerto | codigo_iata | nombre | ciudad | pasajeros |
|---------------|-------------|--------|--------|-----------|
| 1 | EZE | Ministro Pistarini | Ezeiza | 350000 |
| 2 | AEP | Jorge Newbery | Buenos Aires | 500000 |
| 3 | BRC | San Carlos de Bariloche | Bariloche | 120000 |
| 4 | TDL | Tandil | Tandil | 80000 |

#### 4.a Crear la estructura de la tabla 🅰️

```sql
CREATE TABLE aeropuertos (
  id_aeropuerto INT NOT NULL AUTO_INCREMENT,
  codigo_iata   VARCHAR(3)  NOT NULL,
  nombre        VARCHAR(100) NOT NULL,
  ciudad        VARCHAR(100) NOT NULL,
  pasajeros     INT NOT NULL,
  PRIMARY KEY (id_aeropuerto),
  UNIQUE KEY uq_iata (codigo_iata)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- `id_aeropuerto` = **PK** (surrogada, autoincremental).
- `codigo_iata` = **UNIQUE** (cada aeropuerto tiene un código IATA distinto, ej. `EZE`).
- `pasajeros` = número de pasajeros registrados (sobre esta columna van las **agregaciones**).

#### 4.b Operaciones — ejemplos que dio el profe 🅰️

```sql
-- Mínimo número de pasajeros registrados
SELECT MIN(pasajeros) AS minimo_pasajeros FROM aeropuertos;

-- Diferencia entre el máximo y el mínimo de pasajeros
SELECT MAX(pasajeros) - MIN(pasajeros) AS diferencia FROM aeropuertos;
```

#### 4.c Variantes del mismo estilo ✍️

```sql
-- Promedio de pasajeros
SELECT AVG(pasajeros) AS promedio FROM aeropuertos;

-- Total de pasajeros
SELECT SUM(pasajeros) AS total FROM aeropuertos;

-- Cuántos aeropuertos hay
SELECT COUNT(*) AS cantidad FROM aeropuertos;

-- Insertar aeropuertos
INSERT INTO aeropuertos (codigo_iata, nombre, ciudad, pasajeros)
VALUES ('EZE','Ministro Pistarini','Ezeiza',350000),
       ('AEP','Jorge Newbery','Buenos Aires',500000),
       ('BRC','San Carlos de Bariloche','Bariloche',120000);

-- Aeropuertos con más de 200.000 pasajeros
SELECT nombre, ciudad FROM aeropuertos
WHERE pasajeros > 200000
ORDER BY pasajeros DESC;

-- Pasajeros totales por ciudad (agrupación)
SELECT ciudad, SUM(pasajeros) AS total
FROM aeropuertos GROUP BY ciudad;

-- JOIN con vuelos (aeropuerto de origen)
SELECT v.id_vuelo, a.nombre AS origen
FROM vuelos AS v
INNER JOIN aeropuertos AS a ON v.id_aeropuerto_origen = a.id_aeropuerto;
```

**Tip de agregación**: "mínimo/máximo/promedio/total/cantidad" ⇒ funciones agregadas `MIN()`, `MAX()`, `AVG()`, `SUM()`, `COUNT()`. Si además se pide "por X", se agrega `GROUP BY X`.

---

## Banco de preguntas extra (mismo estilo)

### Más Verdadero/Falso con justificación

1. **"El hashing es ideal para búsquedas por rango de valores."** → **FALSO.** El hash da acceso directo por clave exacta; para **rangos** se usa un índice ordenado (árbol B+).
2. **"Toda clave primaria es una clave candidata, pero no toda clave candidata es primaria."** → **VERDADERO.** La PK se elige entre las candidatas; el resto quedan como alternativas.
3. **"La proyección (π) del álgebra relacional elimina las filas duplicadas."** → **VERDADERO.** Las relaciones son conjuntos (sin duplicados); SQL necesita `DISTINCT` para imitar eso.
4. **"Una tabla en 2FN no puede tener dependencias transitivas."** → **FALSO.** Eliminar transitivas es tarea de la **3FN**; la 2FN elimina dependencias **parciales**.
5. **"El `LEFT JOIN` devuelve todas las filas de la tabla izquierda, aunque no tengan coincidencia."** → **VERDADERO.** Las filas sin match devuelven `NULL` en las columnas de la derecha.
6. **"En una clave primaria compuesta, un atributo puede repetirse."** → **VERDADERO (con matiz).** Lo que no puede repetirse es la **combinación** completa; un atributo individual sí puede repetirse.

### Más "identificar la problemática"

1. `SELECT * FROM alumnos WHERE legajo = (SELECT legajo FROM alumnos);` → la subconsulta escalar devuelve **más de un valor**; usar `IN` o un filtro único.
2. `CREATE TABLE r (a INT, b INT, c INT, PRIMARY KEY (a, b));` con DF `b → c` → viola **2FN** (dependencia parcial); separar `c` a una tabla con PK `b`.
3. `SELECT nombre FROM empleados UNION SELECT nombre, edad FROM clientes;` → no son **union-compatibles** (distinta cantidad de columnas).

### Más "escribir el SQL"

1. *Listar los alumnos nacidos en Tandil reinscriptos en 2026* (3 tablas, 2 `INNER JOIN`) — ver **UVA 5, sección JOINs**.
2. *Crear una vista de los aeropuertos de Buenos Aires.*
3. *Los productos cuyo precio supera el precio promedio* (subconsulta escalar).
4. *Los clientes que no tienen pedidos* (`NOT EXISTS` / `LEFT JOIN ... WHERE IS NULL`).

---

## Banco ampliado — foco en las filminas "adicional"

> Preguntas extra armadas sobre el contenido de las filminas que el profe marcó (las que terminan en **"adicional"**): el ejemplo de JOIN con optimizador, las formas normales con sus ejemplos, el teorema de Rissanen, la tabla intermedia M:N y las funciones del sistema.

### A. Verdadero/Falso con justificación

1. **"En SQL, el orden en que escribo los `INNER JOIN` no cambia el resultado, porque el optimizador decide el orden físico."** → **VERDADERO.** El *query optimizer* usa las estadísticas de las tablas y elige el plan más eficiente; el orden escrito solo afecta la **legibilidad** (salvo motores muy viejos o *hints* como `STRAIGHT_JOIN`).

2. **"`ROUND()` redondea siempre hacia arriba y `CEILING()` hacia el entero más cercano."** → **FALSO.** Es al revés: `ROUND()` redondea al **más cercano**, `CEILING()` hacia **arriba**, `FLOOR()` hacia **abajo**, `ABS()` da el valor absoluto.

3. **"Una tabla puede estar en 2FN y aun así tener dependencias transitivas."** → **VERDADERO.** Son problemas independientes: 2FN ataca dependencias **parciales** (clave compuesta) y 3FN las **transitivas**. Una tabla puede tener ambas.

4. **"BCNF exige que, para toda dependencia funcional no trivial $X \to Y$, $X$ sea una superclave."** → **VERDADERO.** Es la definición de BCNF (más estricta que 3FN).

5. **"Una descomposición es sin pérdida si el atributo común entre las dos tablas es clave primaria en al menos una de ellas."** → **VERDADERO.** Es la condición práctica del **teorema de Rissanen**.

6. **"En una dependencia multivaluada $X \twoheadrightarrow Y$, los valores de $Y$ dependen de $X$ pero también de otros atributos."** → **FALSO.** La DMV significa que $Y$ depende de $X$ **independientemente** de los demás atributos (por eso hay que separarla en 4FN).

7. **"Las anomalías de inserción, actualización y eliminación son síntoma de una base mal normalizada."** → **VERDADERO.** Son justamente lo que la normalización busca eliminar.

8. **"En una relación N:M se crea una tabla intermedia cuya PK es la combinación de las claves foráneas."** → **VERDADERO.** Ej. `INSCRIPCIONES(id_estudiante, id_curso)` con PK compuesta.

9. **"Una entidad débil tiene clave primaria propia e independiente."** → **FALSO.** Depende de la entidad fuerte y su PK **incluye** la PK de la fuerte (ej. `LINEA_FACTURA(id_factura, nro_linea)`).

10. **"La clave foránea debe referenciar la clave primaria de la tabla referenciada."** → **VERDADERO.** Es lo que garantiza la integridad referencial.

### B. Identificar la problemática (y cómo solucionarla)

**B.1 — Violación de 2FN (la "tabla universal" del profe):**
```sql
CREATE TABLE inscripcion (
  id_alumno INT,
  id_curso  INT,
  nota      DECIMAL(4,2),
  nombre_alumno VARCHAR(100),
  PRIMARY KEY (id_alumno, id_curso)
);
```
**Problema**: `nombre_alumno` depende solo de `id_alumno` (parte de la clave compuesta) → **dependencia parcial** → no está en **2FN**.
**Solución**: separar `ALUMNO(id_alumno, nombre_alumno)` y dejar en `INSCRIPCION` solo `id_alumno, id_curso, nota`.

**B.2 — Violación de 3FN:**
```sql
CREATE TABLE empleado (
  id_empleado INT PRIMARY KEY,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10)
);
```
con `ciudad → codigo_postal`.
**Problema**: `codigo_postal` depende de `ciudad` (atributo no clave), no de `id_empleado` → **dependencia transitiva** → no está en **3FN**.
**Solución**: `CIUDADES(ciudad, codigo_postal)` y en `EMPLEADO` dejar solo `ciudad`.

**B.3 — Violación de BCNF (ejemplo del profe):**
```text
Tabla: (alumno, profesor, asignatura)
Claves candidatas: (alumno, profesor) → asignatura ; (alumno, asignatura) → profesor
DF: profesor → asignatura  (cada profesor dicta una sola materia)
```
**Problema**: `profesor` determina `asignatura` pero **no es superclave** (solo parte de una clave) → viola **BCNF**.
**Solución**: `PROFESOR_ASIGNATURA(profesor, asignatura)` + `ALUMNO_PROFESOR(alumno, profesor)`.

**B.4 — Violación de 4FN (ejemplo del profe):**
```text
Tabla: (agente, idioma, habilidad)
DMV: agente ↠ idioma ; agente ↠ habilidad  (independientes entre sí)
```
**Problema**: combinar idiomas y habilidades genera **combinaciones cruzadas sin sentido** → no está en **4FN**.
**Solución**: `AGENTE_IDIOMA(agente, idioma)` + `AGENTE_HABILIDAD(agente, habilidad)`.

**B.5 — JOIN sin condición (producto cartesiano):**
```sql
SELECT * FROM alumnos, cursos;
```
**Problema**: falta la condición de unión → devuelve el **producto cartesiano** (cada alumno × cada curso).
**Solución**: `SELECT * FROM alumnos a INNER JOIN cursos c ON a.id_curso = c.id_curso;`

**B.6 — Subconsulta escalar que devuelve varios valores:**
```sql
SELECT nombre FROM empleados WHERE salario = (SELECT salario FROM empleados);
```
**Problema**: la subconsulta `(SELECT salario FROM empleados)` devuelve **muchos valores**, no uno → error de comparación.
**Solución**: `WHERE salario = (SELECT MAX(salario) FROM empleados);` (o usar `IN`).

### C. Escribir el SQL (adicional)

**C.1 — El JOIN de 3 tablas (ejemplo del profe: alumnos nacidos en Tandil reinscriptos en 2026):**
```sql
SELECT a.id_alumno, a.nombre, c.nombre_ciudad, r.anio_academico
FROM alumnos AS a
INNER JOIN ciudades AS c       ON a.id_ciudad_nacimiento = c.id_ciudad
INNER JOIN reinscripciones AS r ON a.id_alumno = r.id_alumno
WHERE c.nombre_ciudad = 'Tandil' AND r.anio_academico = 2026;
```

**C.2 — Tabla intermedia M:N (adicional 02: ESTUDIANTE ↔ CURSO):**
```sql
CREATE TABLE ESTUDIANTE (
  id_estudiante INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);
CREATE TABLE CURSO (
  id_curso INT PRIMARY KEY,
  comision VARCHAR(50) NOT NULL
);
CREATE TABLE INSCRIPCIONES (
  id_estudiante INT,
  id_curso INT,
  fecha DATE NOT NULL,
  PRIMARY KEY (id_estudiante, id_curso),
  FOREIGN KEY (id_estudiante) REFERENCES ESTUDIANTE(id_estudiante) ON DELETE CASCADE,
  FOREIGN KEY (id_curso) REFERENCES CURSO(id_curso) ON DELETE CASCADE
);
```

**C.3 — CREATE TABLE con FK (1:N):**
```sql
CREATE TABLE clientes (
  id_cliente INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL
);
CREATE TABLE pedidos (
  id_pedido INT PRIMARY KEY AUTO_INCREMENT,
  fecha DATE NOT NULL,
  id_cliente INT NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);
```

**C.4 — Agregaciones con GROUP BY:**
```sql
-- Promedio de pasajeros por ciudad
SELECT ciudad, AVG(pasajeros) AS promedio
FROM aeropuertos
GROUP BY ciudad;

-- Ciudades con más de 300.000 pasajeros totales
SELECT ciudad, SUM(pasajeros) AS total
FROM aeropuertos
GROUP BY ciudad
HAVING SUM(pasajeros) > 300000;
```

**C.5 — Vista + procedimiento (de la práctica de magnitudes):**
```sql
CREATE VIEW vista_aeropuertos_grandes AS
SELECT nombre, ciudad, pasajeros
FROM aeropuertos WHERE pasajeros > 200000;

SELECT * FROM vista_aeropuertos_grandes ORDER BY pasajeros DESC;
```

### D. Desarrollar el concepto (teóricas tipo "desarrolle")

**D.1 — Hashing.** Técnica que convierte una clave en una posición (slot) mediante una función hash $h(k)$ para acceder en tiempo casi constante. Algoritmos: división ($h(k)=k \bmod m$), multiplicación, plegamiento. El problema son las **colisiones** (dos claves → mismo slot), que se resuelven con **encadenamiento** o **direccionamiento abierto**. Ideal para búsqueda exacta; no sirve para rangos (ahí va el árbol B+).

**D.2 — Normalización (1FN–2FN–3FN).** Proceso que reorganiza tablas para eliminar redundancia y anomalías. **1FN**: valores atómicos. **2FN**: sin dependencias parciales (atributos no clave dependen de toda la clave). **3FN**: sin dependencias transitivas. Se apoya en las **dependencias funcionales** $X \to Y$ y en la correcta elección de claves.

**D.3 — Teorema de Rissanen.** Valida que una descomposición sea **sin pérdida**: el `NATURAL JOIN` de las partes debe reconstruir exactamente la tabla original (sin perder datos ni crear registros fantasma). Condición práctica: el atributo común debe ser PK en al menos una de las tablas.

**D.4 — SGBD y niveles de abstracción.** El SGBD administra la BD (almacenamiento, consultas, concurrencia, seguridad, ACID). Se organiza en niveles **físico** (cómo se guarda), **lógico** (cómo se estructura) y **conceptual** (visión global / modelo ER), lo que da **independencia de datos** (física y lógica).

---

## Álgebra relacional: operaciones de conjunto (∪, ∩, −) con ejemplos

> Son las operaciones que el profe pide analizar (como el Caso 1.a del parcial). Para aplicar **∪, ∩ y −** las relaciones deben ser **union-compatibles**: misma cantidad de atributos y mismos dominios **en el mismo orden**.

| Operación | Símbolo | SQL | Resultado |
|-----------|---------|-----|-----------|
| Unión | $R \cup S$ | `UNION` | Tuplas en R **o** en S (sin duplicados). |
| Unión con duplicados | $R \cup S$ | `UNION ALL` | Igual pero **conserva duplicados**. |
| Intersección | $R \cap S$ | `INTERSECT` | Tuplas **comunes** a ambas. |
| Diferencia | $R - S$ | `EXCEPT` | Tuplas en R **pero no** en S. |
| Producto cartesiano | $R \times S$ | `CROSS JOIN` | Todas las combinaciones (n×m filas). |
| Join natural | $R \bowtie S$ | `INNER JOIN ... ON` | Combina por igualdad de atributos comunes. |

### Ejemplo resuelto (paso a paso)

Dadas las relaciones **union-compatibles**:

**R(A, B)** = {(1,2), (2,3), (4,5)} · **S(A, B)** = {(2,3), (4,5), (6,7)}

| Operación | Resultado | Explicación |
|-----------|-----------|-------------|
| $R \cup S$ | {(1,2), (2,3), (4,5), (6,7)} | Todas las tuplas de ambas, **sin repetir** (2,3) ni (4,5). |
| $R \cap S$ | {(2,3), (4,5)} | Solo las que están en **ambas**. |
| $R - S$ | {(1,2)} | Las de R que **no** están en S. |
| $S - R$ | {(6,7)} | Las de S que **no** están en R. |

### En SQL

```sql
-- Unión (sin duplicados)
SELECT * FROM R UNION SELECT * FROM S;
-- → (1,2),(2,3),(4,5),(6,7)

-- Unión (con duplicados)
SELECT * FROM R UNION ALL SELECT * FROM S;
-- → (1,2),(2,3),(4,5),(2,3),(4,5),(6,7)

-- Intersección
SELECT * FROM R INTERSECT SELECT * FROM S;
-- → (2,3),(4,5)

-- Diferencia (en R pero no en S)
SELECT * FROM R EXCEPT SELECT * FROM S;
-- → (1,2)
```

### "Identificar la problemática" (mismo estilo que el Caso 1.a)

**E.1 — Unión con columnas en distinto orden:**
```text
R(A,B) = {(1,2),(3,4)}        S(B,A) = {(2,1),(5,6)}
R ∪ S = (A,B) {(1,2),(3,4),(2,1),(5,6)}   ← ¿correcto?
```
**Problema**: `S` tiene las columnas en orden **(B,A)**, no **(A,B)** → no son **union-compatibles**. La fila `(2,1)` de S significa B=2, A=1; para unirla hay que **reordenar** S a (A,B) = {(1,2),(6,5)}.
**Solución correcta**: $R \cup S' = \{(1,2),(3,4),(6,5)\}$.

**E.2 — Intersección mal calculada:**
```text
R(A,B) = {(1,2),(2,3),(4,5)}      S(A,B) = {(2,3),(4,5),(6,7)}
R ∩ S = {(1,2),(2,3),(4,5)}   ← ¿correcto?
```
**Problema**: el resultado mostrado es **R completo**, no la intersección. La intersección solo incluye las tuplas **comunes**.
**Solución correcta**: $R \cap S = \{(2,3),(4,5)\}$.

**E.3 — Diferencia al revés:**
```text
R(A,B) = {(1,2),(2,3),(4,5)}      S(A,B) = {(2,3),(4,5),(6,7)}
R − S = {(6,7)}   ← ¿correcto?
```
**Problema**: `(6,7)` está en **S**, no en R, por lo que no puede aparecer en $R - S$. El resultado mostrado es $S - R$, no $R - S$.
**Solución correcta**: $R - S = \{(1,2)\}$.

### Truco para no equivocarse

- **Unión (∪)** = "todo lo que está en alguna de las dos" (sin repetir).
- **Intersección (∩)** = "lo que está en **ambas**".
- **Diferencia (−)** = "lo de la **primera** que NO está en la segunda" (el orden importa).
- **Compatibilidad**: verificar SIEMPRE que las columnas estén en el mismo orden y tipo antes de ∪, ∩ o −.

---

## Lo que no puede faltar antes del parcial

- **Índices**: tipos (primario/clustered/secundario/multinivel/hash) y **cuándo conviene cada uno**.
- **Claves**: PK / candidata / FK / compuesta / natural vs surrogada, e **integridad referencial**.
- **Evolución**: archivos planos → jerárquico/red → relacional → NoSQL (y por qué).
- **ACID** (atomicidad/consistencia/aislamiento/durabilidad) y qué es cada una.
- **Álgebra relacional**: σ, π, ∪, ∩, −, ×, ⨝ y su **traducción a SQL** (WHERE/SELECT/UNION/INTERSECT/EXCEPT/JOIN).
- **SQL**: `SELECT…FROM…JOIN…ON…WHERE…GROUP BY…ORDER BY`; DDL (`CREATE TABLE` con PK/FK); subconsultas y funciones.
- **Funciones agregadas**: `MIN()`, `MAX()`, `AVG()`, `SUM()`, `COUNT()` (y `GROUP BY` cuando se pide "por X").
- **Normalización (foco 1FN–2FN–3FN)**: dependencias funcionales (parcial/transitiva) y cómo corregir cada forma normal.
- **Estructura de la sentencia y los JOINs** (más que si el código "corre" en un motor específico).

---
