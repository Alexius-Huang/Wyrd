# Logical Expressions

## Comparison Operators

Operators relating to comparison are:

* `==`: Strict equality comparison operator
* `!=`: Strict inequality comparison operator
* `>`: "Greater Than" comparison operator
* `<`: "Less Than" comparison operator
* `>=`: "Greater Than or Equal To" comparison operator
* `<=`: "Less Than or Equal To" comparison operator

In JavaScript, equality comparison have two versions: `==` and `===` which the latter one is strict version of the equality comparison.

Hence, when using `==` in Wyrd, it will compiled into strict version of the code:

```text
"Hello world" == "Hello world"
```

```javascript
"Hello world" === "Hello world"
```

The returned result of logical operation will always return data of type `Bool`.

## Comparison Operators Accept Identical Types Only

When comparing two different type of data, Wyrd will throw error message:

```text
123 == "123"
```

```text
ParserError: Invalid operation for operator `==` with operands of type `Num` and `Str`
```

> TODO: This behavior may be override by using "operator overloading", currently this feature hasn't implemented yet

## Logical Chaining

Sometimes we would want more than one comparisons chained together using AND/OR or NOT relationships. Thus, Wyrd provides three keywords `and`, `or` and `not` to chain logical expressions. And of course, these keywords will be compiled in JavaScript which maps to `&&`, `||` and `!` operators.

```text
True and False or not False
not False and True
not (False or True) and False
```

And of course, you can chain not only `Bool` type values, you can chain multiple comparison operations:

```text
3 + 1 > 2
5 * 3 < 15 - 6 * 8
11 >= 7 + 7 or 3 <= (6 + 2) / 3
8 / (4 * 2) > 3 and not 1 + 2 * 3 == 7 or a + b / c * d != w - x * y
```

> TODO: [Handle Logical Expressions Where AND/OR and NOT Operation Should Only Accept Boolean Values](https://github.com/Maxwell-Alexius/Wyrd/issues/96)



