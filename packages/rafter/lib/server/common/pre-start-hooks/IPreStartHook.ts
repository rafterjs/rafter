export type IPreStartHook = () => Promise<void>;
export type IPreStartHookConfig = string;
export type IPreStartHooks = Set<IPreStartHookConfig>;
