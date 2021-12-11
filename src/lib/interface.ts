import ModelsManager from "@manager";
import { Request, Response } from "express";
import Config from "./config";
import AppLogger from "./log/logger";
import ResponseUtils from "./response-utils";

export interface CustomRequest extends Request {
  config?: Config;
  models?: ModelsManager;
  appLog?: AppLogger;
}

export interface CustomResponse extends Response {
  utils?: ResponseUtils;
}
