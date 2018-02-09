import Rafter from '../rafter';

const run = async () => {
    const rafter = new Rafter(__dirname, console);
    await rafter.start();
};

run();