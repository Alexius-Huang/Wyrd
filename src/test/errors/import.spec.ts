import { compile } from '../..';

describe('Error: Import', () => {
  describe('Forbidden Use of Lib Tags in Non-Lib Files', () => {
    it('throws error when using lib tags on non-lib files', () => {
      const program = 'import "./error-import-samples/NonLibFile.wyrd"\n\nfoo = 666.exampleMethod(666, "Hello world!")\n';
      expect(() => compile({ program, dir: __dirname }))
        .toThrow('ParserError: Only library files can be parsed with token of type `lib-tag`, name your Wyrd file with extension `.lib.wyrd` to use lib tags');
    });
  });

  describe('Importing Unexisted File', () => {
    it('throws error when importing unexisted file', () => {
      const program = 'import "NOT_EXIST.wyrd"\n';
      expect(() => compile({ program, dir: __dirname }))
        .toThrow(`ParserError: Importing unexisted file \`${__dirname}/NOT_EXIST.wyrd\``);
    });
  });
});
