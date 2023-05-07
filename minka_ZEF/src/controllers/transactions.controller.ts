import { Request, Response } from "express";
import { TransactionType } from "../models/transaction.entity";
import { verifyToken } from "../middleware/zef.middleware";
import { Logger } from "../utils/logger";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TransactionService } from "../services/transaction.service";
import { body, param, validationResult } from "express-validator";
import { ZEFRequest } from "../utils/ZEFRequest";

@controller("/transactions", verifyToken)
export class TransactionController {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(TransactionService) private transactionService: TransactionService
  ) {}

  @httpGet("/:id", param("id").isInt({ min: 1 }))
  public async getTransaction(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;

      const transaction = await this.transactionService.getTransaction(parseInt(id));

      if (!transaction) {
        return res.status(404).send("Transaction not found");
      } else {
        return res.status(200).json(transaction);
      }
    } catch (err:any) {
      this.logger.error(err);
      return res.status(500).json({ error:err.message });
    }
  }

  @httpPost(
    "",
    body("type").isIn([TransactionType.INVESTMENT, TransactionType.EARNING,
      TransactionType.DEPOSIT, TransactionType.WITHDRAW,
    ]),
    body("amount").isFloat(),
    body("amount").notEmpty(),
    body("project").optional().isInt(),
  )
  public async createTransaction(
    req: ZEFRequest,
    res: Response
  ): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { type, amount, project } = req.body;

      const userId = req.user ? req.user.id : undefined;
      const newTransaction = await this.transactionService.createTransaction(
        type,
        amount,
        project,
        userId
      );

      return res.status(200).send(newTransaction);
    } catch (err:any) {
      this.logger.error(err.message);
      return res.status(500).json({ error:err.message });
    }
  }
}
