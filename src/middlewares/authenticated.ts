import { CustomRequest, CustomResponse } from "@lib/interface";
import { NextFunction } from "express";

function mustBeAuthenticated(req: CustomRequest, res: CustomResponse, next: NextFunction) {
  // if (req.isAuthenticated()) {
  //   return next();
  // }
  // return res.utils.unauthorized();
  return next();
}

export default mustBeAuthenticated;