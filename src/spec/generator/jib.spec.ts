import * as path from 'path';
import { JibGen } from '../../generators/base';

const Tester: any = require('yeoman-test');

describe('JibGen', () => {

  class MockGen extends JibGen<any> {
    constructor(...args: any[]) {
      super(...args);
      this._setup(this);
    }
    public foo() {}
    public _setup(inst: this) {}
  }

  let instance: MockGen;
  beforeEach(() => {
    spyOn(MockGen.prototype, '_setup').and.callFake((i: MockGen) => instance = i);
  });

  it('should be extensible', done => {

    const foo = spyOn(MockGen.prototype, 'foo');

    Tester.run(MockGen)
      .then(() => {
        expect(instance instanceof MockGen).toBe(true);
        expect(foo).toHaveBeenCalled();
        expect(instance['_isJib']()).toBeFalsy();
      }).then(done).catch(done.fail);
  });

});
