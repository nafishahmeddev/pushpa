import { NextFunction, Request, Response } from "express";

export type Language = "en" | "bn";

export interface IRequest extends Request {
    language?: Language,

    auth?: {
        userId: string,
        permissions: Array<string>,
        restaurantId: string
    }
}

export interface IResponse extends Response {
    success?: (
        body: {
            result: any,
            code?: string,
            message?: string
        },
        status?: number
    ) => void;
    error?: (
        body: {
            code: string,
            message: string
            result?: any,
        },
        status?: number
    ) => void;
}

export interface INext extends NextFunction { }