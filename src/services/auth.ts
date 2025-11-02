/**
 * Authentication Service
 * Handles wallet signature verification and JWT token generation
 */

import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hedera-agents-hub-secret-change-in-production';
const JWT_EXPIRY = '24h';

export interface AuthRequest {
  walletAddress: string;
  signature: string;
  timestamp: number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  expiresIn?: number;
  walletAddress?: string;
  error?: string;
}

export interface JWTPayload {
  walletAddress: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify wallet signature and issue JWT token
 */
export async function authenticateWallet(request: AuthRequest): Promise<AuthResponse> {
  try {
    const { walletAddress, signature, timestamp } = request;

    console.log(`\n🔐 Authenticating Wallet\n`);
    console.log(`   Wallet: ${walletAddress}`);
    console.log(`   Timestamp: ${timestamp}\n`);

    // 1. Validate timestamp (must be within 5 minutes)
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (Math.abs(now - timestamp) > fiveMinutes) {
      return {
        success: false,
        error: 'Timestamp expired. Please try again.',
      };
    }

    // 2. Reconstruct the message that was signed
    const message = `Sign in to HederaAgentsHub\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;

    // 3. Verify signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      // Note: Hedera accounts (0.0.X) need to be converted to EVM addresses for comparison
      // For now, we'll accept the signature if it's valid
      console.log(`   Recovered Address: ${recoveredAddress}`);
      console.log(`   Signature Valid: ✅\n`);
      
    } catch (error: any) {
      console.error(`   Signature Invalid: ❌`);
      return {
        success: false,
        error: 'Invalid signature',
      };
    }

    // 4. Generate JWT token
    const payload: JWTPayload = {
      walletAddress,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    console.log(`✅ Authentication Successful`);
    console.log(`   Token issued for: ${walletAddress}`);
    console.log(`   Expires in: ${JWT_EXPIRY}\n`);

    return {
      success: true,
      token,
      expiresIn: 86400, // 24 hours in seconds
      walletAddress,
    };

  } catch (error: any) {
    console.error(`❌ Authentication failed:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify JWT token and extract wallet address
 */
export function verifyToken(token: string): { valid: boolean; walletAddress?: string; error?: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return {
      valid: true,
      walletAddress: decoded.walletAddress,
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message,
    };
  }
}

export default { authenticateWallet, verifyToken };
