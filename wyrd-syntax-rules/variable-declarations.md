# Variable Declarations

## Constant Declaration

We can use `=` sign to assign values and declare a new variable, however, the result will be compiled into JavaScript constant:

```text
foo = 123
```

Compiled result:

```javascript
const foo = 123;
```

Hence, constant forbidden reassignment:

```text
foo = 123
foo = 456
```

The sample code above throws error:

```text
ParserError: Constant `foo` cannot be reassigned
```

## Mutable Variables Declaration

In order to declare variables, Wyrd introduce a keyword `mutable` which let you declare variable that can be reassigned:

```text
mutable foo = 123
```

It will compiled into JavaScript with `let` variable declaration:

```javascript
let foo = 123;
```

Hence, reassignment is now permitted:

```text
mutable foo = 123
foo = 456
```

```javascript
let foo = 123;
foo = 456;
```

And of course, if you already declared a constant, redeclared as mutable variable throws error:

```text
foo = 123
mutable foo = 456
```

```text
ParserError: Constant `foo` cannot be redeclared as variable
```

## "maybe" Types Declaration

There are cases where you might need a variable to assign value represents the concept of **empty**. In Wyrd, everything about empty is represented as a primitive type of value `Null`. 

On the other hand, Wyrd introduced `maybe` types which can store either `Null` value or declared type. However, since the declared variable should have mutability, not only the keyword `maybe` involves, but also `mutable` keyword as well:

```text
mutable foo maybe Num = 123
foo = Null
foo = 456
```

```javascript
let foo = 123;
foo = null;
foo = 456;
```

Since mutable variables can also be assigned `Null`, instead of directly assigned with `Null`, we can just omit the assignment and skip to next line, it will automatically assign the `maybe` type with `Null` value.

```text
mutable foo maybe Num
```

```javascript
let foo = null;
```

