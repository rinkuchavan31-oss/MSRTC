import { Request, Response, NextFunction } from 'express';
import { assistantService } from '../services/assistantService';
import { sendSuccess } from '../utils/response';

export const assistantController = {
  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, language } = req.body;
      const result = await assistantService.chat(query || '', language || 'en');
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },
};
