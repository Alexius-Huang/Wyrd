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
      const s = new Scope();
      const constInfo = s.createConstant('foo', DT.Num);
      it('creates constant in scope', () => {
        expect(constInfo.name).toBe('foo');
        expect(constInfo.type.isEqualTo(DT.Num)).toBeTruthy();
        expect(constInfo.isConst).toBeTruthy();
      });

      it('throws error when redeclaration', () => {
        expect(() => s.createConstant('foo', DT.Str))
          .toThrow('ParserError: Constant `foo` is already declared with type `Num`');

        expect(() => s.createMutableVariable('foo', DT.Str))
          .toThrow('ParserError: Constant `foo` is already declared with type `Num`');
      });
    });

    describe('Scope#createMutableVariable', () => {
      const s = new Scope();
      const constInfo = s.createMutableVariable('foo', DT.Num);
      it('creates mutable variable in scope', () => {
        expect(constInfo.name).toBe('foo');
        expect(constInfo.type.isEqualTo(DT.Num)).toBeTruthy();
        expect(constInfo.isConst).toBeFalsy();
      });

      it('throws error when redeclaration', () => {
        expect(() => s.createConstant('foo', DT.Str))
          .toThrow('ParserError: Variable `foo` is already declared with type `Num`');

        expect(() => s.createMutableVariable('foo', DT.Str))
          .toThrow('ParserError: Variable `foo` is already declared with type `Num`');
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

    describe('Scope#getVariable', () => {
      const s = new Scope();
      s.createConstant('foo', DT.Num);
      s.createMutableVariable('bar', DT.Str);
      const childScope = s.createChildScope('child-scope');
      childScope.createConstant('baz', DT.Bool);
      childScope.createMutableVariable('bazz', DT.ListOf(DT.Num));

      it('gets variable info from current scope', () => {
        const foo = s.getVariable('foo');
        expect(foo.name).toBe('foo');
        expect(foo.type.isEqualTo(DT.Num)).toBeTruthy();
        expect(foo.isConst).toBeTruthy();

        const bar = s.getVariable('bar');
        expect(bar.name).toBe('bar');
        expect(bar.type.isEqualTo(DT.Str)).toBeTruthy();
        expect(bar.isConst).toBeFalsy();

        const baz = childScope.getVariable('baz');
        expect(baz.name).toBe('baz');
        expect(baz.type.isEqualTo(DT.Bool)).toBeTruthy();
        expect(baz.isConst).toBeTruthy();

        const bazz = childScope.getVariable('bazz');
        expect(bazz.name).toBe('bazz');
        expect(bazz.type.isEqualTo(DT.ListOf(DT.Num))).toBeTruthy();
        expect(bazz.isConst).toBeFalsy();
      });

      it('gets variable info from parent scope', () => {
        const foo = childScope.getVariable('foo');
        expect(foo.name).toBe('foo');
        expect(foo.type.isEqualTo(DT.Num)).toBeTruthy();
        expect(foo.isConst).toBeTruthy();

        const bar = childScope.getVariable('bar');
        expect(bar.name).toBe('bar');
        expect(bar.type.isEqualTo(DT.Str)).toBeTruthy();
        expect(bar.isConst).toBeFalsy();
      });

      it('gets variable info from current scope which covers up the parent scope', () => {
        const childScope2 = s.createChildScope('test-child-scope-2');
        childScope2.createConstant('foo', DT.Bool);
        childScope2.createMutableVariable('bar', DT.Null);

        const foo = childScope2.getVariable('foo');
        expect(foo.name).toBe('foo');
        expect(foo.type.isEqualTo(DT.Bool)).toBeTruthy();
        expect(foo.isConst).toBeTruthy();

        const bar = childScope2.getVariable('bar');
        expect(bar.name).toBe('bar');
        expect(bar.type.isEqualTo(DT.Null)).toBeTruthy();
        expect(bar.isConst).toBeFalsy();
      });

      it('throws error when variable isn\'t declared throughout scope chain', () => {
        expect(() => s.getVariable('baz'))
          .toThrow('ParserError: Variable or Constant `baz` isn\'t found throughout the scope chain');
        expect(() => s.getVariable('bazz'))
          .toThrow('ParserError: Variable or Constant `bazz` isn\'t found throughout the scope chain');
      });
    });
  });
});
