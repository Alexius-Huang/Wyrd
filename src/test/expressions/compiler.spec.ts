import { compile } from '../../index';

describe('Compiler', () => {
  it('compiles the sample program successfully', async () => {
    const { program, compiled } = await import('../../examples/sample-program');
    expect(compile(program)).toBe(compiled);
  });
});
