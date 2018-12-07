import { GeneratorEnv } from '@jib/codegen';

describe('Generators', () => {
  it('should resolve jib generators', () => {
    const env = GeneratorEnv.relativeTo(__dirname);
    expect(env.list()).toContain('project');
    expect(env.list()).toContain('command');
  });
});
