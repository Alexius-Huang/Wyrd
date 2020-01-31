# Wyrd

[![Build Status](https://travis-ci.org/Maxwell-Alexius/Wyrd-Lang.svg?branch=master)](https://travis-ci.org/Maxwell-Alexius/Wyrd-Lang) [![Coverage Status](https://coveralls.io/repos/github/Maxwell-Alexius/Wyrd-Lang/badge.svg?branch=master)](https://coveralls.io/github/Maxwell-Alexius/Wyrd-Lang?branch=master)

**Wyrd** is a toy programmming language whose syntax is partially inspired by [Ruby lang](https://www.ruby-lang.org/en/) and follows the Functional Programming paradigm.

Wyrd programming language compiles its code into JavaScript. The primary goal would be to write Front-End code and Back-End code (NodeJS) using Wyrd programming language. I may want to try writing React (or Vue) component code using Wyrd lang if possible.

[**Wyrd**](https://en.wikipedia.org/wiki/Wyrd) is a concept in Anglo-Saxon culture roughly corresponding to *fate or personal destiny*. The word is ancestral to Modern English weird, which retains its original meaning only dialectically.

The cognate term in Old Norse is urðr, with a similar meaning, but also personalized as one of the Norns, Urðr and appearing in the name of the holy well Urðarbrunnr in [Norse mythology](https://en.wikipedia.org/wiki/Norse_mythology).

## Table of Content
- [Supported Syntax Rules](https://github.com/Maxwell-Alexius/Wyrd-Lang#supported-syntax-rules)
  - [Basic Assignment](https://github.com/Maxwell-Alexius/Wyrd-Lang#basic-assignment)
  - [Builtin Primitives](https://github.com/Maxwell-Alexius/Wyrd-Lang#builtin-primitives)
  - [Lists](https://github.com/Maxwell-Alexius/Wyrd-Lang#lists)
  - [Arithmetics](https://github.com/Maxwell-Alexius/Wyrd-Lang#arithmetics)
  - [Logical Comparison and Expression](https://github.com/Maxwell-Alexius/Wyrd-Lang#logical-comparison-and-expression)
  - [Conditional Expression](https://github.com/Maxwell-Alexius/Wyrd-Lang#conditional-expression)
  - [Function Declaration as Expression](https://github.com/Maxwell-Alexius/Wyrd-Lang#function-declaration-as-expression)
  - [Function Declaration](https://github.com/Maxwell-Alexius/Wyrd-Lang#function-declaration)
  - [Function Invocation](https://github.com/Maxwell-Alexius/Wyrd-Lang#function-invocation)

## Supported Syntax Rules
### Basic Assignment
**Wyrd Lang**
```
foo = 1
bar = 1 + 2 * 3 + 4
baz = 1 + (2 - 3) * 4
```

**Compiled Wyrd Code**

```js
const foo = 1;
const bar = 1 + (2 * 3) + 4;
const baz = 1 + ((2 - 3) * 4);
```

### Lists
**Wyrd Lang**
```
[1 2 3 4 5]
["Hello world" "Wyrd" "Lang" "is" "Awesome"]
[[1 2 3] [4 5 6] [7 8 9]]
[1 (2 + 3 * 4) (5 / (6 - 7)) 8 (9) 10]

def addition(x: Num, y: Num): Num => x + y
[1 addition(2, 3 + 4 * 5) 6 addition(7 / 8 - 9, 10)]
```

**Compiled Wyrd Code**
```js
[1, 2, 3, 4, 5];
['Hello world', 'Wyrd', 'Lang', 'is', 'Awesome'];
[[1, 2, 3], [4, 5, 6], [7, 8, 9]];
[1, 2 + (3 * 4), 5 / (6 - 7), 8, 9, 10];
function addition(x, y) {
  return x + y;
}

[1, addition(2, 3 + (4 * 5)), 6, addition(7 / 8 - 9, 10)];
```

### Builtin Primitives
**Wyrd Lang**
```
foo = 123
bar = "Hello world"
baz = True
nothing = Null
```

**Compiled Wyrd Code**
```js
const foo = 123;
const bar = 'Hello world';
const baz = true;
const nothing = null;
```

### Arithmetics
**Wyrd Lang**
```
1 + 2 * 3
1 * 2 + 3
1 + 2 * 3 + 4
1 * 2 + 3 * 4
1 * 2 + 3 - 4
1 + 2 / 3 * 4

(1 + 2) * 3
1 * (2 + 3)
(1 + 2) * (3 + 4)
(1 + (5 - 3)) * (10 / 5)
```

**Compiled Wyrd Code**
```js
1 + (2 * 3);
1 * 2 + 3;
1 + (2 * 3) + 4;
1 * 2 + (3 * 4);
1 * 2 + 3 - 4;
1 + (2 / 3 * 4);

(1 + 2) * 3;
1 * (2 + 3);
(1 + 2) * (3 + 4);
(1 + (5 - 3)) * (10 / 5);
```

### Logical Comparison and Expression
**Wyrd Lang**
```
True and False or not False
not False and True
not (False or True) and False

3 + 1 > 2
5 * 3 < 15 - 6 * 8
11 >= 7 + 7 or 3 <= (6 + 2) / 3
8 / (4 * 2) > 3 and not 1 + 2 * 3 == 7 or a + b / c * d != w - x * y
```

**Compiled Wyrd Code**
```js
true && false || !(false);
!(false) && true;
!(false || true) && false;

3 + 1 > 2;
5 * 3 < 15 - (6 * 8);
11 >= 7 + 7 || 3 <= (6 + 2) / 3;
8 / (4 * 2) > 3 && !(1 + (2 * 3) === 7) || a + (b / c * d) !== w - (x * y);
```

### Conditional Expression
**Wyrd Lang**
```
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

**Compiled Wyrd Code**
```js
age < 18 ? 'youngster' : 'adult';
const example1 = age < 18 ? 'youngster' : 'adult';
const example2 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const example3 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const mixed1 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const mixed2 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
```

### Function Declaration as Expression
**Wyrd Lang**
```
def addition(x: Num, y: Num): Num => x + y
def devilNumber: Num => 666
def complexArithmetic(w: Num, x: Num, y: Num, z: Num): Num => (x + y) * (z / w)
```

**Compiled Wyrd Code**
```js
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

### Function Declaration
**Wyrd Code**
```
def addition(x: Num, y: Num): Num do
  x + y
end

def complexArithmetic(w: Num, x: Num, y: Num, z: Num): Num do
  a = x + y * z
  b = w - 2 / a + 1
  b
end
```

**Compiled Wyrd Code**
```js
function addition(x, y) {
  return x + y;
}

function complexArithmetic(w, x, y, z) {
  const a = x + (y * z);
  const b = w - (2 / a) + 1;
  return b;
}
```

### Function Invocation
**Wyrd Code**
```
funcA("Hello world")
funcB(1, 2, 3)
funcC(1, 2, funcD(3, 4), 5)
funcE(1, funcF(2, 3, funcG(4)), 5)
funcI(1, (funcJ(2, 3) + 4) * funcK(5))
funcL(1 / (funcM(2, 3) - 4), 5)
funcN((1 - funcO(2) * 3) / 4, funcP(5))
```

**Compiled Wyrd Code**
```js
funcA('Hello world');
funcB(1, 2, 3);
funcC(1, 2, funcD(3, 4), 5);
funcE(1, funcF(2, 3, funcG(4)), 5);
funcI(1, (funcJ(2, 3) + 4) * funcK(5));
funcL(1 / (funcM(2, 3) - 4), 5);
funcN((1 - (funcO(2) * 3)) / 4, funcP(5));
```

## Maintainers
- [Maxwell-Alexius](https://github.com/Maxwell-Alexius)
