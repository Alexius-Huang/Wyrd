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
});
