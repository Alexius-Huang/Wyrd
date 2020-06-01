# Wyrd

[![Build Status](https://travis-ci.org/Maxwell-Alexius/Wyrd-Lang.svg?branch=master)](https://travis-ci.org/Maxwell-Alexius/Wyrd-Lang) [![Coverage Status](https://coveralls.io/repos/github/Maxwell-Alexius/Wyrd/badge.svg?branch=master)](https://coveralls.io/github/Maxwell-Alexius/Wyrd?branch=master)

**Wyrd** is a toy programming language \(**but it is evolving in high speed**\) whose syntax is partially inspired by [Ruby lang](https://www.ruby-lang.org/en/) and follows the Functional Programming paradigm.

[**Check out new released Wryd documentation here!**](https://maxwell-alexius.gitbook.io/wyrd/) ****🚧Under Construction 🚧

Wyrd programming language compiles its code into JavaScript. The primary goal would be to write Front-End code and Back-End code \(NodeJS\) using Wyrd programming language. I may want to try writing React \(or Vue\) component code using Wyrd lang if possible.

[**Wyrd**](https://en.wikipedia.org/wiki/Wyrd) is a concept in Anglo-Saxon culture roughly corresponding to _fate or personal destiny_. The word is ancestral to Modern English weird, which retains its original meaning only dialectically.

The cognate term in Old Norse is urðr, with a similar meaning, but also personalized as one of the Norns, Urðr and appearing in the name of the holy well Urðarbrunnr in [Norse mythology](https://en.wikipedia.org/wiki/Norse_mythology).

### Table of Content \[WIP\]

* [Variable Declarations](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/variable-declarations)
  * Constant Declaration
  * Mutable Variables Declaration
  * "maybe" Types Declaration
* [Built-in Types](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/built-in-types)
  * Primitives
    * Numbers, Strings and Booleans
    * Concept of "Empty" - Null
  * Lists
    * List Literal
    * Encourages Homogeneous Typed List
* [Arithmetics](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/arithmetics)
  * Arithmetic Expressions
  * Precedence
  * Prioritization
* [Logical Expressions](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/logical-expressions)
  * Comparison Operators
  * Comparison Operators Accept Identical Types Only
  * Logical Chaining
* [Conditional Expressions](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/conditional-expressions)
  * Basic Syntax
    * "One-Liner" If-Arrow Expression
    * "Single-Line-Block" If-Then Expression
    * "Multi-Line-Block" If-Do Expression
  * Conditional Expression Returns Value
  * If-Condition Must Receive Boolean Type
  * Return Type of Each Branch Must Be Identical
  * Conditional Expression Without Else Part Returns "Maybe" Types
* [Function Declaration](https://maxwell-alexius.gitbook.io/wyrd/wyrd-syntax-rules/function-declaration)
  * Components of Function's Declaration
  * Declaration Syntax
    * "Do-Block" Declaration
    * "One-Liner Arrow" Declaration
    * Functions Without Arguments
    * Returned Result Type Checking
  * Function Overriding
    * Function Redeclaration is Prohibited
    * Overriding Function
    * Before and After Override Function
    * Allows Change of Output Types
  * Function Overloading
    * Identical Function Name with Different Arguments Pattern
    * Overriding Overloaded Function
* [Method Invocation](https://github.com/Maxwell-Alexius/Wyrd-Lang#method-invocation) \(Legacy\)
* Functions \(Legacy\)
  * [Function Invocation](https://github.com/Maxwell-Alexius/Wyrd-Lang#function-invocation)
* [Comment](https://github.com/Maxwell-Alexius/Wyrd-Lang#comment) \(Legacy\)

### Supported Syntax Rules

#### Method Invocation

**Wyrd Code**

```text
# Builtin Methods for Primitives
"Hello world".repeat(3)
"Wyrd Lang is Awesome".upcase()
(1 + 2 * 3).toStr()

# Chained Invocation
"Hello".concat(" world").concat(", Wyrd-Lang!")

# Invocation as Parameter
"Hello".concat(" world".concat(", Wyrd-Lang!"))
```

**Compiled Result**

```javascript
('Hello world').repeat(3);
('Wyrd Lang is Aweseom').toUpperCase();
(1 + (2 * 3)).toString();
('Hello').concat(' world').concat(' , Wyrd-Lang!');
('Hello').concat((' world').concat(' , Wyrd-Lang!'));
```

#### Function Invocation

**Wyrd Code**

```text
funcA("Hello world")
funcB(1, 2, 3)
funcC(1, 2, funcD(3, 4), 5)
funcE(1, funcF(2, 3, funcG(4)), 5)
funcI(1, (funcJ(2, 3) + 4) * funcK(5))
funcL(1 / (funcM(2, 3) - 4), 5)
funcN((1 - funcO(2) * 3) / 4, funcP(5))
```

**Compiled Result**

```javascript
funcA('Hello world');
funcB(1, 2, 3);
funcC(1, 2, funcD(3, 4), 5);
funcE(1, funcF(2, 3, funcG(4)), 5);
funcI(1, (funcJ(2, 3) + 4) * funcK(5));
funcL(1 / (funcM(2, 3) - 4), 5);
funcN((1 - (funcO(2) * 3)) / 4, funcP(5));
```

#### Comment

**Wyrd Code**

```text
foo = 123 # Singleline comment

##
Multiline comment
##

bar = ## Comment between expression ## 456
```

**Compiled Result**

```javascript
const foo = 123;
const bar = 456;
```

### Maintainers

* [Maxwell-Alexius](https://github.com/Maxwell-Alexius)

