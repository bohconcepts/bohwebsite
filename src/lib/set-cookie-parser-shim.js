// set-cookie-parser-shim.js - Provides CommonJS-compatible exports for set-cookie-parser module

// Parse a single set-cookie header into an object
export function parseSetCookieHeader(setCookieValue) {
  if (!setCookieValue) return {};
  
  const parts = setCookieValue.split(';').map(part => part.trim());
  const nameValuePair = parts.shift().split('=');
  const name = nameValuePair.shift();
  const value = nameValuePair.join('=');
  
  const cookie = { name, value };
  
  parts.forEach(part => {
    const [key, ...values] = part.split('=');
    const keyLower = key.toLowerCase();
    const value = values.join('=');
    
    if (keyLower === 'expires') cookie.expires = new Date(value);
    else if (keyLower === 'max-age') cookie.maxAge = parseInt(value, 10);
    else if (keyLower === 'domain') cookie.domain = value;
    else if (keyLower === 'path') cookie.path = value;
    else if (keyLower === 'secure') cookie.secure = true;
    else if (keyLower === 'httponly') cookie.httpOnly = true;
    else if (keyLower === 'samesite') cookie.sameSite = value;
  });
  
  return cookie;
}

// Split a string of multiple set-cookie headers into an array
export function splitCookiesString(cookiesString) {
  if (!cookiesString) return [];
  
  // Handle case where cookies may have commas in the values
  // This is a simplified implementation and may not handle all edge cases
  return cookiesString
    .split(/,(?=\s*[a-zA-Z0-9_\-]+=)/)
    .map(cookie => cookie.trim());
}

// Parse multiple set-cookie headers
export function parse(setCookieHeaders, options = {}) {
  if (!setCookieHeaders) return [];
  
  // If string input, split it first
  if (typeof setCookieHeaders === 'string') {
    setCookieHeaders = splitCookiesString(setCookieHeaders);
  }
  
  // Handle array input
  if (Array.isArray(setCookieHeaders)) {
    return setCookieHeaders.map(parseSetCookieHeader);
  }
  
  return [];
}

// Default export for direct imports
const setCookieParser = { parse, splitCookiesString, parseSetCookieHeader };
export default setCookieParser;
