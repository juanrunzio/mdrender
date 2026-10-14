---
title: Lógica proposicional
---

# Lógica proposicional

Una **proposición** es una oración declarativa que es verdadera o falsa, pero no ambas.

## Conectivos

| $p$ | $q$ | $p \land q$ | $p \lor q$ | $p \to q$ | $p \leftrightarrow q$ |
|:---:|:---:|:-----------:|:----------:|:---------:|:---------------------:|
| V | V | V | V | V | V |
| V | F | F | V | F | F |
| F | V | F | V | V | F |
| F | F | F | F | V | V |

> [!note] Recordatorio
> $p \to q$ solo es falsa cuando $p$ es verdadera y $q$ es falsa.

## Equivalencias importantes

Leyes de De Morgan:

$$
\lnot(p \land q) \equiv \lnot p \lor \lnot q
\qquad
\lnot(p \lor q) \equiv \lnot p \land \lnot q
$$

Contrarrecíproca:

$$
p \to q \;\equiv\; \lnot q \to \lnot p
$$

> [!example] Ejemplo
> "Si llueve, me quedo en casa" equivale a "Si no me quedo en casa, no llueve".

## Cuantificadores

$$
\forall x\, P(x) \qquad \exists x\, P(x)
$$

$$
\lnot \forall x\, P(x) \equiv \exists x\, \lnot P(x)
$$

## Ejercicios

- [ ] Demostrar De Morgan con tabla de verdad
- [ ] Probar que $p \to q \equiv \lnot p \lor q$
- [ ] Negar $\forall x\, \exists y\, (x < y)$

Volver a la [[Bienvenida]].
