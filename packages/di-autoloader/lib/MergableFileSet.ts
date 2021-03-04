import { isEqual } from 'lodash';

const mergableTypes = new Set(['number', 'string', 'function', 'boolean']);

export class MergableFileSet<T> extends Set {
  constructor(values: readonly T[] = []) {
    super();
    for (const value of values) {
      this.add(value);
    }
  }

  public add(value: T): this {
    if (mergableTypes.has(typeof value)) {
      super.add(value);
    } else {
      for (const existingValue of this.values()) {
        if (isEqual(value, existingValue)) {
          // return without adding the item because it already exists
          return this;
        }
      }
      super.add(value);
    }
    return this;
  }
}
