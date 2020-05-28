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

    describe('Record#setProperty and Record#getProperty', () => {
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

    describe('Record#hasProperty', () => {
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

  describe('Scope-Record Manipulation', () => {
    describe('Scope#createRecrod', () => {
      it('creates Scope.Record object in current scope', () => {
        const s = new Scope();
        const record = s.createRecord('UserInfo');
        expect(record.name).toBe('UserInfo');
        expect(s.records.has('UserInfo')).toBeTruthy();
      });

      it('throws error when record is already declared in current scope', () => {
        const s = new Scope();
        s.createRecord('UserInfo');
        expect(() => s.createRecord('UserInfo'))
          .toThrow('ParserError: Record `UserInfo` is already declared in current scope');
      });

      it('safely creates Scope.Record object even if parent scope has the same name', () => {
        const s = new Scope();
        const childScope = s.createChildScope('test-child-scope');
        const recordParent = s.createRecord('UserInfo');
        const recordChild = childScope.createRecord('UserInfo');
        expect(recordChild.name).toBe(recordParent.name);
      });
    });

    describe('Scope#hasRecord', () => {
      const s = new Scope();
      const childScope = s.createChildScope('test-child-scope');
      s.createRecord('UserInfo');
      childScope.createRecord('UserAccount');

      it('returns `true` if record definition is in current scope', () => {
        expect(s.hasRecord('UserInfo')).toBeTruthy();
        expect(s.hasRecord('UserAccount')).toBeFalsy();
        expect(childScope.hasRecord('UserAccount')).toBeTruthy();
      });

      it('returns `true` if record definition is in parent scope', () => {
        expect(childScope.hasRecord('UserInfo')).toBeTruthy();
      });
    });

    describe('Scope#getRecord', () => {
      const s = new Scope();
      const childScope = s.createChildScope('test-child-scope');
      const record1 = s.createRecord('UserInfo');
      const record2 = childScope.createRecord('UserAccount');

      it('returns Scope.Record object if exists in current scope', () => {
        const result1 = s.getRecord('UserInfo');
        const result2 = childScope.getRecord('UserAccount');
        expect(result1).toBe(record1);
        expect(result2).toBe(record2);
        expect(result1).not.toBe(result2);
      });

      it('returns Scope.Record object if exists in parent scope', () => {
        expect(childScope.getRecord('UserInfo')).toBe(record1);
      });

      it('throws error when record isn\'t declared througout scope chain', () => {
        expect(() => s.getRecord('UserAccount'))
          .toThrow('ParserError: Record `UserAccount` isn\'t declared throughout scope chain');

        expect(() => s.getRecord('NonExistedRecord'))
          .toThrow('ParserError: Record `NonExistedRecord` isn\'t declared throughout scope chain')

        expect(() => childScope.getRecord('NonExistedRecord'))
          .toThrow('ParserError: Record `NonExistedRecord` isn\'t declared throughout scope chain')
      });
    });
  });
});
