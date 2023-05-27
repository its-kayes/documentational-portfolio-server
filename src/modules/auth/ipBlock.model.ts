import { Schema, model } from "mongoose";

export interface IIpBlock {
  ip: string;
  hitTime: Date;
}

const ipBlockModel = new Schema<IIpBlock>({
  ip: {
    type: String,
    required: [true, "IP is required for blockIp"],
  },
  hitTime: {
    type: Date,
    default: new Date(),
  },
});

export const IpBlock = model<IIpBlock>("ipBlock", ipBlockModel);
