import { compile } from '../..';

describe('Error: Record', () => {
  describe('Declaration', () => {
    it('throws error when declaring empty record', () => {
      const program = `\nrecord UserInfo {}\n`;
      expect(() => compile(program))
        .toThrow('ParserError: Expect record declaration `UserInfo` is not blank');
    });
  });
});
