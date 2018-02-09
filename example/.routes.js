import {GET} from '../lib/common/router/route-method-constants';

export default [
    {
        endpoint: `/`,
        controller: 'exampleController',
        action: 'index',
        method: GET
    },
];
