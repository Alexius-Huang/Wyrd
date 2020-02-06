const program = `\
# Builtin Str methods
"Hello world".toStr()
"Hello world".upcase()
"Hello world".repeat(3)
"Hello world".at(3)
"Hello world".concat("Wyrd lang is awesome!")
"Hello world".indexOf("world")
"Hello world".split(" ")
"Hello world".rest(5)
"Hello world".between(6, 8)

# Builtin Num methods
123.toStr()

# Builtin Bool Methods
True.toStr()
`;

const compiled = `\
('Hello world').toString();
('Hello world').toUpperCase();
('Hello world').repeat(3);
('Hello world').charAt(3);
('Hello world').concat('Wyrd lang is awesome!');
('Hello world').indexOf('world');
('Hello world').split(' ');
('Hello world').slice(5);
('Hello world').slice(6, 8);
(123).toString();
(true).toString();
`;

export { program, compiled };
