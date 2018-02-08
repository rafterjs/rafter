import Rafter from '../rafter';

const run = async () => {
    const rafter = new Rafter(`test`, console);
    await rafter.start();
};

run();