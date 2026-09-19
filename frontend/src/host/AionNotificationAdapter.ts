import { Message } from '@arco-design/web-react';

export interface AionNotificationAdapter {
  info(text: string): void;
  success(text: string): void;
  error(text: string): void;
}

export const aionNotification: AionNotificationAdapter = {
  info: (text) => Message.info(text),
  success: (text) => Message.success(text),
  error: (text) => Message.error(text),
};
