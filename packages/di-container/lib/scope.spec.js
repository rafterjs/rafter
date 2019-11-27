import sinon from 'sinon';
import { scope } from './scope';
import Box from './box';
import { singleton, prototype } from './scope-constants';

describe('scope', () => {
  let TEST_FACTORY;

  beforeEach(() => {
    Box.setFactoryScope = sinon.stub();

    TEST_FACTORY = {
      name: 'TestFactory',
      createInstance: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should set factory scope to singleton by default when createInstance exists', () => {
    scope()(TEST_FACTORY);
    expect(Box.setFactoryScope.calledOnceWith(TEST_FACTORY.createInstance, singleton)).toBeTruthy();
  });

  it('should set factory scope to singleton when createInstance exists and scope passed', () => {
    scope(singleton)(TEST_FACTORY);
    expect(Box.setFactoryScope.calledOnceWith(TEST_FACTORY.createInstance, singleton)).toBeTruthy();
  });

  it('should set factory scope to prototype when createInstance exists and scope passed', () => {
    scope(prototype)(TEST_FACTORY);
    expect(Box.setFactoryScope.calledOnceWith(TEST_FACTORY.createInstance, prototype)).toBeTruthy();
  });

  it('should thrown an error when the factory does not have the correct interface', () => {
    expect(() => scope()(() => console.log('invalid'))).toThrow();
    expect(Box.setFactoryScope.notCalled).toBeTruthy();
  });
});
