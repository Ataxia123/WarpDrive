import { eventEmitter } from "../services/eventEmitter";
import { NextApiRequest, NextApiResponse } from "next";

const withEventEmitter = (handler: (req: NextApiRequest, res: NextApiResponse) => void) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    req.eventEmitter = eventEmitter;
    return handler(req, res);
  };
};

export default withEventEmitter;

declare module "next" {
  export interface NextApiRequest {
    eventEmitter: typeof eventEmitter;
  }
}
