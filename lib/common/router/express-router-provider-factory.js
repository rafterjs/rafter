import express from 'express';
import ExpressRouterProvider from './express-router-provider';

export default () => {
    return new ExpressRouterProvider(express);
};

