import { Request, Response } from "express";
import { Currency } from "../models/currency";
import { FindOneOptions } from "typeorm";
import { logger } from "../utils/logging";
import { User } from "../models/user";
import { DomainOwner } from "../models/domainOwner";

export const getAllCurrencys = async (_req: Request, res: Response) => {
  try {
    const currencys = await Currency.find();
    res.json(currencys);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Internal server error");
  }
};

export const getCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const options: FindOneOptions<Currency> = {
      relations: ["owner", "currency", "transations"],
      where: { id: parseInt(id) },
    };
    const currency = await Currency.findOne(options);
    if (!currency) {
      res.status(404).send("Currency not found");
    } else {
      res.json(currency);
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send("Internal server error");
  }
};

export const postCurrency = async (req: Request, res: Response) => {
  try {
    const { name, code, owner, parity } = req.body;

    if (!owner) {
      return res.status(400).send("Owner required");
    }
    if (!parity) {
      return res.status(400).send("Parity required");
    }
    if (!name || name.length < 3) {
      return res.status(400).send("Name missing or too short");
    }
    if (!code || code.length < 3) {
      return res.status(400).send("Code missing or too short");
    }
    let options = { id: owner };
    await User.findOneBy(options)
      .then(async (finded: any) => {
        if (!finded) {
          return res.status(400).send("Owner not found");
        }
      })
      .then(async () => {
        const parityN = Number(parity);
        const currency = new Currency();
        currency.name = name;
        currency.code = code;
        currency.owner = owner;
        if (parityN>0){
          currency.parity = parityN;   
        }
        currency.totalAvailable = 0;
        currency.totalQuantity = 0;

        const newCurrency = await Currency.save(currency);
        return res.status(200).send(newCurrency);
      });
  } catch (err) {
    logger.error(err);
    res.status(500);
  }
};

export const putCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, quantity, parity } = req.body;
    const parsedQuantity = Number(quantity);
    const parsedParity = Number(parity);

    const options: FindOneOptions<Currency> = {
      where: { id: parseInt(id) },
    };
    const currency = await Currency.findOne(options);
    if (!currency) {
      res.status(404).send("Currency not found");
      return;
    }
    currency.name = name ? name : currency.name;
    currency.code = code ? code : currency.code;
    currency.parity = parsedParity ? parsedParity : currency.parity;

    const userId = req.user ? req.user.id : undefined;

    const optionsDomainOwner: FindOneOptions<DomainOwner> = {
      where: { user: {id: parseInt(userId )}},
    };

    await DomainOwner.findOne(optionsDomainOwner).then((domainOwner) => {
      if (domainOwner){
        const total = Number(currency.totalQuantity);
        if (parsedQuantity && (total + parsedQuantity >= 0)){
          currency.totalQuantity = total + parsedQuantity
        }
      }
    });

    const updatedCurrency = await Currency.save(currency);
    res.json(updatedCurrency);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Internal server error");
  }
};

export const deleteCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const options: FindOneOptions<Currency> = {
      where: { id: parseInt(id) },
    };

    const currency = await Currency.findOne(options);
    if (!currency) {
      res.status(404).send("Currency not found");
      return;
    }

    await Currency.remove(currency);
    res.send("Currency deleted successfully");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Internal server error");
  }
};
