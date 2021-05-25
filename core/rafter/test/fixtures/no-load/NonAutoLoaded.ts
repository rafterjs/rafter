// This service is not exported by default and therefore wont be autoloaded

export class NonAutoLoaded {
  public get(): string {
    return 'hi';
  }
}
