import { Scope } from '../../parser/utils';

describe('Scope', () => {
  describe('Scope#createChildScope', () => {
    it('creates child scope which links each other', () => {
      const s = new Scope();
      const childScope = s.createChildScope('foo');

      expect(s.children.get('foo')).toBe(childScope);
      expect(childScope.parent).toBe(s);
    });
  });
});
