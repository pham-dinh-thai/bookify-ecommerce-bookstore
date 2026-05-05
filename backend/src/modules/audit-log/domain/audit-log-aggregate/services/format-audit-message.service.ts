export interface IFormatAuditMessage {
  format(action: string): string;
}

export const FORMAT_AUDIT_MESSAGE = 'IFormatAuditMessage';
