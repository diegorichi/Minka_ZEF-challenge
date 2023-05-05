import { Request, Response } from "express";
import { Transaction } from "../models/transaction";
import { TransactionType } from "../models/transaction";
import { FindOneOptions } from "typeorm";
import { logger } from "../utils/logging";
import { User } from "../models/user";
import { Project } from "../models/project";

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const options: FindOneOptions<Transaction> = {
      relations: ["user", "account", "project"],
      where: { id: parseInt(id) },
    };
    const transaction = await Transaction.findOne(options);
    if (!transaction) {
      res.status(404).send("Transaction not found");
    } else {
      res.json(transaction);
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send("Internal server error");
  }
};

export const postTransaction = async (req: Request, res: Response) => {
  try {
    const { type, amount, project } = req.body;

    if (
      !type ||
      !amount ||
      ((type == TransactionType.INVESTMENT ||
        type == TransactionType.EARNING) &&
        (!project || project < 1)) ||
      !(type in TransactionType) ||
      amount <= 0
    ) {
      return res.status(400).send("something is missing");
    }

    const transaction = new Transaction();

    let options = { id: req.user.id };
    const user = await User.findOneBy(options).then(async (userFinded: any) => {
      if (!userFinded) {
        return res.status(400).send("User not found");
      } else {
        transaction.user = userFinded;
        transaction.account = userFinded.account;
      }
    });
    options = { id: project };
    const aProject = await Project.findOneBy(options).then(
      async (projectFinded: any) => {
        if (!projectFinded) {
          return res.status(400).send("User not found");
        } else transaction.project = projectFinded;
      }
    );

    transaction.type = type;
    transaction.amount = amount;

    transaction.execute();

    const newTransaction = await Transaction.save(transaction);
    return res.status(200).send(newTransaction);
  } catch (err) {
    logger.error(err);
    res.status(500);
  }
};
