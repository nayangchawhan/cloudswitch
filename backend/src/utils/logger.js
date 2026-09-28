/**
 * Centralized Winston logger
 * Structured JSON logging for production container environments.
 */
const winston = require('winston');
const config = require('../config/env');

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Console format for development
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}] ${message}${metaStr}`;
  })
);

// JSON format for production (container-friendly, parseable by log aggregators)
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = winston.createLogger({
  level: config.logLevel,
  format: config.nodeEnv === 'production' ? prodFormat : devFormat,
  defaultMeta: {
    service: 'cloudswitch-api',
    version: config.appVersion,
  },
  transports: [
    new winston.transports.Console(),
  ],
  // Do not exit on unhandled errors
  exitOnError: false,
});

module.exports = logger;
