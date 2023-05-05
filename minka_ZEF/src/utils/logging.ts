import winston from 'winston';
import os from 'os';


const customFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${os.hostname()}] [${level.toUpperCase()}]: ${message}`;
    })
  );

// Crear un objeto logger con dos transportes: consola y archivo
export const logger:winston.Logger = winston.createLogger({
    format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log', options: { flags: 'w' } }
    )
  ]
});