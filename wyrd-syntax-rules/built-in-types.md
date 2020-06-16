# Built-in Types

## Primitives

### Numbers, Strings and Booleans

Primitive types are the basic data unit in Wyrd. These are numbers `Num`, strings `Str`, booleans `Bool`.

```text
Num luckyNumber = 14
Str greetings   = "Hello world!"
Bool isSexy     = True
```

```javascript
const luckyNumber = 14;
const greetings = 'Hello world!'
const isSexy = True
```

Notice that, Wyrd's **string must be surrounded by double-quotes**; on the other hand, Wyrd's **boolean must be either `True` or `False`**.

### Concept of "Empty" - Null

Special primitive type is `Null` which represents the concept of "empty".

```text
Null empty = Null
```

```javascript
const empty = null;
```

Differs from JavaScript, Wyrd's only use `Null` value to represent the concept of "empty", but do not introduce `undefined` value.

## List

### List Literal

`List` is a built-in type in Wyrd. It is represented as an **ordered** collection of data.

`List<element>` is a kind of generic type which is an advanced concept that will presented in other document section. However, in order to specify which kind of type of the element are stored into list, you need to specify inside the `<>` brackets.

```text
List<Num> fibSeries = [1 1 2 3 5 8 13 21]
```

```javascript
const fibSeries = [1, 1, 2, 3, 5, 8, 13, 21];
```

Notice that `List` literal is declared surrounding with brackets `[ ]` and you **don't need commas to separate between different data**.

### Encourages Homogeneous Typed List

List often can be either homogeneous \(which means a list can contain single type of data\) or heterogeneous \(which means a list can contain multiple type of data\).

In Wyrd, it is a default behavior in which `List` literal will throw error if that list contains two or more data type.

```text
[123 "Hello world" True Null]
```

```text
ParserError: Expect List to contain of type `Num`, instead mixed with type `Str`
```

Notice that the error message expects that the list is declared only contains the type `Num`. In other words, **the contained type of the list will be determined by the type of the first element**.

## Tuple

> 🚧Under Construction 🚧

## Maybe Types

> To Be Done: Maybe primitives, lists ... etc

