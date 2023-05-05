import { Request, Response } from "express";
import { User } from "../models/user";
import { Member } from "../models/member";
import { Account } from "../models/account";
import { DomainOwner } from "../models/domainOwner";

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
  const { name, email, password, role, type } = req.body;

  if (role === "member" && type !== "individual" && type !== "company") {
    res.status(400).json({ error: "Invalid user type" });
    return;
  }
  
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

      if (role === "member"){
        const member = new Member();
        member.user = user;
        const account = new Account();
        account.balance = 0;
        account.user = user;
        member.account = account;
        member.type = type;
        account.save()
        await member.save();
      }
      if (role === "domainOwner"){
        const domainOwner = new DomainOwner();
        domainOwner.user = user;
        await domainOwner.save();
      }
      delete user.password
      res.status(201).json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};
