import * as React from 'react';
import { useLocation } from 'react-router-dom';

// Custom cookies utility without requiring the cookie module
export function parseCookiesManually(cookieString) {
  if (!cookieString) return {};
  
  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((acc, cookie) => {
      const [name, ...parts] = cookie.split('=');
      const value = parts.join('=');
      if (name) acc[name] = value;
      return acc;
    }, {});
}

export function getCookies() {
  if (typeof document === 'undefined') return {};
  return parseCookiesManually(document.cookie);
}

// React hook for cookies
export function useCookies() {
  const [cookies, setCookies] = React.useState(getCookies());
  const location = useLocation();
  
  React.useEffect(() => {
    setCookies(getCookies());
  }, [location]);
  
  return cookies;
}

// Function to set a cookie
export function setCookie(name, value, options = {}) {
  if (typeof document === 'undefined') return;
  
  const { path = '/', expires, maxAge, domain, secure, httpOnly, sameSite } = options;
  
  let cookieString = `${name}=${value}; path=${path}`;
  
  if (expires) cookieString += `; expires=${expires.toUTCString()}`;
  if (maxAge) cookieString += `; max-age=${maxAge}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += '; secure';
  if (httpOnly) cookieString += '; httpOnly';
  if (sameSite) cookieString += `; samesite=${sameSite}`;
  
  document.cookie = cookieString;
}
