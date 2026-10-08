import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(crypto.scrypt);

const KEYLEN = 64;

// Hashing de contraseña con scrypt
export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, KEYLEN)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}


export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, 'hex');
    // timingSafeEqual dispara RangeError con hashes de tamaños distintos (e.g. corrupted hash)
    if (keyBuffer.length !== KEYLEN) return false;

    const derivedKey = (await scrypt(password, salt, KEYLEN)) as Buffer;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

// dummy: falsificar una verificación de contraseña para evitar ataques de temporización
export async function fakeVerifyPassword(password: string): Promise<void> {
    await scrypt(password, 'dummy-salt-for-timing', KEYLEN);
}

export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

// Generación de tokens seguros de 1 solo uso
export function generateToken(): { rawToken: string; tokenHash: string } {
    const rawToken = crypto.randomBytes(32).toString('hex');
    return { rawToken, tokenHash: hashToken(rawToken) };
}