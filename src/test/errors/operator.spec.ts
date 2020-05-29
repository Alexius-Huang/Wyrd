import { compile } from '../..';

describe('Error: Operator', () => {
  describe('Invalid Operator Actions', () => {
    it('throws error when using operator with unmatched input pattern', () => {
      const program1 = `\n1 + "2" + 3`;
      expect(() => compile({ program: program1 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Num` and `Str`');

      const program2 = `\n1 + 2 + "3"`;
      expect(() => compile({ program: program2 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Num` and `Str`');

      const program3 = `\n"1" + 2 + 3`;
      expect(() => compile({ program: program3 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Str` and `Num`');

      const program4 = `\n1 + ("2" + 3)`;
      expect(() => compile({ program: program4 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Str` and `Num`');

      const program5 = `\n(1 + "2") + 3`;
      expect(() => compile({ program: program5 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Num` and `Str`');  

      const program6 = `\n("1" + 2) + 3`;
      expect(() => compile({ program: program6 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Str` and `Num`');    

      const program7 = `\n(1 + 2) + "3"`;
      expect(() => compile({ program: program7 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Num` and `Str`');    

      const program8 = `\n"1" + (2 + 3)`;
      expect(() => compile({ program: program8 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Str` and `Num`');  

      const program9 = `\nfoo = 1\nfoo + "2"`;
      expect(() => compile({ program: program9 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Num` and `Str`');    

      const program10 = `\nfoo = 1\n"2" + foo`;
      expect(() => compile({ program: program10 }))
        .toThrow('ParserError: Invalid operation for operator `+` with operands of type `Str` and `Num`');    

      const program11 = `\n123 == "123"`;
      expect(() => compile({ program: program11 }))
        .toThrow('ParserError: Invalid operation for operator `==` with operands of type `Num` and `Str`');    

      const program12 = `\n123 == True`;
      expect(() => compile({ program: program12 }))
        .toThrow('ParserError: Invalid operation for operator `==` with operands of type `Num` and `Bool`');

      const program13 = `\n123 == Null`;
      expect(() => compile({ program: program13 }))
        .toThrow('ParserError: Invalid operation for operator `==` with operands of type `Num` and `Null`');
    });
  });
});
