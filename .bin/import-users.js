import BoxDiAutoLoader from 'box-di-autoloader';
import {Box} from 'box-di';
import serverServicesConfig from '../config/.config';
import MongooseDbDao from '../lib/utils/mongoose-db-dao';
import userFixtures from './fixtures/users.json';
import UserModel from './../lib/users/user-schema';

const run = async () => {
    try {
        const boxDiAutoLoader = new BoxDiAutoLoader(serverServicesConfig, Box, console);
        boxDiAutoLoader.load();

        /**
         * @type {MongooseDbDao} dbDao
         */
        const dbDao = boxDiAutoLoader.get('dbDao');
        /**
         * @type {UserManager} userManager
         */
        const userManager = boxDiAutoLoader.get('userManager');
        /**
         * @type {Logger} logger
         */
        const logger = boxDiAutoLoader.get('logger');

        logger.info(`   Connecting to a DB...`);
        await dbDao.connect();
        logger.info(`   Connected to a DB`);
        for (const userJson of userFixtures) {
            try {
                logger.info(`       Inserting user: ${userJson.first_name}`);
                await userManager.create(new UserModel(userJson));
            } catch (error) {
                logger.warn(`       Failed to insert user: ${userJson.first_name}`);
            }
        }
        logger.info(`   Finished import`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();
