import { classCase } from '../../lib/strings';

describe('String functions', () => {
  it('should make classCase', () => {
    expect(classCase('foo bar')).toEqual('FooBar');
    expect(classCase('foo-bar')).toEqual('FooBar');
    expect(classCase('foo_bar')).toEqual('FooBar');
    expect(classCase('fooBar')).toEqual('FooBar');
    expect(classCase(' fooBar')).toEqual('FooBar');
  });
});
