/**
 * Authentication Middleware
 * Verifies JWT tokens and extracts wallet address
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth';

// Extend Express Request to include walletAddress
declare global {
  namespace Express {
    interface Request {
      walletAddress?: string;
    }
  }
}

/**
 * Middleware to verify JWT token and extract wallet address
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required. Please provide a valid token.',
      });
    }

    // Verify token
    const result = verifyToken(token);

    if (!result.valid) {
      return res.status(403).json({
        error: 'Invalid or expired token',
        details: result.error,
      });
    }

    // Attach wallet address to request
    req.walletAddress = result.walletAddress;
    
    next();
  } catch (error: any) {
    return res.status(500).json({
      error: 'Authentication error',
      details: error.message,
    });
  }
}

export default authenticateToken;
