import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Sanitizes text input by removing dangerous characters
 */
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .trim();
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Rate limiting for form submissions
 */
const submissionTimes = new Map<string, number[]>();

export const checkRateLimit = (identifier: string, maxAttempts = 5, windowMs = 300000): boolean => {
  const now = Date.now();
  const attempts = submissionTimes.get(identifier) || [];
  
  // Remove attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  recentAttempts.push(now);
  submissionTimes.set(identifier, recentAttempts);
  return true;
};

/**
 * Generates a secure random ID
 */
export const generateSecureId = (): string => {
  return crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);
};

/**
 * Validates and sanitizes form data
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeText(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
};