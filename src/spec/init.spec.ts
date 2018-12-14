import { InitCmd } from '../commands/init';
import { PluginCommand } from '../commands/init/plugin';
import { PROJECT_TYPE } from '../generators/project/generator';

describe('Init', () => {

  it('should show help', () => {
    const init = new InitCmd();
    const help = spyOn(init.ui, 'write').and.returnValue(init.ui);
    init.help();
    expect(help).toHaveBeenCalled();
  });

  it('should delegate to generator', done => {
    const init = new InitCmd();
    const gen = spyOn(init['_gen'] as any, 'run').and.returnValue(Promise.resolve());
    init.run({
      single: true,
      tests: true,
    }).then(() => {
      expect(gen).toHaveBeenCalledWith('project', jasmine.objectContaining({tests: true}));
    }).then(done).catch(done.fail);
  });

  describe('Plugin', () => {

    it('should show custom help', () => {
      const init = new PluginCommand();
      const help = spyOn(init.ui, 'write').and.returnValue(init.ui);
      init.help();
      expect(help).toHaveBeenCalled();
    });

    it('should delegate to generator', done => {
      const init = new PluginCommand();
      const gen = spyOn(init['_gen'] as any, 'run').and.returnValue(Promise.resolve());
      init.run({}, ['foo']).then(() => {
        expect(gen).toHaveBeenCalledWith(
          'project',
          jasmine.objectContaining({type: PROJECT_TYPE.PLUGIN}),
          jasmine.arrayContaining(['foo']),
        );
      }).then(done).catch(done.fail);
    });

  });

});
