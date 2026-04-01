export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical'

export class SecurityErrorHandler {
  static logSecurityEvent(
    event: string,
    details: Record<string, unknown>,
    severity: SecuritySeverity = 'low'
  ) {
    // Intentionally minimal: avoid leaking secrets while still producing useful audit logs.
    // In production, pipe this to a centralized logger (Sentry/Datadog/ELK).
    const safeDetails = { ...details }
    if ('password' in safeDetails) safeDetails.password = '[REDACTED]'
    if ('token' in safeDetails) safeDetails.token = '[REDACTED]'

    const message = `[SECURITY:${severity.toUpperCase()}] ${event}`
    // eslint-disable-next-line no-console
    console.warn(message, safeDetails)
  }
}

