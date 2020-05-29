import { compile } from '../..';
import { Scope, DataType as DT } from '../../parser/utils';
import { CompilerOptions } from '../../types';

describe('Error: Record', () => {
  const compilerOptions: CompilerOptions = {
    scopeMiddleware(): Scope {
      const s = new Scope();
      const record = s.createRecord('UserInfo');
      record
      .setProperty(DT.Str, 'name')
      .setProperty(DT.Num, 'age')
      .setProperty(DT.Bool, 'hasPet');

      s.createConstant('maxwell', new DT('UserInfo'));
      return s;
    }
  };

  describe('Declaration', () => {
    it('throws error when declaration of record missing its name', () => {
      const program = '\nrecord { Str name, Num age, Bool hasPet }';
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect to give the name of the record, instead got token of type: `lcurly`');
    });

    it('throws error when format is wrong', () => {
      const program1 = '\nrecord UserInfo\n';
      expect(() => compile({ program: program1 }))
        .toThrow('ParserError: Expect token of type `lcurly`, instead got: `newline`');

      const program2 = '\nrecord UserInfo { name Str }\n';
      expect(() => compile({ program: program2 }))
        .toThrow('ParserError: Expect record `UserInfo` to declare the type of the property first, instead got token of type `ident`');

      const program3 = '\nrecord UserInfo { Str name Num age }\n';
      expect(() => compile({ program: program3 }))
        .toThrow('ParserError: Expect more definition of record `UserInfo` to dilimited by comma, instead got token of type `builtin-type`');  
    });

    it('throws error when declaring empty record', () => {
      const program = '\nrecord UserInfo {}';
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect record declaration `UserInfo` is not blank');
    });

    it('throws error when redeclaring the record', () => {
      const program = `\nrecord UserInfo { Str name, Num age, Bool married }`;
      expect(() => compile({ program: program, ...compilerOptions }))
        .toThrow('ParserError: Cannot declare record `UserInfo`, since the name has already been used');
    });

    it('throws error when the name of the record conflict other entity', () => {
      const program1 = `\nUserInfo = "Maxwell"\nrecord UserInfo { Str name, Num age, Bool hasPet }`;
      expect(() => compile({ program: program1 }))
        .toThrow('ParserError: Cannot declare record `UserInfo`, since the name has already been used');

      const program2 = `\ndef UserInfo(x: Str): Str => x\nrecord UserInfo { Str name, Num age, Bool hasPet }`;
      expect(() => compile({ program: program2 }))
        .toThrow('ParserError: Cannot declare record `UserInfo`, since the name has already been used');
    });
  });

  describe('Literal', () => {
    it('throws error when missing any property', () => {
      const program1 = '\nUserInfo {}';
      expect(() => compile({ program: program1, ...compilerOptions }))
        .toThrow('ParserError: Expect to have property name of record `UserInfo`, instead got token of type `rcurly`');

      const program2 = '\nUserInfo { name: "Maxwell" }';
      expect(() => compile({ program: program2, ...compilerOptions }))
        .toThrow('ParserError: Property of record `UserInfo` is missing: `age`, `hasPet`');

      const program3 = '\nUserInfo { name: "Maxwell", age: 18 }';
      expect(() => compile({ program: program3, ...compilerOptions }))
        .toThrow('ParserError: Property of record `UserInfo` is missing: `hasPet`');

      const program4 = '\nUserInfo { hasPet: False, age: 18 }';
      expect(() => compile({ program: program4, ...compilerOptions }))
        .toThrow('ParserError: Property of record `UserInfo` is missing: `name`');

      const program5 = '\nUserInfo { hasPet: False, name: "Alexius" }';
      expect(() => compile({ program: program5, ...compilerOptions }))
        .toThrow('ParserError: Property of record `UserInfo` is missing: `age`');
    });

    it('throws error when property is assigned wrong type of value', () => {
      const program1 = '\nUserInfo { name: 18, age: "Maxwell", hasPet: True }';
      expect(() => compile({ program: program1, ...compilerOptions }))
        .toThrow('ParserError: Expect property `name` in record `UserInfo` to receive value of type `Str`, instead got value of type `Num`');

      const program2 = '\nUserInfo { name: "Maxwell", age: False, hasPet: 123 }';
      expect(() => compile({ program: program2, ...compilerOptions }))
        .toThrow('ParserError: Expect property `age` in record `UserInfo` to receive value of type `Num`, instead got value of type `Bool`');

      const program3 = '\nUserInfo { age: 18, hasPet: "True", name: "Maxwell" }';
      expect(() => compile({ program: program3, ...compilerOptions }))
        .toThrow('ParserError: Expect property `hasPet` in record `UserInfo` to receive value of type `Bool`, instead got value of type `Str`');
    });

    it('throws error when property name is not exist or is wrong', () => {
      const program1 = '\nUserInfo { name: "Maxwell", oldness: 18, hasPet: True }';
      expect(() => compile({ program: program1, ...compilerOptions }))
        .toThrow('ParserError: Property `oldness` isn\'t exist in definition of record `UserInfo`');

      const program2 = '\nUserInfo { name: "Maxwell", age: 18, married: True }';
      expect(() => compile({ program: program2, ...compilerOptions }))
        .toThrow('ParserError: Property `married` isn\'t exist in definition of record `UserInfo`');
    });

    it('throws error when key-value pair is not delimited by `colon`', () => {
      const program = '\nUserInfo { name "Maxwell", age: 18, hasPet: True }';
      expect(() => compile({ program: program, ...compilerOptions }))
        .toThrow('ParserError: Expect key-value pairs of record `UserInfo` to dilimited by `colon`, instead got token of type `string`');
    });
  });

  describe('Reference', () => {
    it('throws error when referencing property of non-record identity', () => {
      const program = `\nfoo = 123\nfoo->property`;
      expect(() => compile({ program }))
        .toThrow('ParserError: Type `Num` is not a kind of record');
    });

    it('throws error when referenced record property isn\'t declared in record', () => {
      const program = `\nmaxwell->nonExistingProperty`;
      expect(() => compile({ program: program, ...compilerOptions }))
        .toThrow('ParserError: Property `nonExistingProperty` isn\'t declared in record `UserInfo`');
    });
  });
});
