import { Router } from 'express';
import { getLogger } from '../utils/logger.js';

export const loggerRouter = Router();
const logger = getLogger();

loggerRouter.get('/logger', (req, res) => {
  logger.debug('Log de prueba: debug');
  logger.http('Log de prueba: http');
  logger.info('Log de prueba: info');
  logger.warning('Log de prueba: warning');
  logger.error('Log de prueba: error');
  logger.fatal('Log de prueba: fatal');
  res.send('Logs de prueba generados');
});
