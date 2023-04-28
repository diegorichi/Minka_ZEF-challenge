import { Request, Response } from "express";
import { User } from "../models/user";
import { createHash } from "crypto";
import { sign } from "jsonwebtoken";


