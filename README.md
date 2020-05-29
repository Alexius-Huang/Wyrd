# Wyrd

[![Build Status](https://travis-ci.org/Maxwell-Alexius/Wyrd-Lang.svg?branch=master)](https://travis-ci.org/Maxwell-Alexius/Wyrd-Lang) [![Coverage Status](https://coveralls.io/repos/github/Maxwell-Alexius/Wyrd/badge.svg?branch=master)](https://coveralls.io/github/Maxwell-Alexius/Wyrd?branch=master)

**Wyrd** is a toy programming language \(**but it is evolving in high speed**\) whose syntax is partially inspired by [Ruby lang](https://www.ruby-lang.org/en/) and follows the Functional Programming paradigm.

[**Check out new released Wryd documentation here!**](https://maxwell-alexius.gitbook.io/wyrd/)

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
* [Logical Comparison and Expression](https://github.com/Maxwell-Alexius/Wyrd-Lang#logical-comparison-and-expression) \(Legacy\)
* [Conditional Expression](https://github.com/Maxwell-Alexius/Wyrd-Lang#conditional-expression) \(Legacy\)
* [Method Invocation](https://github.com/Maxwell-Alexius/Wyrd-Lang#method-invocation) \(Legacy\)
* Functions \(Legacy\)
  * [Function Declaration as Expression](https://github.com/Maxwell-Alexius/Wyrd-Lang#function-declaration-as-expression)
  * [Function Declaration](https://github.com/Maxwell-Alexius/Wyrd-Lang#function-declaration)
  * [Function Overloading](https://github.com/Maxwell-Alexius/Wyrd-Lang#function-overloading)
  * [Function Invocation](https://github.com/Maxwell-Alexius/Wyrd-Lang#function-invocation)
  * [Override Function Declaration](https://github.com/Maxwell-Alexius/Wyrd-Lang#override-function-declaration)
* [Comment](https://github.com/Maxwell-Alexius/Wyrd-Lang#comment) \(Legacy\)

### Supported Syntax Rules

#### Logical Comparison and Expression

**Wyrd Code**

```text
True and False or not False
not False and True
not (False or True) and False

3 + 1 > 2
5 * 3 < 15 - 6 * 8
11 >= 7 + 7 or 3 <= (6 + 2) / 3
8 / (4 * 2) > 3 and not 1 + 2 * 3 == 7 or a + b / c * d != w - x * y
```

**Compiled Result**

```javascript
true && false || !(false);
!(false) && true;
!(false || true) && false;

3 + 1 > 2;
5 * 3 < 15 - (6 * 8);
11 >= 7 + 7 || 3 <= (6 + 2) / 3;
8 / (4 * 2) > 3 && !(1 + (2 * 3) === 7) || a + (b / c * d) !== w - (x * y);
```

#### Conditional Expression

**Wyrd Code**

```text
if age < 18 => "youngster"
else        => "adult"

example1 = if age < 18 => "youngster"
           else        => "adult"

example2 = if age < 18    => "youngster"
           elif age <= 60 => "adult"
           elif age < 100 => "elder"
           else           => "centenarian"

example3 = if age < 18 then
             "youngster"
           elif age <= 60 then
             "adult"
           elif age < 100 then
             "elder"
           else then
             "centenarian"
           end

mixed1 = if age < 18 then
           "youngster"
         elif age <= 60 => "adult"
         elif age < 100 then
           "elder"
         else => "centenarian"

mixed2 = if age < 18 => "youngster"
         elif age <= 60 then
           "adult"
         elif age < 100 => "elder"
         else then
           "centenarian"
         end
```

**Compiled Result**

```javascript
age < 18 ? 'youngster' : 'adult';
const example1 = age < 18 ? 'youngster' : 'adult';
const example2 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const example3 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const mixed1 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const mixed2 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
```

#### Method Invocation

**\[WIP\]**

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

#### Function Declaration as Expression

To declare one-liner function, we can use the `def ... => <Expression>` syntax:

**Wyrd Code**

```text
def addition(x: Num, y: Num): Num => x + y
def devilNumber: Num => 666
def complexArithmetic(w: Num, x: Num, y: Num, z: Num): Num => (x + y) * (z / w)
```

**Compiled Result**

```javascript
function addition(x, y) {
  return x + y;
}

function devilNumber() {
  return 666;
}

function complexArithmetic(w, x, y, z) {
  return (x + y) * (z / w);
}
```

#### Function Declaration

You can also declare block-level function using the `do` block:

**Wyrd Code**

```text
def addition(x: Num, y: Num): Num do
  x + y
end

def complexArithmetic(w: Num, x: Num, y: Num, z: Num): Num do
  a = x + y * z
  b = w - 2 / a + 1
  b
end
```

**Compiled Result**

```javascript
function addition(x, y) {
  return x + y;
}

function complexArithmetic(w, x, y, z) {
  const a = x + (y * z);
  const b = w - (2 / a) + 1;
  return b;
}
```

#### Function Overloading

Different from JavaScript, in Wyrd-Lang, you can declare function with same name but different input parameter pattern. It is so-called **Function Overloading**:

**Wyrd Code**

```text
def addition(x: Num, y: Num): Num => x + y
def addition(x: Num, y: Num, z: Num): Num => x + y + z

addition(1, 2, 3)
addition(1, 2)
```

**Compiled Result**

```javascript
function addition(x, y) {
  return x + y;
}

function addition_1(x, y, z) {
  return x + y + z;
}

addition_1(1, 2, 3);
addition(1, 2);
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

#### Override Function Declaration

Whenever you need to override **previously declared function with specific input type**, you must add `override` keyword before function declaration:

**Wyrd Code**

```text
def randomCalc(x: Num, y: Num): Num => x + y
randomCalc(1, 2)

override def randomCalc(x: Num, y: Num): Num => (x + y) * 2
randomCalc(1, 2)
```

**Compiled Result**

```javascript
function randomCalc(x, y) {
  return x + y;
}

randomCalc(1, 2);
function randomCalc$1(x, y) {
  return (x + y) * 2;
}

randomCalc$1(1, 2);
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

