import Rafter from '../index';

const run = async () => {
    const rafter = Rafter({
        appDirectory: `${__dirname}`,
        logger: console
    });
    await rafter.start();
};

run();