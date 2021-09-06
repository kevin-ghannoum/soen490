import * as winston from "winston";
import * as expressWinston from "express-winston";

export class AppSettings {
  public static BACKEND_PORT = 8000;

  // here we are preparing the expressWinston logging middleware configuration,
  // which will automatically log all HTTP requests handled by Express.js
  public static loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true })
    ),
  };
}
