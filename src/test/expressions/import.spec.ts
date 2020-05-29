import { FundamentalCompileTest } from '../helper';

describe('Import Expression', () => {
  describe('Importing Wyrd Program', () => {
    FundamentalCompileTest('import-mechanism/import-wyrd-program');
  });

  describe('Compiler Option: mainFileOnly', () => {
    FundamentalCompileTest('import-mechanism/compile-main-file-only');
  });
});
