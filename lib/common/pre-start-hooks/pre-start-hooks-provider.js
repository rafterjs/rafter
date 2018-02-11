/**
 *
 */
export default class PreStartHooksProvider {
    /**
     * @param {Box} diContainer
     * @param {Logger} logger
     */
    constructor(
        diContainer,
        logger,
    ) {
        this._diContainer = diContainer;
        this._logger = logger;
    }

    /**
     * @param {string[]} preStartHooksConfig
     * @return {Function[]}
     */
    createInstance(preStartHooksConfig) {
        const hooksCollection = [];
        for (const preStartHookServiceName of preStartHooksConfig) {
            try {
                this._logger.info(`    Adding pre-start hook: ${preStartHookServiceName}`);
                const hook = this._diContainer.get(preStartHookServiceName);
                hooksCollection.push(hook);
            } catch (error) {
                this._logger.error(`    Could not add pre-start hook: ${preStartHookServiceName}`, error);
            }
        }

        return hooksCollection;
    }
}
