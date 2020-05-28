import { Scope, ScopeVariable as Variable, DataType as DT } from '../../parser/utils';

describe('Scope Variable', () => {
  describe('Scope.Variable Class', () => {
    it('contains variable information', () => {
      const v = new Variable('foo', new DT('Num'));
      expect(v.name).toBe('foo');
      expect(v.type.isEqualTo(DT.Num)).toBeTruthy();
    });
  
    it('is defined as constant in default', () => {
      const v = new Variable('foo', new DT('Num'));
      expect(v.isConst).toBeTruthy();
    });  
  });

  describe('Scope-Variable Manipulation', () => {
    describe('Scope#createConstant', () => {
      it('creates constant in scope', () => {
        const s = new Scope();
        const constInfo = s.createConstant('foo', DT.Num);
        expect(constInfo.name).toBe('foo');
        expect(constInfo.type.isEqualTo(DT.Num)).toBeTruthy();
        expect(constInfo.isConst).toBeTruthy();
      });  
    });

    describe('Scope#createMutableVariable', () => {
      it('creates mutable variable in scope', () => {
        const s = new Scope();
        const constInfo = s.createMutableVariable('foo', DT.Num);
        expect(constInfo.name).toBe('foo');
        expect(constInfo.type.isEqualTo(DT.Num)).toBeTruthy();
        expect(constInfo.isConst).toBeFalsy();
      });
    });

    describe('Scope#hasVariable', () => {
      const s = new Scope();
      s.createConstant('foo', DT.Num);
      s.createMutableVariable('bar', DT.Str);
      const childScope = s.createChildScope('child-scope');
      childScope.createConstant('baz', DT.Bool);
      childScope.createMutableVariable('bazz', DT.ListOf(DT.Num));

      it('returns `true` if variable or constant is contained in current scope', () => {
        expect(s.hasVariable('foo')).toBeTruthy();
        expect(s.hasVariable('bar')).toBeTruthy();
        expect(s.hasVariable('baz')).toBeFalsy();
        expect(s.hasVariable('bazz')).toBeFalsy();
        expect(childScope.hasVariable('baz')).toBeTruthy();
        expect(childScope.hasVariable('bazz')).toBeTruthy();
      });

      it('returns `true` if variable or constant is contained in parent scope', () => {
        expect(childScope.hasVariable('foo')).toBeTruthy();
        expect(childScope.hasVariable('bar')).toBeTruthy();
      });
    });
  });
});
