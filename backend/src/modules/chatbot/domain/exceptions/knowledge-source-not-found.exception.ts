export class KnowledgeSourceNotFoundException extends Error {
  constructor() {
    super('Knowledge source not found.');
    this.name = 'KnowledgeSourceNotFoundException';
  }
}
