export type Package = {
  name: string;
  version: string;
  path: string;
  isUpdating: boolean;
};

export class PackageDto {
  private readonly name: string;

  private readonly version: string;

  private readonly path: string;

  private readonly isUpdating: boolean;

  constructor({ name, version, path, isUpdating }: Package) {
    this.name = name;
    this.version = version;
    this.path = path;
    this.isUpdating = isUpdating;
  }
}
