/**
 * This is just an example pre start service
 *
 * @param {Logger} logger
 * @return {Function}
 */
export default (logger) => {
    return async () => {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    logger.info(`   PreStartService1::The pre start service is complete`);
                    resolve();
                },
                100
            );
            logger.info(`   PreStartService1::Running the pre start service`);
        })
    }
}
