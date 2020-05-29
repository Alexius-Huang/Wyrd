import { compile } from "../..";

describe('Error: Compiler', () => {
  it('throws error when missing `entry` or `program` option at the meantime', () => {
    expect(() => compile({}))
      .toThrow('CompilerError: Must provide either the `entry` Wyrd file path or Wyrd program as `program` option');
  });
});
