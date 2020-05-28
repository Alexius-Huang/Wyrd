import { DataType as DT, DataType } from '../../parser/utils';

describe('Data Type', () => {
  describe('Initialization', () => {
    it('constructs an object which represent name of the type', () => {
      const dt = new DT('Example');
      expect(dt.type).toBe('Example');
      expect(dt.nullable).toBeFalsy();
      expect(dt.isGeneric).toBeFalsy();
    });

    it('constructs an `maybe` type data', () => {
      const maybeType = new DT('Example', true);
      expect(maybeType.type).toBe('Example');
      expect(maybeType.nullable).toBeTruthy();
      expect(maybeType.isGeneric).toBeFalsy();
    });
  });

  describe('DataType#isEqualTo and DataType#isNotEqualTo', () => {
    it('compares the equality between two data types', () => {
      const dt1 = new DT('Num');
      const dt2 = new DT('Num');
      const dt3 = new DT('Str');

      expect(dt1.isEqualTo(dt2)).toBeTruthy();
      expect(dt1.isEqualTo(dt3)).toBeFalsy();
      expect(dt1.isNotEqualTo(dt2)).toBeFalsy();
      expect(dt1.isNotEqualTo(dt3)).toBeTruthy();
      expect(dt2.isEqualTo(dt1)).toBeTruthy();
      expect(dt3.isEqualTo(dt1)).toBeFalsy();
      expect(dt2.isNotEqualTo(dt1)).toBeFalsy();
      expect(dt3.isNotEqualTo(dt1)).toBeTruthy();
    });
  });

  describe('DataType#isAssignableTo and DataType#isNotAssignableTo', () => {
    it('checks the assignability between two data types', () => {
      const dt = new DT('Num');
      const maybeDT = new DT('Num', true);
      const nullDT = new DT('Null');
      expect(dt.isAssignableTo(new DT('Num'))).toBeTruthy();
      expect(dt.isAssignableTo(new DT('Num', true))).toBeTruthy();
      expect(dt.isAssignableTo(new DT('Null'))).toBeFalsy();
      expect(dt.isNotAssignableTo(new DT('Num'))).toBeFalsy();
      expect(dt.isNotAssignableTo(new DT('Num', true))).toBeFalsy();
      expect(dt.isNotAssignableTo(new DT('Null'))).toBeTruthy();

      expect(maybeDT.isAssignableTo(new DT('Num'))).toBeFalsy();
      expect(maybeDT.isAssignableTo(new DT('Num', true))).toBeTruthy();
      expect(maybeDT.isAssignableTo(new DT('Null'))).toBeFalsy();
      expect(maybeDT.isNotAssignableTo(new DT('Num'))).toBeTruthy();
      expect(maybeDT.isNotAssignableTo(new DT('Num', true))).toBeFalsy();
      expect(maybeDT.isNotAssignableTo(new DT('Null'))).toBeTruthy();

      expect(nullDT.isAssignableTo(new DT('Num'))).toBeFalsy();
      expect(nullDT.isAssignableTo(new DT('Num', true))).toBeTruthy();
      expect(nullDT.isAssignableTo(new DT('Null'))).toBeTruthy();
      expect(nullDT.isNotAssignableTo(new DT('Num'))).toBeTruthy();
      expect(nullDT.isNotAssignableTo(new DT('Num', true))).toBeFalsy();
      expect(nullDT.isNotAssignableTo(new DT('Null'))).toBeFalsy();
    });
  });

  describe('DataType#toNullable', () => {
    it('returns new maybe type version of the original type', () => {
      const dt = new DT('Num');
      const maybeDT = dt.toNullable();
      expect(dt.nullable).toBeFalsy();
      expect(maybeDT.nullable).toBeTruthy();
    });

    it('returns new maybe generic type version of the original generic type', () => {
      const dt = new DT('GenericExample');
      dt.newTypeParameter('param-1', new DT('Num'));
      dt.newTypeParameter('param-2', new DT('Str'));
      dt.newTypeParameter('param-3', new DT('Bool'));
      expect(dt.nullable).toBeFalsy();

      const result = dt.toNullable();
      expect(dt).not.toBe(result);
      expect(result.nullable).toBeTruthy();
      expect(result.getTypeParameter('param-1').type.isEqualTo(new DT('Num'))).toBeTruthy();
      expect(result.getTypeParameter('param-2').type.isEqualTo(new DT('Str'))).toBeTruthy();
      expect(result.getTypeParameter('param-3').type.isEqualTo(new DT('Bool'))).toBeTruthy();
    });
  });

  describe('DataType#newTypeParameter', () => {
    it('creates new type parameter and assigns corresponding data type', () => {
      const dt = new DT('GenericExample');
      dt.newTypeParameter('param-1', new DT('Num'));
      dt.newTypeParameter('param-2', new DT('Str'));

      expect(dt.typeParameterMap['param-1'].isEqualTo(new DT('Num'))).toBeTruthy();
      expect(dt.typeParameterMap['param-2'].isEqualTo(new DT('Str'))).toBeTruthy();
      expect(dt.typeParameters.length).toBe(2);
    });

    it('sets default type parameter with `Unknown` type if not provided', () => {
      const dt = new DT('GenericExample');
      dt.newTypeParameter('param');
      expect(dt.typeParameterMap['param'].isEqualTo(new DT('Unknown'))).toBeTruthy();
    });

    it('throws error when declaring duplicated type parameter', () => {
      const dt = new DT('GenericExample');
      dt.newTypeParameter('param', new DataType('Num'));
      expect(() => dt.newTypeParameter('param', new DataType('Str')))
        .toThrow('ParserError: Type parameter `param` has already declared in data type `GenericExample`');
    });
  });

  describe('DataType#getTypeParameter', () => {
    it('gets the corresponding type of the type parameter', () => {
      const dt = new DT('GenericExample');
      dt.newTypeParameter('param-1', new DT('Num'));
      dt.newTypeParameter('param-2', new DT('Str'));

      const tp1 = dt.getTypeParameter('param-1');
      const tp2 = dt.getTypeParameter('param-2');
      expect(tp1.type.isEqualTo(new DT('Num'))).toBeTruthy();
      expect(tp2.type.isEqualTo(new DT('Str'))).toBeTruthy();
      expect(tp1.name).toBe('param-1');
      expect(tp2.name).toBe('param-2');
      expect(tp1.order).toBe(1);
      expect(tp2.order).toBe(2);
    });

    it('throws error when accessing undeclared type parameter', () => {
      const dt = new DT('GenericExample');
      dt.newTypeParameter('param-1', new DT('Num'));
      expect(() => dt.getTypeParameter('param-2'))
        .toThrow('ParserError: Type `GenericExample` has no type parameter of name `param-2`');
    });
  });

  describe('DataType#hasTypeParameter', () => {
    it('checks if the DataType have any type parameters', () => {
      const dt = new DT('GenericExample');
      expect(dt.hasTypeParameters()).toBeFalsy();

      dt.newTypeParameter('param-1', new DT('Num'));
      dt.newTypeParameter('param-2', new DT('Str'));
      expect(dt.hasTypeParameters()).toBeTruthy();
    });
  });

  describe('DataType#applyTypeParametersFrom', () => {
    // TODO: introduce better solution to create generic type
    it('applies the value from other generic data type and creates a fulfilled type', () => {
      const targetDT = new DT('GenericExample');
      const genericTypeSlot1 = new DataType('param-1');
      const genericTypeSlot3 = new DataType('param-3');
      genericTypeSlot1.isGeneric = true;
      genericTypeSlot3.isGeneric = true;

      targetDT.newTypeParameter('param-1', genericTypeSlot1);
      targetDT.newTypeParameter('param-2', new DataType('Str'));
      targetDT.newTypeParameter('param-3', genericTypeSlot3);

      const fromDT = new DT('GenericExample');
      fromDT.newTypeParameter('param-1', new DT('Num'));
      fromDT.newTypeParameter('param-2', new DT('Str'));
      fromDT.newTypeParameter('param-3', new DT('Bool'));

      const result = targetDT.applyTypeParametersFrom(fromDT);
      expect(result.getTypeParameter('param-1').type.isEqualTo(new DT('Num'))).toBeTruthy();
      expect(result.getTypeParameter('param-2').type.isEqualTo(new DT('Str'))).toBeTruthy();
      expect(result.getTypeParameter('param-3').type.isEqualTo(new DT('Bool'))).toBeTruthy();
    });
  });
});
