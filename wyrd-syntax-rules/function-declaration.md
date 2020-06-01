# Function Declaration

## Components of Function's Declaration

Function's declaration consists of several part:

* The **name** of the function
* The **arguments** of the function
* The **output type** of the function
* The **body** of the function

For instance, to declare a function `add` which add up two numbers:

* The name of the function is `add`
* There will be 2 arguments, both of them are `Num` type
* The output type will be `Num`
* The body part should define the process of addition

```text
def add(x: Num, y: Num): Num do
  x + y
end
```

## Declaration Syntax

### "Do-Block" Declaration

If the body of the function is a `do` block, you should always end it with the keyword `end`. On the other hand, the return value of the function will be evaluated by the last line in the body of the function, which means that the example:

```text
def example(x: Num, y: Num): Num do
  foo = x + y
  foo * 2
end
```

 Will be compiled into:

```javascript
function example(x, y) {
  const foo = x + y;
  return foo * 2;
}
```

### "One-Liner Arrow" Declaration

Similar to [conditional expressions](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/conditional-expressions) in Wyrd, if the body of the function is simple enough to express the evaluation result using only one line, you can choose to use the arrow syntax:

```text
def add(x: Num, y: Num): Num => x + y
```

### Functions Without Arguments

Sometimes function can declared without input arguments. In this case you don't need to also provide the parentheses, **only the output type is needed** after the name of the function:

```text
def greet: Str => "Hello world!"

# or

def greet: Str do
  "Hello world!"
end
```

> TODO: There's a bug where if you provide with empty parentheses, the compilation will stuck, [check out the issue](https://github.com/Maxwell-Alexius/Wyrd/issues/106).

### Returned Result Type Checking

If the function declared result aren't matched with the definition of the function, it will raise an error:

```text
def shouldReturnNumber: Num => "123"
```

```text
Return type of function `shouldReturnNumber` should be `Num`, instead got: `Str`
```

## Function Overriding

### Function Redeclaration is Prohibited

If a function \(along with its argument types and output types\) is declared twice, Wyrd will raise the error:

```text
def add(x: Num, y: Num): Num => x + y

# Declare function `add` with same input arguments
def add(a: Num, b: Num): Num => a + b
```

```text
ParserError: Overriding function `add` with existing input pattern `Num.Num`; to override the function, address it with `override` keyword before `def` token
```

By inspecting the error message, we can actually instead of declaring the function, we can explicitly **overriding** it.

### Overriding Function

To override a function, we just simply add the `override` keyword before the `def` keyword:

```text
def add(x: Num, y: Num): Num => x + y

# Declare function `add` with same input arguments
override def add(a: Num, b: Num): Num => a + b
```

The reason why Wyrd demand this approach is because, not only to express that the function actually has predeclared, but also developer choose to intentionally overriding it.

### Before and After Overrode Function

Wyrd will make sure that only after function overriding, the invoked function will be the overrode version.

```text
def greet(msg: Str): Str => msg

# Invokes the original version of the function
greet("I'm Max!")
# => I'm Max!

override def greet(msg: Str): Str do
  "Hello! ".concat(msg)
end

# Invokes the overrode version of the function
greet("I'm Max!")
# Hello! I'm Max!
```

### Allows Change of Output Types

One benefit of overriding a function might be the ability of changing the output type of the function:

```text
# Original Function
def add(x: Num, y: Num): Num do
  x + y
end

# Override Function
override def add(x: Num, y: Num): Str do
  (x + y).toStr()
end
```

However, you might also need to be cautious about this kind of practice since the change of output type might result modified behavior of program.

## Function Overloading

### Identical Function Name with Different Arguments Pattern

Similar to function overriding, instead **we can declare functions of same name with different input arguments type pattern**.

```text
# Input Pattern: Num.Num => Num
def add(x: Num, y: Num): Num do
  x + y
end

# Input Pattern Num.Num.Num => Num
def add(x: Num, y: Num, z: Num): Num do
  x + y + z
end
```

This technique is called **function overloading**. In this case, function can have more possible ways to be invoked:

```text
# Invokes the Num.Num => Num version
add(123, 456)

# Invokes the Num.Num.Num => Num version
add(123, 456, 789)
```

### Overriding Overloaded Function

You can also override the overloaded function, the rule is the same as in overriding normal functions. Whenever there is an overloaded version of the function already been declared, to override it, you should add `override` keyword before the `def` keyword:

```text
def greet(msg: Str): Str => msg

# Overloaded Version
def greet(prefix: Str, msg: Str): Str do
  prefix.concat(", ").concat(msg)
end

# Override the overloaded version
override def greet(prefix: Str, msg: Str): Str do
  prefix.concat("! ").concat(msg)
end
```

