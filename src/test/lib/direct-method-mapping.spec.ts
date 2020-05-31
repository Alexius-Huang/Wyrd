import { compile } from '../..';

describe('@direct-method-mapping', () => {
  describe('@maps', () => {
    it('compiles the method name default without change if @maps lib tag is omitted', () => {
      const program = `\
import "./direct-method-mapping/Basic.lib.wyrd"
123.ex1()
`;
      const expected = `(123).ex1();\n`
      expect(compile({ program, dir: __dirname }).result).toBe(expected);
    });

    it('compiles the method name into compiled name if @maps lib tag is provided', () => {
      const program = `\
import "./direct-method-mapping/Basic.lib.wyrd"
123.ex2()
`;
      const expected = '(123).changedFromEx2();\n';
      expect(compile({ program, dir: __dirname }).result).toBe(expected);
    });  
  });

  describe('@params', () => {
    it('compiles method with input pattern `Void` if @params is omitted', () => {
      const program = `\
import "./direct-method-mapping/Basic.lib.wyrd"
123.ex1("Hello world!", True)
`;
      expect(() => compile({ program, dir: __dirname }))
        .toThrow('ParserError: Method for Num.ex1 with input pattern `Str.Bool` doesn\'t exist');
    });

    it('compiles method with input pattern according to the @params', () => {
      const program = `\
import "./direct-method-mapping/Basic.lib.wyrd"
123.ex3("Hello world!", True)
`;
      const expected = '(123).ex3(\'Hello world!\', true);\n'
      expect(compile({ program, dir: __dirname }).result).toBe(expected);
    });
  });

  describe('@returns', () => {
    it('compiles the output type identical to method receiver type if @returns is omitted', () => {
      const program = `\
import "./direct-method-mapping/Basic.lib.wyrd"
123.ex1().concat("Hi!")
`;
      expect(() => compile({ program, dir: __dirname }))
        .toThrow('ParserError: Invoking an undeclared method `Num.concat`');
    });

    it('compiles the output type according to the @returns', () => {
      const program = `\
import "./direct-method-mapping/Basic.lib.wyrd"
123.ex4().concat("Hi!")
`;
      const expected = '(123).ex4().concat(\'Hi!\');\n'
      expect(compile({ program, dir: __dirname }).result).toBe(expected);
    });
  });

  describe('Method Overloading', () => {
    it('supports method overloading which compiles according to different input pattern', () => {
      const program = `\
import "./direct-method-mapping/MethodOverloading.lib.wyrd"
123.example("Hello world!")
123.example(456)
123.example(789, 987)
`;
      const expected = `\
(123).result3('Hello world!');
(123).result1(456);
(123).result2(789, 987);
`;
      expect(compile({ program, dir: __dirname }).result).toBe(expected);
    });
  });

  describe('Generic Receiver Method Mapping', () => {
    it('supports generic receiver method mapping with generic input pattern and output', () => {
      const program = `\
import "./direct-method-mapping/GenericTypeMethod.lib.wyrd"
nums = [1 2 3]
strs = ["Hello" "World" "Wyrd"]
bools = [True False True]

nums.ex1(1)
strs.ex1("Programming")
bools.ex1(False)
`;
      const expected = `\
const nums = [1, 2, 3];
const strs = ['Hello', 'World', 'Wyrd'];
const bools = [true, false, true];
nums.ex1(1);
strs.ex1('Programming');
bools.ex1(false);
`;
      expect(compile({ program, dir: __dirname }).result).toBe(expected);
    });

    it('targets specific type on generic receiver method mapping', () => {
      const program = `\
import "./direct-method-mapping/GenericTypeMethod.lib.wyrd"
nums = [1 2 3]
nums.ex4(123)
`;
      const expected = `\
const nums = [1, 2, 3];
nums.ex4(123);
`;
      expect(compile({ program, dir: __dirname }).result).toBe(expected);

      const errorProgram = `\
import "./direct-method-mapping/GenericTypeMethod.lib.wyrd"
strs = ["Hello" "World" "Wyrd"]
strs.ex4("Programming")
`;
      expect(() => compile({ program: errorProgram, dir: __dirname }))
        .toThrow('ParserError: Method for List<Str>.ex4 with input pattern `Str` doesn\'t exist');
    });
  });
});
