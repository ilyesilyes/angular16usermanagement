import { DataState } from "../enum/datastate.enum";
import { User } from "./user";

export interface Loginstate {
    dataState: DataState;
    loginSuccess?: boolean;
    error?: string;
    message?: string;
    isUsing?: boolean;
    phone?: string;
}

export interface CustomHttpRespose<T> {
    timestamp: Date;
    statusCode: Number;
    status: string;
    message: string;
    reason?: string;
    developerMessage?: string;
    data?: TemplateStringsArray;
    
}

export interface Profile {
    user?: User;
    access_token: string;
    refresh_token: string;

}