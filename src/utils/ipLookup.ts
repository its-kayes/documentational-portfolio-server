import { Request } from "express";

// <------------- Get IP ------------->
export const ipLookup = async (req: Request): Promise<string> => {
  const ipAddresses = req.headers["x-forwarded-for"] as string | undefined;
  if (ipAddresses && ipAddresses.length > 3) {
    const ip = ipAddresses.split(",")[0];
    return ip;
  } else {
    const ip = req.connection.remoteAddress || "";
    return ip;
  }
};
