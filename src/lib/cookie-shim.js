// This is a shim for the cookie module to provide ESM compatible exports
// Instead of importing from 'cookie', we'll implement the minimum functionality needed

// Simple cookie parsing implementation
export function parse(cookieString) {
  if (!cookieString) return {};
  
  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((acc, cookie) => {
      const [name, ...parts] = cookie.split('=');
      const value = parts.join('=');
      if (name) acc[name] = decodeURIComponent(value);
      return acc;
    }, {});
}

// Simple cookie serialization implementation
export function serialize(name, value, options = {}) {
  const encValue = encodeURIComponent(value);
  let result = `${name}=${encValue}`;
  
  if (options.path) {
    result += `; Path=${options.path}`;
  }
  
  if (options.domain) {
    result += `; Domain=${options.domain}`;
  }
  
  if (options.maxAge) {
    result += `; Max-Age=${options.maxAge}`;
  }
  
  if (options.expires) {
    result += `; Expires=${options.expires.toUTCString()}`;
  }
  
  if (options.httpOnly) {
    result += '; HttpOnly';
  }
  
  if (options.secure) {
    result += '; Secure';
  }
  
  if (options.sameSite) {
    result += `; SameSite=${options.sameSite}`;
  }
  
  return result;
}

// Default export with both functions
export default {
  parse,
  serialize
};
