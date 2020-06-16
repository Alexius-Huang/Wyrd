# Arithmetics

## Arithmetic Expressions

In Wyrd, you can do simple calculations using operators:

* `+` for addition
* `-` for subtraction
* `*` for multiplication
* `/` for division

```text
Num sum        = 123 + 456
Num difference = 321 - 123
Num product    = 123 * 456
Num quotient   = 456 / 123
```

```javascript
const sum = 123 + 456;
const difference = 321 - 123;
const product = 123 * 456;
const quotient = 456 / 123;
```

> To Do: Support remainder operator %

## Precedence

When there are chained arithmetics operators, there will be evaluation precedence which follows common mathematic rule: **multiplications and divisions have higher precedence than additions and subtractions**.

```text
Num ex1 = 1 * 2 + 3 + 4
Num ex2 = 1 + 2 * 3 + 4
Num ex3 = 1 + 2 + 3 * 4
```

```javascript
const ex1 = 1 * 2 + 3 + 4;
const ex2 = 1 + (2 * 3) + 4;
const ex3 = 1 + 2 + (3 * 4);
```

## Prioritization

You can also use parentheses to override the precedence of the operators.

```text
Num ex1 = 1 * (2 + 3) + 4
Num ex2 = (1 + 2) * (3 + 4)
Num ex3 = (1 + 2 + 3) * 4
```

```javascript
const ex1 = 1 * (2 + 3) + 4;
const ex2 = (1 + 2) * (3 + 4);
const ex3 = (1 + 2 + 3) * 4;
```

The compilation result will mostly be the same as JavaScript code.

