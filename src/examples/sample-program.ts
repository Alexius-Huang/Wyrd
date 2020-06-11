const program = `\
mutable Num age = 1 + 2 * 3 + 4
Num adultBound = 18
Num elderBound = 60
Num centenarianBound = 100

Str stage = if age <= adultBound => "Teenager"
            elif age < elderBound then
              "Adult"
            elif age < centenarianBound => "Elder"
            else then
              "Centenarian"
            end

def funcA(x: Num, y: Num): Num => x + y
def funcB(x: Num, y: Num, z: Num): Num do
  Num foo = x + y
  Num bar = foo * z - x
  bar
end

funcA(1, 2)
funcB(1 + 2 * 3, 4 / 5 - 6, 7 + funcA(8, 9 + 10 * 11) / 12)
`;

const compiled = `\
let age = 1 + (2 * 3) + 4;
const adultBound = 18;
const elderBound = 60;
const centenarianBound = 100;
const stage = age <= adultBound ? 'Teenager' : (age < elderBound ? 'Adult' : (age < centenarianBound ? 'Elder' : 'Centenarian'));
function funcA(x, y) {
  return x + y;
}

function funcB(x, y, z) {
  const foo = x + y;
  const bar = foo * z - x;
  return bar;
}

funcA(1, 2);
funcB(1 + (2 * 3), 4 / 5 - 6, 7 + (funcA(8, 9 + (10 * 11)) / 12));
`;

export { program, compiled };
