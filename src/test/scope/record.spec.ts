import { Scope, ScopeRecord as Record, DataType as DT } from '../../parser/utils';

describe('Scope Record Object', () => {
  describe('Scope.Record Class', () => {
    describe('Initialization', () => {
      it('declares the name of the type of the record with no properties', () => {
        const record = new Record('UserInfo');
        expect(record.name).toBe('UserInfo');
        expect(record.type.isEqualTo(new DT('UserInfo'))).toBeTruthy();
      });
    });

    describe('Property Setting and Getting - Record#setProperty and Record#getProperty', () => {
      it('sets property with corresponding type of data', () => {
        const record = new Record('UserInfo');
        expect(record.propertySet.size).toBe(0);
        expect(record.setProperty(DT.Str, 'name')).toBe(record);
        expect(record.propertySet.size).toBe(1);
        expect(record.setProperty(DT.Num, 'age')).toBe(record);
        expect(record.propertySet.size).toBe(2);
        expect(record.setProperty(DT.Bool, 'hasPet')).toBe(record);
        expect(record.propertySet.size).toBe(3);
      });

      it('gets property with corresponding type of data via property name', () => {
        const record = new Record('UserInfo');
        record
          .setProperty(DT.Str, 'name')
          .setProperty(DT.Num, 'age')
          .setProperty(DT.Bool, 'hasPet');

        expect(record.getProperty('name')).toMatchObject({ name: 'name', type: DT.Str });
        expect(record.getProperty('age')).toMatchObject({ name: 'age', type: DT.Num });
        expect(record.getProperty('hasPet')).toMatchObject({ name: 'hasPet', type: DT.Bool });
      });

      it('throws error when setting existed property again', () => {
        const record = new Record('UserInfo');
        record.setProperty(DT.Str, 'name');
        expect(() => record.setProperty(DT.Num, 'name'))
          .toThrow('ParserError: Property `name` in `UserInfo` has already been declared');
      });

      it('throws error when getting inexisted property', () => {
        const record = new Record('UserInfo');
        record
          .setProperty(DT.Str, 'name')
          .setProperty(DT.Num, 'age')
          .setProperty(DT.Bool, 'hasPet');

        expect(() => record.getProperty('isMarried'))
          .toThrow('ParserError: Property `isMarried` isn\'t existed in definition of record `UserInfo`');
      });
    });

    describe('Check Existence of Specific Property - Record#hasProperty', () => {
      it('returns `true` if property is exist in record definition', () => {
        const record = new Record('UserInfo');
        record
          .setProperty(DT.Str, 'name')
          .setProperty(DT.Num, 'age')
          .setProperty(DT.Bool, 'hasPet');

        expect(record.hasProperty('name')).toBeTruthy();
        expect(record.hasProperty('info')).toBeFalsy();
        expect(record.hasProperty('age')).toBeTruthy();
        expect(record.hasProperty('gender')).toBeFalsy();
        expect(record.hasProperty('hasPet')).toBeTruthy();
      });
    });
  });

  describe.skip('Scope-Record Manipulation', () => {});
});
