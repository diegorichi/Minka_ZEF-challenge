import { Request, Response } from "express";
import { User } from "../models/user";
import { createHash } from "crypto";
import { sign } from "jsonwebtoken";

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.status(200).send({ message: 'Logged out' });
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const passwordHash = createHash("md5").update(password).digest("hex");

    const userFinded = await User.findOneBy( {email, password:passwordHash});

    if (userFinded) {
        const token = sign(
          { id: userFinded.id, email: userFinded.email },
          process.env.CLIENT_SECRET!,
          { expiresIn: "1h" }
        );

        res.status(200).json({token});
        return;
    }
    res.status(401).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error login in" });
  }
};
