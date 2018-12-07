import { AddCommand } from '../commands/add/command';

describe('Add', () => {
  describe('Command', () => {
    it('should show help', () => {
      const add = new AddCommand();
      const help = spyOn(add.ui, 'write').and.returnValue(add.ui);
      add.help();
      expect(help).toHaveBeenCalled();
    });

    it('should delegate to generator', done => {
      const add = new AddCommand();
      const gen = spyOn(add['_gen'] as any, 'run').and.returnValue(Promise.resolve());
      add.run({}, 'foo').then(() => {
        expect(gen).toHaveBeenCalledWith('command', jasmine.any(Object), 'foo');
      }).then(done).catch(done.fail);
    });
  });
});
