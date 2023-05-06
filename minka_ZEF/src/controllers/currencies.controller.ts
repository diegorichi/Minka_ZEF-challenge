import { Request, Response } from "express";
import { Logger } from "../utils/logger";
import { verifyToken } from "../middleware/zef.middleware";
import { body, param, validationResult } from "express-validator";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from "inversify-express-utils";
import { inject } from "inversify";

import { CurrencyService } from "../services/currency.service";

@controller("/currencies", verifyToken)
export class CurrencyController {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(CurrencyService) private currencyService: CurrencyService
  ) {}

  @httpGet("")
  public async getAllCurrencies(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const projects = await this.currencyService.findAll();
      return res.status(200).json(projects);
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  }

  @httpGet("/:id", param("id").isInt({ min: 1 }))
  public async getCurrency(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;
      const currency = this.currencyService.getCurrency(id);
      if (!currency) return res.status(404).send("not found");

      return res.status(200).send(currency);
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  }

  @httpPost(
    "",
    body("name").isLength({ min: 3 }),
    body("code").isLength({ min: 3 }),
    body("parity").isFloat({ gt: 0 }),
    body("parity").notEmpty()
  )
  public async createCurrency(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, code, parity } = req.body;
      const userId = req.user ? req.user.id : undefined;

      const currency = await this.currencyService.createCurrency(
        name,
        code,
        parity,
        userId
      );
      return res.status(200).send(currency);
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  }

  @httpPut(
    "/:id",
    param("id").isInt(),
    body("quantity").isFloat(),
    body("quantity").notEmpty()
  )
  public async updateCurrency(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;
      const { name, code, quantity, parity } = req.body;

      const userId = req.user ? req.user.id : undefined;

      const currency = await this.currencyService.updateCurrency(
        parseInt(id),
        userId,
        name,
        code,
        quantity,
        parity
      );

      if (!currency) {
        return res.status(404).send("Currency not found");
      }
      return res.status(200).json(currency);
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  }

  @httpDelete(
    "/:id",
    param("id").isInt()
  )
  public async deleteCurrency(req: Request, res: Response) {
    try {
      const { id } = req.params;
     
      this.currencyService.deleteCurrency(id);

      return res.send("Currency deleted successfully");
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  };
}
