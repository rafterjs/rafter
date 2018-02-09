import express from 'express';
import RouterProvider from './router-provider';

export default () => {
    return new RouterProvider(express);
};

