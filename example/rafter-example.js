import Rafter from '../rafter';

const run = async () => {
    const rafter = new Rafter({
        appDirectory: `${__dirname}`,
        logger: console
    });
    await rafter.start();
};

run();