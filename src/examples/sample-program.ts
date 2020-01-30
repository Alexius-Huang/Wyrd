const program = `\
age = 1 + 2 * 3 + 4

stage = if age <= 18 => "Teenager"
        elif age < 60 then
          "Adult"
        elif age < 100 => "Elder"
        else then
          "Centenarian"
        end

def funcA(x: Num, y: Num): Num => x + y
def funcB(x: Num, y: Num, z: Num): Num do
  foo = x + y
  bar = foo * z - x
  bar
end
`;

const compiled = `\
const age = 1 + (2 * 3) + 4;
const stage = age <= 18 ? 'Teenager' : (age < 60 ? 'Adult' : (age < 100 ? 'Elder' : 'Centenarian'));
function funcA(x, y) {
  return x + y;
}

function funcB(x, y, z) {
  const foo = x + y;
  const bar = foo * z - x;
  return bar;
}

`;

export { program, compiled };
