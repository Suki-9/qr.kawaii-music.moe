import pako from 'pako';
import type { LinkTree } from './types';

export function compress(data: LinkTree): string {
  const json = JSON.stringify(data);
  const compressed = pako.deflate(json);
  // base64url encoding (URL-safe, no padding)
  return btoa(String.fromCharCode(...compressed))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function decompress(encoded: string): LinkTree {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const json = pako.inflate(bytes, { to: 'string' });
  return JSON.parse(json) as LinkTree;
}
