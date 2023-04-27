import { Request, Response } from "express";
import { User } from "../models/user";
import { createHash } from "crypto";

export const retrieveAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await User.find().then((userFinded) => {
      if (userFinded) res.status(200).json(userFinded);
      else res.status(404).json();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting user" });
  }
}

export const retrieveUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await User.findOneBy({ id: parseInt(id) }).then((userFinded) => {
      if (userFinded) res.status(200).json(userFinded);
      else res.status(404).json();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting user" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const userFinded = await User.findOneBy({ email });
    if (userFinded) {
      res.status(200).json(userFinded);
      return;
    } else {
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;

      await user.save();
      res.status(201).json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userFinded = await User.findOneBy({ email });
    if (userFinded) {
      const passwordHash = createHash("md5").update(password).digest("hex");
      if (passwordHash === userFinded.password) {
        res.status(200).json(userFinded);
        return;
      }
    }
    res.status(404).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error login in" });
  }
};
