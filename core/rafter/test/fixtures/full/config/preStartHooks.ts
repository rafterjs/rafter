import { IPreStartHookConfig } from '../../../../lib/server/common/pre-start-hooks';

const hooks = (): IPreStartHookConfig[] => ['motd'];

export default hooks;
