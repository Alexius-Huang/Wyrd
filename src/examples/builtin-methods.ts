const program = `\
# Builtin Str methods
"Hello world".toStr()
"Hello world".upcase()
"Hello world".repeat(3)

# Builtin Num methods
123.toStr()

# Builtin Bool Methods
True.toStr()
`;

const compiled = `\
('Hello world').toString();
('Hello world').toUpperCase();
('Hello world').repeat(3);
(123).toString();
(true).toString();
`;

export { program, compiled };
