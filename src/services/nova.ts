/**
 * NOVA encrypted storage integration.
 * @see https://nova-25.gitbook.io/nova-docs/mcp-server
 * Encryption uses Web Crypto API (AES-256-CBC per NOVA docs). Upload/retrieve require backend or MCP.
 */

const NOVA_API_URL = process.env.NEXT_PUBLIC_NOVA_API_URL || "";
const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";

function getKeyMaterial(password: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export class NovaService {
  private client: unknown = null;

  constructor() {
    if (NOVA_API_URL) {
      // In production, initialize NOVA client or MCP proxy with NOVA_API_URL
      this.client = { baseUrl: NOVA_API_URL };
    }
  }

  async saveLog(encryptedData: string): Promise<boolean> {
    if (!NOVA_API_URL || !PINATA_API_KEY) {
      console.warn("NOVA upload requires NEXT_PUBLIC_NOVA_API_URL and PINATA_API_KEY.");
      return false;
    }
    try {
      const res = await fetch(`${NOVA_API_URL}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: encryptedData }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async retrieveLogs(): Promise<string[]> {
    if (!NOVA_API_URL) return [];
    try {
      const res = await fetch(`${NOVA_API_URL}/list`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  /** AES-256-CBC encryption using Web Crypto API (per NOVA docs). */
  async encrypt(text: string, keyOrPassword: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await getKeyMaterial(keyOrPassword);
    const key = await deriveKey(keyMaterial, salt);
    const encoded = new TextEncoder().encode(text);
    const cipher = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      key,
      encoded
    );
    const combined = new Uint8Array(salt.length + iv.length + cipher.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(cipher), salt.length + iv.length);
    return btoa(String.fromCharCode.apply(null, Array.from(combined)));
  }

  /** AES-256-CBC decryption. */
  async decrypt(encryptedB64: string, keyOrPassword: string): Promise<string> {
    const combined = Uint8Array.from(atob(encryptedB64), (c) => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 32);
    const cipher = combined.slice(32);
    const keyMaterial = await getKeyMaterial(keyOrPassword);
    const key = await deriveKey(keyMaterial, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      cipher
    );
    return new TextDecoder().decode(decrypted);
  }
}

export const novaService = new NovaService();
