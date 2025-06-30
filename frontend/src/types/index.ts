export * from './birthday';

export interface DatabaseStatus {
  status: string;
  database?: string;
  message: string;
  responseTime?: string;
  error?: string;
}

export interface SearchParams {
  name?: string;
  eventType?: string;
  days?: number;
}