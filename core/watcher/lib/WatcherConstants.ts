export const PACKAGE_TOKEN = '%package%';

export const DEFAULT_COMMANDS = {
  BUILD: `lerna run build --scope ${PACKAGE_TOKEN}`,
  START: `yarn start`,
  PACKAGES: `lerna list --json --all`,
};

export const DEFAULT_EXTENSION = '{js,ts}';
export const DEFAULT_IGNORE = ['**/dist/**', '**/node_modules/**'];
export const DEFAULT_DELAY = 500;
