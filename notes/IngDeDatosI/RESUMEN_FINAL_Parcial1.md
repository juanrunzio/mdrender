---
title: Resumen Final — Parcial 1 de Ingeniería de Datos I
description: Resumen conciso y orientado al examen. Blend del material del profe (PDF de filminas) y la guía completa por UVAs, con el formato real del parcial (teoría, V/F, álgebra, análisis de código y SQL).
tags:
  - parcial
  - examen
  - sql
  - algebra relacional
  - normalización
  - uade
---

# Resumen Final — Parcial 1 · Ingeniería de Datos I

> **Fuente**: blend del PDF del profe (material de examen) + guía completa por UVAs.
> **Formato del examen** (2 horas): teoría para desarrollar (2 ptos) + 6 V/F **siempre justificados** (0,5 c/u, la incorrecta resta) + 2 casos prácticos de análisis/escribir SQL (2,5 c/u). **5 prácticas + 5 teóricas en total. Entran todos los temas; de normalización, foco en 1FN/2FN/3FN.**
> **En SQL se evalúa la estructura de la sentencia y los JOINs, no si corre perfecto.** Claridad y ortografía también puntúan.

---

## 1. Evolución de las bases de datos

| Época | Modelo | Idea clave | Problemas |
|-------|--------|-----------|-----------|
| **1950–60** | **Sistemas de archivos** | Cada aplicación tiene sus propios archivos y programas | **Redundancia**, inconsistencia, dependencia de la aplicación, acceso difícil, sin integridad ni seguridad centralizadas |
| **1960–70** | **Jerárquicas y de red** | Árbol (un solo padre) / grafo (varios padres) | Mejoran el acceso pero son **rígidas** y complejas de gestionar |
| **1970** | **Relacionales** (Codd) | **Tablas** (relaciones), PK, SQL, independencia de datos | Modelo estándar |
| **Siglo XXI** | **NoSQL** | Big Data e Internet; **escalabilidad horizontal**, **esquema flexible**, rendimiento optimizado. **Complementa** (no reemplaza) a las relacionales | Consistencia eventual (BASE en vez de ACID) |

> 🎯 **V/F típica**: *"Los sistemas de archivos evolucionaron para evitar redundancia"* → **FALSO**: los sistemas de archivos **eran la causa** de la redundancia; las **BD** son las que la resuelven. *"NoSQL surge por el volumen creciente de datos"* → **VERDADERO** (Big Data + escalabilidad horizontal + esquema flexible).

**Beneficios de una BD**: control de **redundancia**, **consistencia** (reglas de validación), compartir datos entre usuarios, **seguridad** (permisos), **integridad** (exactitud y confiabilidad), control centralizado.

---

## 2. Índices y claves (la pregunta "desarrolle")

**Índice**: estructura de datos auxiliar que localiza registros rápido **sin recorrer la tabla completa** (como el índice de un libro); contiene punteros a las ubicaciones físicas.

| Tipo índice | Descripción |
|---|---|
| **Primario** | Sobre la **clave primaria**; identifica cada registro de forma única |
| **Clustered (agrupado)** | Ordena **físicamente** los registros según el índice → **solo uno por tabla** |
| **Secundario** | Sobre columnas **no clave** (apellido, ciudad); puede haber **varios** |
| **Multinivel** | Índices jerárquicos; eficiente en BD grandes (base de los **árboles B+**) |

**Clave**: atributo/s que identifican registros y establecen relaciones entre tablas.

| Tipo clave | Descripción |
|---|---|
| **Primaria (PK)** | Identifica de manera **única** cada fila; **no admite nulos**; una sola por tabla |
| **Candidata** | Conjunto **mínimo** que podría ser PK. Propiedades: **unicidad** + **minimalidad** (si quitando un atributo deja de identificar, sobraba). Solo una es PK, el resto quedan como **alternativas** |
| **Foránea (FK)** | Referencia la **PK de otra tabla**. Mantiene la **integridad referencial**: evita datos **huérfanos** (ej. inscripción para un alumno inexistente) |
| **Natural vs. subrogada** | Natural: dato del mundo real (DNI). Subrogada/artificial: id creado (`id_alumno`) — más **estable y compacta** |

**Cómo elegir PK**: **estable** (no cambia), **breve** (poco espacio), **única**, **comprensible**.

> 🔗 Vínculo índices–claves: al crear una PK el SGBD crea automáticamente un **índice único** (normalmente clustered); conviene **indexar las FK** para acelerar los JOIN.

**Hashing** (breve): convierte una clave en una **dirección/casillero** mediante una **función hash** → acceso directo sin recorrer registros. **Estático**: función y estructura fijas. **Dinámico**: se adapta al crecimiento de los datos. No sirve para búsquedas por rango (para eso, índice ordenado).

---

## 3. Modelos de BD y NoSQL

| Modelo | Estructura |
|---|---|
| **Orientado a objetos** | Objetos con atributos y métodos; identificación única de cada instancia |
| **Jerárquico / Red** | Árbol (1 padre) / grafo (varios padres) |
| **Relacional** | Tablas + claves; estándar dominante |
| **NoSQL** | Esquemas no estructurados, muy dinámicos y flexibles ("Not Only SQL") |

**Clasificación NoSQL**:
- **Clave–valor** → pares clave/valor → **Redis**
- **Documentos** → JSON → **MongoDB**
- **Columnas** → datos por columna → **Cassandra**
- **Grafos** → nodos y aristas → **Neo4j**

---

## 4. SGBD y ACID

**SGBD (Sistema de Gestión de BD)**: software que interactúa con la BD, los usuarios y las aplicaciones.

**Objetivos**: interfaz para crear/modificar la BD · almacenamiento y recuperación · **acceso concurrente** de múltiples usuarios · **seguridad e integridad**.

**Componentes clave**:
- **Motor de almacenamiento**: gestión física de los datos.
- **Procesador de consultas**: analiza, valida y optimiza peticiones (trabaja con SQL).
- **Manejo de transacciones**: garantiza **ACID**.
- **Subsistema de seguridad**: controla permisos de acceso.

**ACID** (reglas que aseguran transacciones seguras):

| Propiedad | Definición | Ejemplo (transferir 100 de Ana a Carlos) |
|---|---|---|
| **Atomicidad** | **Todo o nada**: o se ejecutan todos los pasos o ninguno | Se debita Ana Y se acredita Carlos, o nada |
| **Consistencia** | Los datos pasan de un **estado correcto a otro correcto**; cumplen las reglas | Se cancela si el saldo quedara negativo |
| **Aislamiento** | Transacciones concurrentes **no se interfieren**; nadie ve cambios a medias | Dos compran el último artículo → gana uno solo |
| **Durabilidad** | Lo confirmado **persiste** aunque se corte la luz | Tras COMMIT el cambio queda guardado |

- **COMMIT**: confirma y registra cambios · **ROLLBACK**: revierte, evitando operación incompleta.

**Criterios para elegir un SGBD**: tipo de datos (estructurados o no) · escalabilidad · rendimiento (lectura/escritura) · **costos** (software libre vs pago, mantenimiento y migración futura) · **soporte** (comunidad, soporte técnico, compatibilidad con lenguajes del proyecto).

---

## 5. Modelo relacional

Organiza datos en **tablas (relaciones)**. Una relación = subconjunto del **producto cartesiano de los dominios** de sus atributos.

| Elemento | Definición |
|---|---|
| **Relación** | Tabla, nombre único, representa una entidad |
| **Tupla** | Fila = registro individual |
| **Atributo** | Columna = característica |
| **Dominio** | Conjunto de **valores permitidos** para un atributo |

**Propiedades de una relación**: nombre único · atributos con nombre y dominio · **filas y columnas sin orden** · **no hay filas duplicadas** · en el modelo puro cada celda es un **valor atómico** (un solo valor).

**Tipos de atributos**:

| Clasificación | Tipos |
|---|---|
| Por composición | **Simple** (edad) / **Compuesto** (dirección → calle, número, ciudad) |
| Por cantidad de valores | **Monovalorado** (fecha nacimiento) / **Multivalorado** (teléfonos) |
| Por obtención | **Almacenado** / **Derivado** (edad, calculado desde la fecha de nacimiento) |

> Modelo relacional puro → atributos **simples y monovalorados**.

**Integridad**: de **entidad** (PK única y no nula) · **referencial** (todo valor de FK debe existir en la tabla referenciada) — evita registros inválidos, duplicados donde no corresponden y datos inexistentes.

---

## 6. DER (Diseño Entidad–Relación)

Representación gráfica de la estructura de datos: **entidades** (rectángulos), **atributos**, **relaciones** (rombos) con **cardinalidades**. Permite comunicar el diseño antes de implementar.

- **Entidades**: **físicas** (persona, empleado) o **conceptuales** (curso, cuenta). **Fuertes** (se identifican solas) / **débiles** (dependen de otra).
- **Atributos**: simples, compuestos, multivalorados; también la **clave**.
- **Relaciones**: asociaciones entre entidades; pueden tener atributos propios.

**Cardinalidad** (mínima, máxima — se lee poniéndola en la entidad receptora):

| Notación | Significado |
|---|---|
| (1,1) | Participación **obligatoria y única** |
| (0,1) | Opcional, a lo sumo una |
| (1,n) | Al menos una, puede ser varias |
| (0,n) | Opcional, puede ser varias |

**Cardinalidad 1:1 / 1:N / N:M**: 1:1 = una instancia ↔ una; 1:N = una del primer lado ↔ muchas; **N:M = muchas ↔ muchas**.

**Transformación DER conceptual → lógico** (tablas, columnas, claves, tipos, restricciones, normalización):

| Relación | Implementación |
|---|---|
| Entidad | → tabla; atributos → columnas; definir PK |
| **1:1** | → FK en una de las dos tablas |
| **1:N** | → FK en la tabla del **lado N** |
| **N:M** | → **tabla intermedia** con las FK de ambas; PK compuesta por ambas claves |

Ámbitos: **conceptual** (qué información, sin SGBD) → **lógico** (tablas/claves, puente hacia la implementación) → **físico** (cómo se guarda).

---

## 7. Álgebra relacional

Lenguaje **formal** de Codd (años 70); **base teórica de SQL**. Cada operación devuelve **otra relación** → se pueden anidar. Declarativo: dice **qué** obtener, no **cómo**.

**Operadores**: `= ≠ > < ≥ ≤` · `∧` (AND, ambas) · `∨` (OR, al menos una) · `¬` (NOT).

| Operación | Símbolo | Qué hace | SQL |
|---|---|---|---|
| **Selección** | σ | Filtra **filas** por condición (no cambia columnas) → $\sigma_{edad>25}(Alumnos)$ | `WHERE` |
| **Proyección** | π | Elige **columnas** → $\pi_{apellido,edad}(Alumnos)$ · **elimina duplicados** (las relaciones son conjuntos) | `SELECT` (con `DISTINCT`, porque SQL permite duplicados por defecto) |
| **Unión** | ∪ | Tuplas de R o S (sin duplicados) | `UNION` (o `UNION ALL` para conservar dup.) |
| **Intersección** | ∩ | Solo tuplas en ambas | `INTERSECT` |
| **Diferencia** | − | En R pero **no** en S. **El orden importa**: R−S ≠ S−R | `EXCEPT` |
| **Producto cartesiano** | × | Cada tupla de R con todas de S: n×m filas. Paso intermedio, sin comprobar correspondencia | `CROSS JOIN` / `FROM` sin ON |
| **Join** | ⨝ | Combina con una **condición** de unión | `JOIN ... ON` |
| **Renombramiento** | ρ | Alias de relación o atributo | `AS` |

**Compatibilidad de unión** (requisito para ∪, ∩, −): **misma cantidad de atributos** y dominios/tipos **compatibles, en el mismo orden**. Si no: usar **proyección o renombramiento** antes.
> Ejemplo de trampa: R(A,B) y S(B,A) **no son compatibles** hasta reordenar/renombrar S.

**JOINs**:

| JOIN | Devuelve |
|---|---|
| **Natural** | Igualdad de atributos de mismo nombre/dominio; **no repite** la columna común |
| **INNER** | Solo filas con coincidencia en **ambas**. Equivale a $\sigma_{e.depto\_id=d.id}(E \times D)$ |
| **LEFT** | Todas de la izquierda + coincidencias (`NULL` si no hay) |
| **RIGHT** | Todas de la derecha + coincidencias |
| **FULL OUTER** | Todas de ambas, rellenando con `NULL` |

> Los JOIN **externos** (LEFT/RIGHT/FULL) **no tienen equivalente directo** en álgebra relacional clásica (que no admite nulos).

**Tabla de correspondencia**: σ→WHERE · π→SELECT · origen→FROM · ∪→UNION · ∩→INTERSECT · −→EXCEPT · ×→CROSS JOIN · ⨝→JOIN...ON.

**Traducción expresión tipo**: `SELECT nombre FROM Empleados WHERE salario > 50000`
= $\pi_{nombre}\big(\sigma_{salario>50000}(Empleados)\big)$ → **conceptualmente primero se filtra (σ) y luego se proyecta (π)**.

**Subconsultas** (consulta dentro de otra; la interna se ejecuta primero):
- **No correlacionada**: independiente de la fila externa (ej. departamentos de Córdoba).
- **Correlacionada**: usa valores de la externa, fila por fila (ej. salario mayor que el **promedio de su propio departamento**).
- **Escalares**: un solo valor (comparar con `>` AVG) · **Multivalor**: lista → se usa con **IN**.
- No son excluyentes: una correlacionada puede ser escalar o multivalor.
- En álgebra se expresan **anidando operaciones**: la interna produce la relación de entrada de la externa.

---

## 8. SQL

Lenguaje estándar definido por la cátedra. Herramientas: **SQL Server 2022 Express** (gratis, para aprender) con **SSMS** (gráfica: administrar BD, ejecutar consultas, ver **plan de ejecución**). Alternativa: MySQL + phpMyAdmin/XAMPP.

### Subconjuntos del lenguaje

| Subconjunto | Comandos | Para qué |
|---|---|---|
| **DDL** (definición) | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` | Estructuras. `TRUNCATE` vacía registros **sin** la posibilidad de filtrar con WHERE |
| **DML** (manipulación) | `INSERT`, `SELECT`, `UPDATE`, `DELETE` | Datos. ⚠️ **Omitir WHERE en UPDATE/DELETE afecta todos los registros** |
| **DCL** (control) | `GRANT` (conceder), `REVOKE` (revocar) | Permisos |
| **TCL** (transacciones) | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | Confirmar / revertir / punto de recuperación |
| **DQL** (consulta) | `SELECT` | Recuperar datos |

### Estructura base de una consulta

```sql
SELECT columnas                     -- π (proyección)
FROM tabla1                         -- origen
  [JOIN tabla2 ON t1.pk = t2.fk]    -- ⨝ condición de unión SIEMPRE PK = FK
WHERE condiciones                   -- σ (selección)
[GROUP BY columna]                  -- agrupación (con funciones agregadas)
[ORDER BY columna [ASC|DESC]];      -- orden del resultado
```

### Funciones integradas

| Categoría | Funciones |
|---|---|
| **Cadena** | `UPPER()`, `LOWER()`, `LENGTH()`, `SUBSTRING()`, `TRIM()` (quita espacios de extremos), `CONCAT()` |
| **Fecha** | `CURRENT_DATE`, `NOW()`, `DATEADD()` (sumar/restar intervalo), `DATEDIFF()` (diferencia), `YEAR()`, `MONTH()` |
| **Matemáticas** | `ROUND()` (a n decimales, al cercano) · `CEILING()` (arriba) · `FLOOR()` (abajo) · `ABS()` (valor absoluto) |
| **Agregación** | `SUM()` (suma), `AVG()` (promedio), `MIN()`, `MAX()`, `COUNT()` — `COUNT(*)` cuenta filas, `COUNT(col)` cuenta no nulos |
| **Conversión** | `CAST()`, `CONVERT()` |

> 🎯 **Receta del caso práctico**: "mínimo/máximo/promedio/total" → `MIN`, `MAX`, `AVG`, `SUM`; "por X" → `GROUP BY X`; "diferencia entre el mayor y el menor" → `SELECT MAX(col) - MIN(col) FROM tabla;`

### Vistas

Consulta guardada que se comporta como **tabla virtual** (no almacena datos). Ventajas: reutilizar consultas, simplificar acceso, **limitar columnas visibles** (seguridad), segmentar por usuario. Desventajas: dependen de las tablas, **no todas son modificables**, por sí solas no garantizan seguridad.

```sql
CREATE VIEW ventas_2025 AS SELECT * FROM ventas WHERE anio = 2025;
-- luego se consulta como tabla: SELECT * FROM ventas_2025;
DROP VIEW ventas_2025;
```

### Procedimientos almacenados y funciones (UDF)

- **Procedure**: conjunto de instrucciones SQL guardado, ejecutable repetidamente. Parámetros: **IN** (entrada), **OUT** (salida), **INOUT** (entrada y salida modificada). Ventajas: reutilización, mantenimiento centralizado, automatización, seguridad (ejecutar sin permisos directos sobre tablas).
- **UDF**: como un procedure pero **siempre devuelve un valor** y se usa dentro de consultas (cálculos derivados, descuentos, categorización).

```sql
CREATE FUNCTION calcular_descuento(p_precio DECIMAL(10,2))
RETURNS DECIMAL(10,2)
BEGIN
  RETURN p_precio * 0.90;
END;
-- uso: SELECT calcular_descuento(precio) FROM productos;
```

### Seguridad en BD

Proteger contra **acceso no autorizado, modificaciones indebidas y pérdida de datos**. No basta con controlar quién entra: también **monitorear y auditar** el uso y administrar privilegios.

| Riesgo | Qué es |
|---|---|
| Acceso no autorizado | Sin los permisos correspondientes |
| **Inyección SQL** | Entrada del usuario mal validada/parametrizada altera la consulta (evitar con **consultas parametrizadas**) |
| Manipulación de privilegios | Permisos excesivos (admin a quien solo consulta) |
| Fuga/pérdida de información | Por accesos indebidos, errores, fallas o falta de backups |

**Buenas prácticas**: **mínimo privilegio** (solo el permiso necesario) · consultas parametrizadas · **auditar actividades** · proteger lo sensible · **copias de seguridad** · revisar permisos periódicamente. La seguridad **se diseña desde el principio**, no después.

---

## 9. Normalización (foco 1FN, 2FN, 3FN)

Proceso sistemático para **organizar la información, reducir redundancia y evitar anomalías**, dividiendo tablas con información mezclada en tablas menores relacionadas por claves. Teoría de **Codd** (años 70). Se aplica **progresivamente** mediante formas normales.

**Anomalías de una BD no normalizada**:
- **Actualización**: el dato repetido hay que cambiarlo en todas las filas; si una queda sin cambiar → inconsistencia.
- **Eliminación**: al borrar un registro se pierde otra información que se quería conservar.
- **Inserción**: no puedo agregar un dato sin registrar otro que aún no existe.

### Dependencias funcionales (DF)

$A \to B$ ("A determina funcionalmente a B"): cada valor de A tiene **un único** valor de B. Ej: `DNI → Nombre`.

| Tipo | Definición | Ejemplo |
|---|---|---|
| **Completa** | Depende de la clave compuesta **completa** | {id_alumno, id_curso} → nota_final |
| **Parcial** | Depende de **parte** de una clave compuesta → a eliminar para **2FN** | id_alumno → nombre_alumno, con PK (id_alumno, id_curso) |
| **Transitiva** | Depende de un no-clave que depende de la clave → **3FN** | id_curso → id_profesor → nombre_profesor |

### Formas normales

| FN | Regla | Elimina |
|---|---|---|
| **1FN** | Todos los atributos **atómicos**: cada celda un único valor, sin listas ni grupos repetitivos | Multivaluados (ej. teléfonos en una celda → tabla aparte) |
| **2FN** | 1FN + no hay **dependencias parciales**: los no-clave dependen de **toda** la clave candidata | Parciales (la info que depende de parte de la clave va a su propia tabla) |
| **3FN** | 2FN + no hay **dependencias transitivas** de no-clave respecto de la clave | Transitivas (crear tabla aparte) |

### "Tabla universal" del profe: las tres dependencias en una sola tabla

| 🔑 id_alumno | 🔑 id_curso | nota_final | nombre_alumno | id_profesor | nombre_profesor |
|---|---|---|---|---|---|

- DF **completa**: `{id_alumno, id_curso} → nota_final`.
- DF **parcial**: `id_alumno → nombre_alumno`.
- DF **transitiva**: `id_curso → id_profesor → nombre_profesor`.

> Normalizar no siempre es hasta 3FN: **transaccionales (OLTP)** priorizan integridad; **analíticos / data warehouses (OLAP)** admiten redundancia controlada para consultas de lectura intensiva.

### Avanzadas (saber definición, breve)

- **BCNF**: más estricta que 3FN. Para **toda DF no trivial X → Y, X debe ser superclave**. Cumplir BCNF ⇒ cumple 3FN (al revés no). Puede no convenir: más JOINs y consultas más lentas.
- **Teorema de Rissanen**: valida si una descomposición es **sin pérdida**: el JOIN reconstruye la tabla original **sin perder información ni generar registros fantasma**. Condición práctica: el atributo común debe ser **clave primaria en al menos una** de las dos tablas.
- **DF vs DMV**: DF $X\to Y$ = un único Y por X. **Multivaluada** $X\twoheadrightarrow Y$ = varios Y **independientes** del resto de los atributos.
- **4FN** = BCNF + sin DMV no triviales (ej. agente–idiomas–habilidades → dos tablas). **5FN** (proyección-unión) = casos donde se descompone en **tres o más** relaciones y solo se reconstruye con la unión de todas.
- **Desnormalización**: incorporar redundancia **deliberadamente** para rendimiento (menos JOINs, reportes más simples). **Primero se diseña bien y se mide; la desnormalización es una decisión posterior** si aporta mejora real. Riesgos: más redundancia, actualizaciones repetidas, inconsistencia.

---

## 10. Cheatsheet para los casos prácticos

### a) "Identifique la problemática, ¿qué hace?, ¿cómo lo solucionaría?"

**Checklist de análisis** (dejar constancia de todo, incluso lo correcto):
1. **¿Qué se está haciendo?** Nombrar la operación (intersección, UDF, JOIN, FK...).
2. **Compatibilidad de unión**: misma cantidad de columnas, dominios y **orden**. Si son (A,B) y (B,A) → renombrar/reordenar primero.
3. **¿El resultado es correcto?** Verificar operando por operando (∩ ≠ −; el **orden importa en la diferencia**).
4. **Identificadores válidos**: sin `%` ni caracteres raros en nombres de funciones/variables.
5. **Variables definidas**: el cuerpo usa el **nombre exacto del parámetro**.
6. **Nombre consistente**: la llamada coincide con la definición.
7. **Paréntesis y `;`** cerrados; en MySQL `DELIMITER //` para BEGIN...END.
8. **Agregados**: columnas simples y agregadas **sin GROUP BY** = error.
9. **FK**: referencia a la **PK** de la tabla referenciada, no a un campo cualquiera.
10. **Subconsultas escalares**: devolver un solo valor; sino usar IN/EXISTS.

**Errores clásicos ya aparecidos en el parcial:**
```sql
-- "Identificar la problemática (si la hay)":
- Intersección con relaciones no compatibles (orden de columnas) → renombrar/reordenar primero.
- `CREATE FUNCTION nombre%` → el `%` invalida el identificador; y el cuerpo usa `precio` cuando el parámetro se llama `par_precio` (variable indefinida).
- SELECT sin punto y coma, paréntesis sin cerrar → error de sintaxis
- SELECT nombre, AVG(salario) FROM empleados; → falta GROUP BY nombre
- FOREIGN KEY (cliente) REFERENCES clientes(nombre); → la FK debe referenciar la PRIMARY KEY
-- Soluciones:
- Reordenar/renombrar la relación y aplicar la operación correcta
- Identificadores sin '%'; usar el parámetro exacto; cerrar paréntesis y ';'
- GROUP BY en todo campo que convive con un agregado
- FK → apuntar a la PK de la tabla
```

**Ejemplo resuelto (función defectuosa)**:
```sql
-- MAL: nombre con %, variable indefinida, nombre inconsistente (10 vs 90), llamada mal escrita
CREATE FUNCTION calcular_el10%(par_precio DECIMAL(10,2))
RETURNS DECIMAL(10,2) BEGIN RETURN precio * 0.10; END;
SELECT calcular_el90%( (precio_producto) FROM productos;

-- BIEN:
CREATE FUNCTION calcular_el10(par_precio DECIMAL(10,2))
RETURNS DECIMAL(10,2)
BEGIN
  RETURN par_precio * 0.10;
END;

SELECT calcular_el10(precio_producto) FROM productos;
```

### b) "Escriba el SQL" — plantillas

```sql
-- 1. CREATE TABLE (caso "Aeropuertos")
CREATE TABLE aeropuertos (
  id_aeropuerto INT NOT NULL AUTO_INCREMENT,   -- clave subrogada
  codigo_iata   VARCHAR(3)  NOT NULL,
  nombre        VARCHAR(100) NOT NULL,
  ciudad        VARCHAR(100) NOT NULL,
  pasajeros     INT NOT NULL,
  PRIMARY KEY (id_aeropuerto),
  UNIQUE (codigo_iata)                          -- campo único no-clave
);

-- 2. Agregaciones (los ejemplos que pidió el profe)
SELECT MIN(pasajeros)  FROM aeropuertos;                -- mínimo registrado
SELECT MAX(pasajeros) - MIN(pasajeros)                 -- diferencia mayor-menor
       AS diferencia FROM aeropuertos;

-- 3. JOIN: marca la condición ON (PK = FK) — es lo que más mira el profe
SELECT a.nombre, c.nombre_ciudad
FROM alumnos AS a
INNER JOIN ciudades AS c ON a.id_ciudad_nacimiento = c.id_ciudad
WHERE c.nombre_ciudad = 'Tandil';

-- 4. JOIN de 3 tablas
SELECT a.id_alumno, a.nombre, c.nombre_ciudad, r.anio_academico
FROM alumnos AS a
INNER JOIN ciudades AS c        ON a.id_ciudad_nacimiento = c.id_ciudad
INNER JOIN reinscripciones AS r ON a.id_alumno = r.id_alumno
WHERE c.nombre_ciudad = 'Tandil' AND r.anio_academico = 2026;

-- 5. INSERT / UPDATE / DELETE (SIEMPRE con WHERE salvo insertar todo)
INSERT INTO aeropuertos (codigo_iata, nombre, ciudad, pasajeros)
VALUES ('EZE','Ministro Pistarini','Ezeiza',350000);
UPDATE aeropuertos SET pasajeros = pasajeros + 100 WHERE id_aeropuerto = 1;

-- 6. Vista
CREATE VIEW aeropuertos_bsas AS
SELECT * FROM aeropuertos WHERE ciudad = 'Buenos Aires';

-- 7. Procedimiento con parámetro y llamada (DELIMITER en MySQL)
DELIMITER //
CREATE PROCEDURE min_pasajeros_por_ciudad()
BEGIN
  SELECT ciudad, MIN(pasajeros) AS minimo
  FROM aeropuertos GROUP BY ciudad;
END //
DELIMITER ;
CALL min_pasajeros_por_ciudad();

-- 8. Subconsulta escalar y con IN
SELECT nombre FROM empleados
WHERE salario > (SELECT AVG(salario) FROM empleados);

SELECT nombre FROM empleados
WHERE depto_id IN (SELECT id FROM departamentos WHERE ciudad = 'Córdoba');

-- 9. Operadores de conjunto (mismas columnas y tipos compatibles)
SELECT nombre FROM empleados  UNION      SELECT nombre FROM ex_empleados;
SELECT id FROM empleados      INTERSECT  SELECT emp_id FROM asignaciones;
SELECT id FROM empleados      EXCEPT     SELECT emp_id FROM asignaciones;
```

### c) Álgebra relacional — ejemplos para practicar

| Consulta en SQL | Álgebra relacional |
|---|---|
| `SELECT nombre FROM Empleados WHERE salario > 50000;` | $\pi_{nombre}\big(\sigma_{salario>50000}(Empleados)\big)$ |
| `SELECT nombre FROM Empleados e JOIN Departamentos d ON e.depto_id = d.id WHERE d.ciudad='Córdoba';` | $\pi_{nombre}\Big(\sigma_{ciudad='Córdoba'}(Empleados \bowtie Departamentos)\Big)$ |
| Empleados activos **con** capacitación | `Activos ∩ Capacitados` |
| Empleados que **no** tienen capacitación | `Activos − Capacitados` (¡no al revés!) |
| Todos los alumnos de dos universidades | $\pi_{nombre}(A) \cup \pi_{nombre}(B)$ |

---

## 11. Banco de V/F con justificación (el 3 ptos más rentable)

> Regla de oro del examen: **SIEMPRE justificar, sea verdadero o falso** (la respuesta incorrecta **resta** puntaje). Entrénate para dar la respuesta correcta, así se ponen a los "trampas" comunes más abajo.

**¿Cómo justificar bien?** Nombrar el **concepto** de la cátedra que decide la respuesta + un ejemplo breve si ayuda. Ejemplo: "PR: nunca admite nulos por integridad de entidad; para eso se usan claves subrogadas".

| Afirmación | V/F | Justificación |
|---|-|---|
| Los sistemas de archivos evolucionaron para evitar redundancia | **F** | Los archivos **eran la causa** de la redundancia; las BD (control centralizado + normalización) la resuelven |
| NoSQL surge por el volumen de datos creciente | **V** | Big Data + escalabilidad **horizontal** + esquemas flexibles; complementa a SQL, no lo reemplaza |
| Una tabla puede tener varios índices clustered | **F** | Un clustered **ordena físicamente** las filas; el orden físico es único → **uno solo por tabla** |
| La PK puede admitir nulos si no hay otra forma de identificar | **F** | Integridad de entidad: la PK **nunca** puede ser nula; si falta un dato natural adecuado se usa la clave **subrogada** (id autoincremental) |
| La atomicidad de ACID garantiza que los datos persistan ante cortes de luz | **F** | Eso es **durabilidad**; atomicidad es **todo o nada** |
| En SQL, INNER JOIN equivale a una selección sobre el producto cartesiano | **V** | $\sigma_{pk=fk}(R × S)$: combinar todas las filas y filtrar por la condición de unión |
| El hashing es ideal para búsquedas por rango de valores | **F** | El hash da acceso **directo por clave exacta**; para **rangos** se usa un índice ordenado (árbol B+) |
| Toda PK es candidata, pero no toda candidata es PK | **V** | La PK se elige entre las **claves candidatas**; el resto quedan como alternativas |
| La proyección (π) elimina filas duplicadas | **V** | Las relaciones son **conjuntos**; en SQL hace falta `DISTINCT` para imitarlo |
| Una tabla en 2FN no puede tener dependencias transitivas | **F** | 2FN elimina **parciales**; las transitivas las elimina **3FN** |
| LEFT JOIN devuelve todas las filas de la izquierda, con NULL si no hay match | **V** | Es la definición de LEFT (externo izquierdo) |
| En una PK compuesta, un atributo individual puede repetirse | **V** | Lo que no puede repetirse es **la combinación completa** |
| BCNF exige que todo determinante sea superclave | **V** | Toda DF no trivial $X\to Y$ con X **superclave**; por eso es más estricta que 3FN |
| Descomposición sin pérdida: el atributo común debe ser PK en al menos una | **V** | Condición práctica del **teorema de Rissanen** (no perder info ni generar fantasma) |
| 4FN ataca dependencias multivaluadas; 5FN, dependencias de unión | **V** | DMV: varios Y **independientes** del resto; 5FN: descomposición y reconstrucción con **3 o más** proyecciones |
| R − S siempre es igual a S − R | **F** | La **diferencia** no es conmutativa: R−S ≠ S−R |
| Las consultas parametrizadas ayudan a prevenir la inyección SQL | **V** | Evitan que la entrada del usuario se concatene e interprete como parte de la consulta |
| UPDATE/DELETE sin WHERE afectan solo algunos registros | **F** | Sin WHERE afectan **todos los registros**; la tabla sigue existiendo. Para vaciar todo sin filtrar existe `TRUNCATE` (DDL), que tampoco admite WHERE |

---

## 12. Preguntas de teoría para "desarrolle"

**a) Concepto clásico: índices y claves** → las dos tablas de la sección 2 + vínculo: *al crear la PK se genera un índice único (clave/rendimiento); las FK conviene indexarlas para los JOIN.*

**b) Otras probables:**
- **SGBD: qué es, componentes y objetivos** → sección 4.
- **ACID** → sección 4, con el ejemplo de transferencia.
- **Evolución de los sistemas de datos** → sección 1.
- **Modelo relacional, elementos y propiedades** → sección 5.
- **DER: componentes y transformación al modelo lógico** → sección 6.
- **Álgebra relacional y su correspondencia con SQL** → sección 7 (tabla correspondencia + π/σ).
- **Normalización: por qué existe, anomalías y 1FN→3FN** → sección 9.
- **Seguridad: riesgos y buenas prácticas** → sección 8.

---

## 13. Checklist final antes de entrar

- [ ] Sé **desarrollar** índices y claves de memoria (tipos + criterios de elección de PK).
- [ ] Me salen **6 justificaciones V/F** de la tabla de la sección 11 (puedo reformularlas).
- [ ] Detecto **compatibilidad de unión** y diferencias ∩ / − / ∪ en tablas con columnas desordenadas.
- [ ] Encuentro errores típicos de una **UDF/proc** (identificador `%`, variable indefinida, llamada con otro nombre, `;` faltante).
- [ ] Reconozco: SELECT con **agregado + GROUP BY** · FK → PK · subconsulta escalar que devuelve muchos valores.
- [ ] Escribo de memoria: **CREATE TABLE** (PK + UNIQUE + FK con ON), agregaciones (MIN/MAX/AVG/SUM/COUNT), INNER/LEFT/RIGHT/FULL, UNION/INTERSECT/EXCEPT, CREATE VIEW, con o sin DELIMITER.
- [ ] Conozco las anomalías de la tabla no normalizada y la sección de **tabla universal** con las tres dependencias: completa / parcial / transitiva.
- [ ] Manejo **BCNF, Rissanen, 4FN, 5FN, desnormalización** a nivel de definición (saber decirlas).
