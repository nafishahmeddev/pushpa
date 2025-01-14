import { UserDesignation } from "@app/db/models/user/user";
import { NextFunction, Request, Response } from "express";
import { IncomingHttpHeaders } from "http";

export type Language = "en" | "bn";

interface Headers extends IncomingHttpHeaders{
    timezone?: string,
    "utc-offset"?: string
}

export interface IRequest extends Request {
    language?: Language,

    auth?: {
        userId: string,
        permissions: Array<string>,
        restaurantId: string,
        designation: UserDesignation,
    },
    headers: Headers
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