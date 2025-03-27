export interface EmailResponse {
  messageId: string;
  accepted: string[];
  rejected: string[];
  // otros campos que necesites
}

export interface EmailContext {
  name?: string;
  email?: string;
  password?: string;
}
