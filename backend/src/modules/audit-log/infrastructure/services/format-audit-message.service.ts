export class FormatAuditMessage {
  public static format(action: string): string {
    const [verb, ...resourceParts] = action.split('_');
    const resource = resourceParts.join(' ').toLowerCase();

    const verbMap: Record<string, string> = {
      CREATE: 'Created',
      DELETE: 'Deleted',
      UPDATE: 'Updated',
      RENAME: 'Renamed',
      DEACTIVATE: 'Deactivated',
      ACTIVATE: 'Activated',
      COMPLETE: 'Completed',
    };

    return `${verbMap[verb] ?? verb} ${resource}`;
  }
}
