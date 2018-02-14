/**
 * @param {Box} diContainer
 * @param {Logger} logger
 * @return {PreStartHooksProvider}
 */
export default (
    diContainer,
    logger
) => {
    /**
     * @namespace PreStartHooksProvider
     */
    const PreStartHooksProvider = {};

    /**
     * @param {string[]} preStartHooksConfig
     * @return {Function[]}
     */
    PreStartHooksProvider.createInstance = (preStartHooksConfig) => {
        const hooksCollection = [];
        for (const preStartHookServiceName of preStartHooksConfig) {
            try {
                logger.info(`    Adding pre-start hook: ${preStartHookServiceName}`);
                const hook = diContainer.get(preStartHookServiceName);
                hooksCollection.push(hook);
            } catch (error) {
                logger.error(`    Could not add pre-start hook: ${preStartHookServiceName}`, error);
            }
        }

        return hooksCollection;
    };

    return Object.freeze(PreStartHooksProvider);
}
