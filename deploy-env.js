#!/usr/bin/env node

/**
 * Deploy Environment Variables to Railway
 * Reads .env file and sets all variables in Railway
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🚂 Deploying Environment Variables to Railway...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found!');
    console.error('Please create a .env file first.');
    process.exit(1);
}

// Check if railway CLI is installed
try {
    execSync('railway --version', { stdio: 'ignore' });
} catch (error) {
    console.error('❌ Error: Railway CLI not installed!');
    console.error('Install with: npm install -g @railway/cli');
    process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

let count = 0;
const errors = [];

// Process each line
for (const line of lines) {
    // Skip empty lines and comments
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
    }

    // Parse key=value
    const equalsIndex = trimmedLine.indexOf('=');
    if (equalsIndex === -1) {
        continue;
    }

    const key = trimmedLine.substring(0, equalsIndex).trim();
    let value = trimmedLine.substring(equalsIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
    }

    // Set variable in Railway
    try {
        console.log(`Setting: ${key}`);
        execSync(`railway variables --set "${key}=${value}"`, {
            stdio: 'pipe',
            encoding: 'utf-8'
        });
        count++;
    } catch (error) {
        errors.push({ key, error: error.message });
        console.error(`⚠️  Failed to set ${key}`);
    }
}

console.log('');
if (errors.length > 0) {
    console.log(`⚠️  Set ${count} variables with ${errors.length} errors`);
    errors.forEach(({ key, error }) => {
        console.log(`   - ${key}: ${error}`);
    });
} else {
    console.log(`✅ Successfully set ${count} environment variables in Railway!`);
}

console.log('');
console.log('To verify, run: railway variables');
