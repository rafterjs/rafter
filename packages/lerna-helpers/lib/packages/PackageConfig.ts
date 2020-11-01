export type PackageConfig = {
  name: string;
  version: string;
  location: string;
  private: boolean;
};

export class PackageConfigDto {
  private readonly name: string;

  private readonly version: string;

  private readonly location: string;

  private readonly private: boolean;

  constructor(params: PackageConfig) {
    this.name = params.name;
    this.version = params.version;
    this.location = params.location;
    this.private = params.private;
  }
}
