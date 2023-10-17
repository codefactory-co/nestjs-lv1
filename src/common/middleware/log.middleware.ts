import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`[REQ] ${req.url} ${new Date().toLocaleString('kr')}`);

        next();
    }
}