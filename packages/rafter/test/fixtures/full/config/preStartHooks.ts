import { IPreStartHookConfig } from '../../../../lib/common/pre-start-hooks';

const hooks = (): IPreStartHookConfig[] => ['motd'];

export default hooks;
