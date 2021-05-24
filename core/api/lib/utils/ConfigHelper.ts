import { IApiConfig } from '../../config/IApiConfig';

export async function applySslConfig(
  config: IApiConfig,
  isSsl: string | undefined,
  sslPrivateKey: string | undefined,
  sslCertificate: string | undefined,
): Promise<IApiConfig> {
  const isSslEnabled = isSsl === 'true';

  if (isSslEnabled) {
    if (!sslPrivateKey) {
      throw new Error(`Please set the ssl private key`);
    }
    if (!sslCertificate) {
      throw new Error(`Please set the ssl certificate`);
    }

    return {
      ...config,
      server: {
        ...config.server,
        ssl: {
          enabled: true,
          privateKey: sslPrivateKey,
          certificate: sslCertificate,
        },
      },
    };
  }

  return {
    ...config,
    server: {
      ...config.server,
      ssl: {
        enabled: false,
      },
    },
  };
}
