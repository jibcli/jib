import * as fs from 'fs';
import * as path from 'path';

import { GeneratorEnv } from '@jib/codegen';
import { ProjectGenerator, IProjectGeneratorOptions } from '../../generators/project/generator';
import * as helper from './helper';
import { JibGen } from '../../generators/base';

const Tester: any = require('yeoman-test');

const mockGen = (): any => Tester.run(ProjectGenerator, {
  resolved: require.resolve('../../generators/project'),
  namespace: 'project',
}).withGenerators([[Tester.createDummyGenerator(), `command`]]);

describe('Project generator', () => {

  it('should resolve in env', () => {
    const env = GeneratorEnv.relativeTo(__dirname);
    expect(env.list('project')).toContain('project');
  });

  it('should support external options', done => {
    const opts: IProjectGeneratorOptions = {
      name: 'foo', // not defined as an option or argument
      bin: 'bar', // is defined as argument
    };
    mockGen()
    .withOptions(opts)
    .withPrompts({ mkdir: true })
    .then((output: string) => {
      helper.assertPackageJson(output);
      helper.assertGeneratedFiles(output, [
        'bin/bar',
        'bin/bar.cmd',
        '.gitignore',
        'README.md',
        'tsconfig.json',
      ]);
    }).then(done).catch(done.fail);
  });

  it('should make a directory by name', done => {
    mockGen()
      .withOptions(<IProjectGeneratorOptions>{
        bin: 'undefined',
        mkdir: true,
      })
      .withPrompts({ name: 'foo' })
      .then((output: string) => {
        helper.assertGeneratedFiles(output, [
          'foo',
          'foo/package.json',
          'foo/README.md',
        ]);
      }).then(done).catch(done.fail);
  });

  it('should fail when mkdir exists', done => {
    const err = spyOn(JibGen.prototype as any, '_error');
    mockGen()
      .withOptions(<IProjectGeneratorOptions>{
        mkdir: true,
      })
      .withPrompts({ name: 'foo' })
      .inTmpDir((dir: string) => fs.mkdirSync(path.join(dir, 'foo')))
      .then(() => {
        expect(err).toHaveBeenCalled();
      }).then(done).catch(done.fail);
  });

  it('should run install', done => {
    const link = spyOn(JibGen.prototype as any, '_npm');
    const install = spyOn(JibGen.prototype, 'npmInstall');
    mockGen()
      .withOptions(<IProjectGeneratorOptions>{
        install: true,
        tests: true,
      }).then((output: string) => {
        helper.assertPackageJson(output);
        expect(install).toHaveBeenCalledTimes(2); // dep and devDep
        expect(link).toHaveBeenCalledWith(['link']);
      }).then(done).catch(done.fail);
  });

});
