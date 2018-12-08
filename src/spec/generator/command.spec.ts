
import * as path from 'path';
import { CommandGenerator, ICommandGeneratorOptions } from '../../generators/command/generator';
import * as helper from './helper';
import { JibGen } from '../../generators/base';
import { CONST } from '../../lib/constants';

const Tester: any = require('yeoman-test');

const mockGen = (): any => Tester.run(CommandGenerator, {
  resolved: require.resolve('../../generators/command'),
  namespace: 'project',
});

describe('Command generator', () => {

  it('should err without jib project', done => {
    const err = spyOn(JibGen.prototype as any, '_error');
    spyOn(CommandGenerator.prototype, 'writing');
    mockGen()
      .then(() => {
        expect(err).toHaveBeenCalledWith(jasmine.stringMatching(/invalid\sproject/i));
      }).then(done).catch(done.fail);
  });

  it(`should write to ${CONST.COMMAND_SRCDIR}`, done => {
    spyOn(JibGen.prototype as any, '_isJib').and.returnValue(true);
    mockGen()
      .withOptions(<ICommandGeneratorOptions>{
        command: ['foo', 'bar'],
      }).then((out: string) => {
        const cmd = path.join(CONST.COMMAND_SRCDIR, 'foo', 'bar.ts');
        helper.assertGeneratedFiles(out, [
          CONST.COMMAND_SRCDIR,
          cmd,
        ]);
        helper.assertValidTS(path.join(out, cmd));
      }).then(done).catch(done.fail);
  });
});
