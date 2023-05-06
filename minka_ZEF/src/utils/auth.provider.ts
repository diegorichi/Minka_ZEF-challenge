import { injectable, inject } from "inversify";
import { interfaces } from "inversify-express-utils";
import { Request,Response, NextFunction } from "express";
const authService = inject("AuthService");

@injectable()
class CustomAuthProvider implements interfaces.AuthProvider {

    @authService private readonly _authService: interfaces.AuthService;

    public async getUser(req: Request, res: Response, next: NextFunction): Promise<interfaces.Principal>{
        const token = req.headers["x-auth-token"]
        const user = await this._authService.getUser(token);
        const principal = new Principal(user);
        return principal;
        
    }

}