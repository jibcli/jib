import { InitCmd } from '../commands/init';

describe('Init command', () => {

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

});
