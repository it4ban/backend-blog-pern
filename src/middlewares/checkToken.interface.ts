import { Request } from 'express';


export interface IUserInfoRequest extends Request {
	userId: string;
}
