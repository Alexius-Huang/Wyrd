import { compile } from '../..';

describe('Error: Pipe Operation', () => {
  describe('Invalid Pipe Targets', () => {
    it('throws error when piped target is other than function or method invocation', () => {
      const program = '123 |> 456';
      expect(() => compile({ program }))
        .toThrow('Pipe operation do not accept token of type `number`')
    });

    it('throws error when identifier is unknown', () => {
      const program = '123 |> foo';
      expect(() => compile({ program }))
        .toThrow('Unknown identifier `foo` is used');
    });
  });

  describe('Invalid Function or Method Input Pattern', () => {
    it('throws error when function\'s input pattern didn\'t match', () => {
      const program1 = 'def add(x: Num, y: Num): Num => x + y\n123 |> add()';
      expect(() => compile({ program: program1 }))
        .toThrow('ParserError: Function `add` with input parameter `Num` isn\'t declared throughout scope chain');

      const program2 = 'def add(x: Num, y: Num): Num => x + y\n123 |> add(456, 789)';
      expect(() => compile({ program: program2 }))
        .toThrow('ParserError: Function `add` with input parameter `Num.Num.Num` isn\'t declared throughout scope chain');
    });

    it('throws error when method\'s input pattern didn\'t match', () => {
      const program1 = '"Hello world" |> Str.concat("hi", "how are you")';
      expect(() => compile({ program: program1 }))
        .toThrow('ParserError: Method for `Str.concat` with input pattern `Str.Str` doesn\'t exist');

      const program2 = '"Hello world" |> Str.concat()';
      expect(() => compile({ program: program2 }))
        .toThrow('ParserError: Method for `Str.concat` with input pattern `Void` doesn\'t exist');
    });
  });

  describe('Invalid Function or Method Invocation Format', () => {
    it('throws error when parameters aren\'t surrounded by parentheses', () => {
      const program1 = 'def add(x: Num, y: Num): Num => x + y\n123 |> add 123';
      expect(() => compile({ program: program1 }))
        .toThrow('ParserError: Expect function invocation\'s parameter to be nested by parentheses, instead got token of type: `number`');

      const program2 = '"Hello world" |> Str.concat "hi"';
      expect(() => compile({ program: program2 }))
        .toThrow('ParserError: Expect method invocation\'s parameter to be nested by parentheses, instead got token of type: `string`');
    });

    it('throws error when method invocation format is wrong', () => {
      const program1 = '"Hello world" |> Str concat("hi")';
      expect(() => compile({ program: program1 }))
        .toThrow('ParserError: Expect invoking method in pipe-operation token of type `dot`, instead got: `ident`');

      const program2 = '"Hello world" |> Str.("hi")';
      expect(() => compile({ program: program2 }))
        .toThrow('Expect invoking method in pipe-operation with the name of the method, instead got token of type: `lparen`');
    });

    it('throws error when receiver type isn\'t matched with piped method invocation receiver type', () => {
      const program1 = '123 |> Str.concat("Hello world")';
      expect(() => compile({ program: program1 }))
        .toThrow('Expect receiver in pipe-operation to have type `Str`, instead got type `Num`');

      const program2 = '123 |> Num.toStr() |> Num.toStr()';
      expect(() => compile({ program: program2 }))
        .toThrow('Expect receiver in pipe-operation to have type `Num`, instead got type `Str`');  
    });
  });

  describe('Invoking Undeclared Method', () => {
    it('throws error when piping undeclared method', () => {
      const program = '123 |> Num.undeclared()';
      expect(() => compile({ program }))
        .toThrow('ParserError: Invoking an undeclared method `Num.undeclared` during pipe operation');
    });
  });
});
