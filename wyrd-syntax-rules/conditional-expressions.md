# Conditional Expressions

## Basic Syntax

Wyrd provide three kind of syntax for structuring conditional expressions.

### "One-Liner" If-Arrow Expression

If you want to directly output a value or a simple operation result, you can use the `if <condition> => <expression>` format of the conditional expression:

```text
age = 20

# Only If-Arrow Expression
if   age < 18 => "youngster"

# If-Else-Arrow Expression to output alternative value
if   age < 18 => "youngster"
else          => "adult"

# If-Else-If-Arrow Expression to chain more conditional expressions
if   age < 18 => "youngster"
elif age < 60 => "adult"
else          => "elder"
```

Notice that the `if <condition> ... else if ...` part, the keyword to chain the expression is simplified into `elif` keyword.

### "Single-Line-Block" If-Then Expression

The second conditional expression syntax style is the `if <condition> then ...` style. You will need to change to new line after the `then` keyword.

Notice that, `then` block **only evaluates single line expression as the result**, and since the `then` expression is block format, to close the expression, we need to use the `end` keyword.

```text
age = 20

# Only If-Then Expression
if age < 18 then
  "youngster"
end

# If-Else-Then Expression to output alternative value
if age < 18 then
  "youngster"
else then
  "adult"
end

# If-Else-If-Then Expression to chain more conditional expressions
if age < 18 then
  "youngster"
elif age < 60 then
  "adult"
else then
  "elder"
end
```

The compile result will be identical to the previous `if-arrow` conditional example in previous section.

### "Multi-Line Block" If-Do Expression

In Wyrd, if the content to be evaluated cannot easily be expressed in single-line, you can instead use the `do` block expression which it will use the last expression in the `do` block expression as return value.

```text
cond1 = True
cond2 = False

# Only the If-Do Expression
if cond1 do
  a = 123
  b = 456
  a + b    # <-- returns this result if condition is True
end

# If-Else-Do Expression
if cond1 do
  a = 123
  b = 456
  a + b    # <-- returns this result if condition is True
else do
  a = 789
  b = 987
  b - a    # <-- returns this result if condition is False
end

# If-Else-If-Do Expression
if cond1 do
  a = 123
  b = 456
  a + b    # <-- returns this result if cond1 is True
elif cond2 do
  a = 789
  b = 987
  b - a    # <-- returns this result if cond2 is True
else do
  a = 123
  b = 789
  a * b    # <-- returns this result if cond1 and cond2 are False
end
```

By inspecting the Wyrd compilation result, we can see that Wyrd automatically compiles the `do` block conditional expression using JavaScript IIFE \(Immediately Invoked Function Expression\). 

## Conditional Expression Returns Value

As described partially in the previous section, since most of the syntax in Wyrd are expressions, **it will return values**. In other words, we can do something like, for instance, assigning the evaluation result of conditional expression to a variable. 

> TODO: Advanced information about Wyrd - Most of the Wyrd program are expressions.

```text
age = 20

type = if   age < 18 => "youngster"
       else          => "adult"
```

```javascript
const age = 20;
const type = age < 18 ? 'youngster' : 'adult';
```

## If-Condition Must Receive Boolean Type

In JavaScript, values, such as number 0, empty string ... etc, are tend to be `false` if they are used as the condition in conditional statement:

```javascript
if (0) {
  console.log("It won't execute this!");
}
```

However, Wyrd strictly limited developers to only provide any expressions which returns value of type `Bool`. Hence, the following Wyrd program will throw error:

```text
someNumber = 0
foo = if someNumber => "is not Zero"
      else          => "is Zero"
```

```text
Expect conditional expression's condition should return `Bool` type, instead got: `Num`
```

If you want to check if something _is_ \(or _is not_\) 0, you should instead explicitly point out within the condition. Thus, the previous program example might need to adjust into:

```text
someNumber = 0
foo = if someNumber != 0 => "is not Zero"
      else               => "is Zero"
```

```javascript
const someNumber = 0;
const foo = someNumber !== 0 ? 'is not Zero' : 'is Zero';
```

## Return Type of Each Branch Must Be Identical

Since Wyrd is strongly typed programming language, it will automatically check each conditional branch's returned result.

If Wyrd found out that the return type of either one or more branches differ, then it will raise error:

```text
age = 20
if   age < 18 => "youngster"
elif age < 60 => "adult"
else          => False
```

```text
Expect values returned from different condition branch to be the same
```

> TODO: Error message might need to be more comprehensive, e.g. pointing out the branch where returned type differs.

## Conditional Expressions Without Else Part Returns "Maybe" Types

If a conditional expression lacks the `else` expression, since the condition might be `False`, it will instead return `Null` value in default. \(See [Variable Declarations](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/variable-declarations)\)

Hence, the return type of the conditional expression without `else` expression will return `maybe` type data. \(See [Built-in Types](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/built-in-types)\)

```text
age = 20
mutable type maybe Str = if age < 18 => "youngster"
```

```javascript
const age = 20;
let type = age < 18 ? 'youngster' : null;
```



