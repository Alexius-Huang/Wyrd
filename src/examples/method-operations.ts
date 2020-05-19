const program = `\
# Define Using Arrow
def Num.add(x: Num): Num => this + x

# Define Using Block
def Num.subtract(x: Num): Num => this - x

# Invocation via 'Value'
123.add(456)

# Invocation via 'Type', should also specify main parameter as first parameter
Num.subtract(456, 123)


# Method Overloading - Define with different input pattern
def Num.add(x: Num, y: Num): Num => this + x + y
def Num.add(x: Num, y: Num, z: Num): Num => this + x + y + z

# Invoking overloaded method result in different kind of compilation
123.add(456, 789)
123.add(456, 789, 666)

# We can also use the invocation via Type way
Num.add(123, 456, 789)
Num.add(123, 456, 789, 666)


# Method Overriding - Whenever a typical method patten is declared, you need
# to explicitly address with 'override' keyword in order to override original declaration
override def Num.add(x: Num, y: Num): Num => this + x + y + 1

123.add(456, 789) # will now invoke the overrided version of the method

override def Num.add(x: Num, y: Num): Num => this + x + y + 2

123.add(456, 789) # will yet again invoke the overrided version of the method
`;

const compiled = `\
function Num_add(_this, x) {
  return _this + x;
}

function Num_subtract(_this, x) {
  return _this - x;
}

Num_add(123, 456);
Num_subtract(456, 123);
function Num_add_1(_this, x, y) {
  return _this + x + y;
}

function Num_add_2(_this, x, y, z) {
  return _this + x + y + z;
}

Num_add_1(123, 456, 789);
Num_add_2(123, 456, 789, 666);
Num_add_1(123, 456, 789);
Num_add_2(123, 456, 789, 666);
function Num_add_1$1(_this, x, y) {
  return _this + x + y + 1;
}

Num_add_1$1(123, 456, 789);
function Num_add_1$2(_this, x, y) {
  return _this + x + y + 2;
}

Num_add_1$2(123, 456, 789);
`;

export { program, compiled };
