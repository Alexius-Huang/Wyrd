import { Scope, ScopeFunctionObject as FunctionObject, DataType as DT, Parameter } from '../../parser/utils';

describe('Scope Function Object', () => {
  describe('Scope.FunctionObject Class', () => {
    it('declares new function by providing the name of the function', () => {
      const funcObj = new FunctionObject('addition');
      expect(funcObj.name).toBe('addition');
      expect(funcObj.patterns).toMatchObject([]);
      expect(funcObj.patternIndex).toBe(0);
    });

    describe('Function Input/Output Pattern', () => {
      const funcObj = new FunctionObject('addition');
      const pattern = funcObj.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);

      it('creates new function input/output pattern', () => {
        expect(pattern.returnDataType.isEqualTo(DT.Num)).toBeTruthy();
        expect(pattern.name).toBe('addition');
      });

      it('gets function pattern via parameter input', () => {
        const result = funcObj.getPatternInfo(Parameter.of(DT.Num, DT.Num));
        expect(result).toMatchObject(pattern);
      });

      it('returns undefined when input pattern isn\'t recognized', () => {
        const result = funcObj.getPatternInfo(Parameter.of(DT.Num));
        expect(result).toBeUndefined();
      });
    });

    describe('Pattern\'s Behaviour When Overloading Function', () => {
      const funcObj = new FunctionObject('addition');
      const pattern1 = funcObj.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
      const pattern2 = funcObj.createNewPattern(Parameter.of(DT.Str, DT.Str), DT.Str);
      const pattern3 = funcObj.createNewPattern(Parameter.of(DT.Num, DT.Num, DT.Num), DT.Num);

      it('gets different pattern via parameter input', () => {
        const result1 = funcObj.getPatternInfo(Parameter.of(DT.Str, DT.Str));
        expect(result1).toMatchObject(pattern2);

        const result2 = funcObj.getPatternInfo(Parameter.of(DT.Num, DT.Num, DT.Num));
        expect(result2).toMatchObject(pattern3);

        const result3 = funcObj.getPatternInfo(Parameter.of(DT.Num, DT.Num));
        expect(result3).toMatchObject(pattern1);
      });

      it('has different pattern name when overloading', () => {
        expect(pattern1.name).toBe('addition');
        expect(pattern2.name).toBe('addition_1');
        expect(pattern3.name).toBe('addition_2');
      });
    });

    describe('Pattern\'s Behaviour When Overriding Function', () => {
      it('has new compiled function name after invoking `override` method on pattern object', () => {
        const funcObj = new FunctionObject('addition');
        const pattern = funcObj.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
        expect(pattern.name).toBe('addition');
        pattern.override();
        expect(pattern.name).toBe('addition$1');
        pattern.override();
        expect(pattern.name).toBe('addition$2');  
      });
    });

    describe('Pattern\'s Behaviour When Overloading and Overriding Function in meanwhile', () => {
      it('has new compiled function name mixed with overload and override naming convention', () => {
        const funcObj = new FunctionObject('addition');
        const pattern1 = funcObj.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
        const pattern2 = funcObj.createNewPattern(Parameter.of(DT.Str, DT.Str), DT.Str);
        const pattern3 = funcObj.createNewPattern(Parameter.of(DT.Num, DT.Num, DT.Num), DT.Num);

        pattern1.override();
        expect(pattern1.name).toBe('addition$1');
        pattern2.override();
        expect(pattern2.name).toBe('addition_1$1');
        pattern3.override();
        expect(pattern3.name).toBe('addition_2$1');
        pattern1.override();
        expect(pattern1.name).toBe('addition$2');
        pattern2.override();
        expect(pattern2.name).toBe('addition_1$2');
        pattern3.override();
        expect(pattern3.name).toBe('addition_2$2');
      });
    });
  });

  describe('Scope-FunctionObject Manipulation', () => {
    describe('Scope#createFunction', () => {
      const s = new Scope();
      const childScope = s.createChildScope('test-child-scope');
      const funcObj = s.createFunction('addition');

      it('creates new function object', () => {
        expect(funcObj.name).toBe('addition');
      });

      it('throws error when creating function with duplicated name in current scope', () => {
        expect(() => s.createFunction('addition'))
          .toThrow('ParserError: Function object `addition` has already been created in current scope');
      });

      it('creates new function object safely even if duplicated name of the function is in the parent scope', () => {
        const funcObj2 = childScope.createFunction('addition');
        expect(funcObj2.name).toBe(funcObj.name);
      });
    });

    describe('Scope#hasFunction', () => {
      const s = new Scope();
      const childScope = s.createChildScope('test-child-scope');
      s.createFunction('addition');

      it('returns `true` if function is found in current scope', () => {
        expect(s.hasFunction('addition')).toBeTruthy();
        expect(s.hasFunction('subtraction')).toBeFalsy();
      });

      it('returns `true` if function is found in parent scope', () => {
        expect(childScope.hasFunction('addition')).toBeTruthy();
        expect(childScope.hasFunction('subtraction')).toBeFalsy();
      });
    });

    describe('Scope#getFunction', () => {
      const s = new Scope();
      const childScope = s.createChildScope('test-child-scope');
      s.createFunction('addition');

      it('gets function object if function is in current scope', () => {
        expect(s.getFunction('addition').name).toBe('addition');
      });

      it('gets function object if function is in parent scope', () => {
        expect(childScope.getFunction('addition').name).toBe('addition');
      });

      it('throws error if function is not declared throughout entire scope chain', () => {
        expect(() => s.getFunction('subtraction'))
          .toThrowError('ParserError: Function `subtraction` isn\'t declared throughout scope chain');
        expect(() => childScope.getFunction('subtraction'))
          .toThrowError('ParserError: Function `subtraction` isn\'t declared throughout scope chain');
      });
    });

    describe('Scope#getFunctionPattern', () => {
      const s = new Scope();
      const childScope = s.createChildScope('test-child-scope');
      const funcObj = s.createFunction('addition');
      const p1 = funcObj.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
      const p2 = funcObj.createNewPattern(Parameter.of(DT.Str, DT.Str), DT.Str);
      const p3 = funcObj.createNewPattern(Parameter.of(DT.Num, DT.Num, DT.Num), DT.Num);
      p3.override();

      const funcObj2 = childScope.createFunction('subtraction');
      funcObj2.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);

      it('gets function object\'s pattern if function is in current scope and pattern exists', () => {
        const result1 = s.getFunctionPattern('addition', Parameter.of(DT.Num, DT.Num));
        expect(result1).toBe(p1);

        const result2 = s.getFunctionPattern('addition', Parameter.of(DT.Str, DT.Str));
        expect(result2).toBe(p2);

        const result3 = s.getFunctionPattern('addition', Parameter.of(DT.Num, DT.Num, DT.Num));
        expect(result3).toBe(p3);
      });

      it('gets function object\'s pattern if function is in parent scope and pattern exists', () => {
        const result1 = childScope.getFunctionPattern('addition', Parameter.of(DT.Num, DT.Num));
        expect(result1).toBe(p1);

        const result2 = childScope.getFunctionPattern('addition', Parameter.of(DT.Str, DT.Str));
        expect(result2).toBe(p2);

        const result3 = childScope.getFunctionPattern('addition', Parameter.of(DT.Num, DT.Num, DT.Num));
        expect(result3).toBe(p3);
      });

      it('throws error if function is not declared throughout entire scope chain', () => {
        expect(() => s.getFunctionPattern('subtraction', Parameter.of(DT.Num, DT.Num)))
          .toThrow('ParserError: Function `subtraction` isn\'t declared throughout scope chain');
      });

      it('throws error if pattern isn\'t exists during function declaration', () => {
        expect(() => s.getFunctionPattern('addition', Parameter.of(DT.Num, DT.Str)))
          .toThrow('ParserError: Function `addition` with input parameter `Num.Str` isn\'t declared throughout scope chain');
      });
    });
  });
});
