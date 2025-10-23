export interface CloudinaryNotification {
  notification_type: string;
  resource_type: string;
  public_id: string;
  secure_url: string;
}
export interface CloudinaryWebHook {
  body: Request;
  rawBody: string;
  timestamp: number;
  signature: string;
}
