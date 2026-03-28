// ============================================================
// @erp/notifications — Unified Notification Service
// Multi-channel: Email, In-App, SMS, Zalo OA, Telegram
// Event-driven: Subscribes to NATS events, sends notifications
// ============================================================

import { subscribe } from '@erp/events';

// ==================== Types ====================

export type NotificationChannel = 'email' | 'in_app' | 'sms' | 'zalo' | 'telegram' | 'webhook';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: string;                    // e.g., 'invoice.overdue', 'leave.approved'
  title: string;
  titleVi: string;
  body: string;
  bodyVi: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  tenantId: string;
  data?: Record<string, unknown>;  // Template variables
  actionUrl?: string;              // Deep link to relevant page
  expiresAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  error?: string;
}

export interface NotificationTemplate {
  id: string;
  type: string;
  name: string;
  channels: NotificationChannel[];
  subject?: string;                // Email subject
  subjectVi?: string;
  htmlTemplate?: string;           // HTML email body (Handlebars)
  textTemplate?: string;           // Plain text fallback
  textTemplateVi?: string;
  inAppTemplate?: string;          // In-app notification text
  smsTemplate?: string;            // SMS text (max 160 chars)
  isActive: boolean;
}

export interface NotificationPreference {
  userId: string;
  tenantId: string;
  channels: Record<string, boolean>;  // { email: true, in_app: true, sms: false }
  quiet_hours?: { start: string; end: string };  // "22:00" - "07:00"
  digestMode?: 'instant' | 'hourly' | 'daily';
  mutedTypes?: string[];             // Notification types to mute
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
  from: string;
  fromName: string;
}

// ==================== Notification Service ====================

export class NotificationService {
  private templates: Map<string, NotificationTemplate> = new Map();
  private preferences: Map<string, NotificationPreference> = new Map();
  private queue: Notification[] = [];
  private emailConfig?: EmailConfig;

  constructor(emailConfig?: EmailConfig) {
    this.emailConfig = emailConfig;
  }

  // ==================== Template Management ====================

  registerTemplate(template: NotificationTemplate): void {
    this.templates.set(template.type, template);
  }

  // ==================== Send Notifications ====================

  /**
   * Send a notification through configured channels
   */
  async send(params: {
    type: string;
    recipientId: string;
    recipientEmail?: string;
    recipientPhone?: string;
    tenantId: string;
    data?: Record<string, unknown>;
    actionUrl?: string;
    priority?: NotificationPriority;
    channels?: NotificationChannel[];
  }): Promise<Notification> {
    const template = this.templates.get(params.type);
    const pref = this.preferences.get(`${params.recipientId}:${params.tenantId}`);

    // Determine channels
    let channels = params.channels || template?.channels || ['in_app', 'email'];

    // Apply user preferences
    if (pref) {
      channels = channels.filter(ch => pref.channels[ch] !== false);
      if (pref.mutedTypes?.includes(params.type)) {
        channels = []; // Muted
      }
    }

    const notification: Notification = {
      id: `ntf_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
      type: params.type,
      title: this.renderTemplate(template?.inAppTemplate || params.type, params.data),
      titleVi: this.renderTemplate(template?.textTemplateVi || params.type, params.data),
      body: this.renderTemplate(template?.textTemplate || '', params.data),
      bodyVi: this.renderTemplate(template?.textTemplateVi || '', params.data),
      channels,
      priority: params.priority || 'normal',
      recipientId: params.recipientId,
      recipientEmail: params.recipientEmail,
      recipientPhone: params.recipientPhone,
      tenantId: params.tenantId,
      data: params.data,
      actionUrl: params.actionUrl,
      status: 'pending',
    };

    // Dispatch to channels
    for (const channel of channels) {
      try {
        await this.dispatchToChannel(channel, notification, template);
      } catch (error) {
        console.error(`[NOTIFICATIONS] Failed to send via ${channel}:`, error);
        notification.error = `${channel}: ${error instanceof Error ? error.message : String(error)}`;
      }
    }

    notification.status = notification.error ? 'failed' : 'sent';
    notification.sentAt = new Date();
    this.queue.push(notification);

    return notification;
  }

  /**
   * Send bulk notifications (e.g., payroll ready for all employees)
   */
  async sendBulk(params: {
    type: string;
    recipients: Array<{ id: string; email?: string; phone?: string }>;
    tenantId: string;
    data?: Record<string, unknown>;
    actionUrl?: string;
  }): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const recipient of params.recipients) {
      try {
        await this.send({
          type: params.type,
          recipientId: recipient.id,
          recipientEmail: recipient.email,
          recipientPhone: recipient.phone,
          tenantId: params.tenantId,
          data: params.data,
          actionUrl: params.actionUrl,
        });
        sent++;
      } catch {
        failed++;
      }
    }

    return { sent, failed };
  }

  // ==================== Channel Dispatchers ====================

  private async dispatchToChannel(
    channel: NotificationChannel,
    notification: Notification,
    template?: NotificationTemplate
  ): Promise<void> {
    switch (channel) {
      case 'email':
        await this.sendEmail(notification, template);
        break;
      case 'in_app':
        await this.sendInApp(notification);
        break;
      case 'sms':
        await this.sendSMS(notification, template);
        break;
      case 'zalo':
        await this.sendZalo(notification);
        break;
      case 'telegram':
        await this.sendTelegram(notification);
        break;
    }
  }

  private async sendEmail(notification: Notification, template?: NotificationTemplate): Promise<void> {
    if (!this.emailConfig || !notification.recipientEmail) return;

    // Dynamic import to avoid requiring nodemailer if not used
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport(this.emailConfig);

    const subject = this.renderTemplate(template?.subjectVi || template?.subject || notification.titleVi, notification.data);
    const html = this.renderTemplate(template?.htmlTemplate || `<p>${notification.bodyVi}</p>`, notification.data);

    await transporter.sendMail({
      from: `"${this.emailConfig.fromName}" <${this.emailConfig.from}>`,
      to: notification.recipientEmail,
      subject,
      html,
      text: notification.bodyVi,
    });

    console.log(`[NOTIFICATIONS] Email sent to ${notification.recipientEmail}: ${subject}`);
  }

  private async sendInApp(notification: Notification): Promise<void> {
    // In production: write to notifications table, push via WebSocket/SSE
    console.log(`[NOTIFICATIONS] In-app: ${notification.recipientId} — ${notification.titleVi}`);
  }

  private async sendSMS(notification: Notification, template?: NotificationTemplate): Promise<void> {
    if (!notification.recipientPhone) return;
    const message = this.renderTemplate(template?.smsTemplate || notification.titleVi, notification.data);
    // In production: integrate with SMS provider (Viettel, VNPT, FPT)
    console.log(`[NOTIFICATIONS] SMS to ${notification.recipientPhone}: ${message.substring(0, 160)}`);
  }

  private async sendZalo(notification: Notification): Promise<void> {
    // In production: use Zalo OA API (https://developers.zalo.me/)
    console.log(`[NOTIFICATIONS] Zalo OA: ${notification.recipientId} — ${notification.titleVi}`);
  }

  private async sendTelegram(notification: Notification): Promise<void> {
    // In production: use Telegram Bot API
    console.log(`[NOTIFICATIONS] Telegram: ${notification.recipientId} — ${notification.titleVi}`);
  }

  // ==================== Template Rendering ====================

  private renderTemplate(template: string, data?: Record<string, unknown>): string {
    if (!template || !data) return template;

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  // ==================== Preference Management ====================

  setPreference(pref: NotificationPreference): void {
    this.preferences.set(`${pref.userId}:${pref.tenantId}`, pref);
  }

  // ==================== Query ====================

  getNotifications(userId: string, tenantId: string, limit = 50): Notification[] {
    return this.queue
      .filter(n => n.recipientId === userId && n.tenantId === tenantId)
      .slice(-limit)
      .reverse();
  }

  getUnreadCount(userId: string, tenantId: string): number {
    return this.queue.filter(
      n => n.recipientId === userId && n.tenantId === tenantId && !n.readAt
    ).length;
  }

  markAsRead(notificationId: string): void {
    const notification = this.queue.find(n => n.id === notificationId);
    if (notification) {
      notification.readAt = new Date();
      notification.status = 'read';
    }
  }
}

// ==================== ERP Event Notification Templates ====================

export const ERP_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl_invoice_overdue', type: 'invoice.overdue', name: 'Invoice Overdue',
    channels: ['email', 'in_app'], isActive: true,
    subject: 'Invoice {{invoiceNumber}} is overdue',
    subjectVi: 'Hóa đơn {{invoiceNumber}} đã quá hạn',
    htmlTemplate: '<h3>Hóa đơn quá hạn</h3><p>HĐ số <strong>{{invoiceNumber}}</strong> — {{customerName}} — đã quá hạn {{daysOverdue}} ngày.</p><p>Số tiền: {{amount}} VND</p>',
    inAppTemplate: 'HĐ {{invoiceNumber}} quá hạn {{daysOverdue}} ngày — {{amount}} VND',
    smsTemplate: 'HD {{invoiceNumber}} qua han {{daysOverdue}} ngay - {{amount}} VND',
  },
  {
    id: 'tpl_leave_approved', type: 'leave.approved', name: 'Leave Approved',
    channels: ['in_app', 'email'], isActive: true,
    subjectVi: 'Đơn nghỉ phép đã được duyệt',
    inAppTemplate: 'Đơn nghỉ phép {{leaveType}} từ {{startDate}} đến {{endDate}} đã được duyệt',
  },
  {
    id: 'tpl_payroll_ready', type: 'payroll.ready', name: 'Payroll Ready',
    channels: ['email', 'in_app'], isActive: true,
    subjectVi: 'Bảng lương tháng {{period}} đã sẵn sàng',
    inAppTemplate: 'Bảng lương kỳ {{period}} — Lương NET: {{netSalary}} VND',
  },
  {
    id: 'tpl_production_completed', type: 'production.completed', name: 'Production Completed',
    channels: ['in_app'], isActive: true,
    inAppTemplate: 'LSX {{workOrderNumber}} — {{productName}} đã hoàn thành ({{quantity}} {{unit}})',
  },
  {
    id: 'tpl_low_stock', type: 'inventory.low_stock', name: 'Low Stock Alert',
    channels: ['in_app', 'email'], isActive: true,
    subjectVi: 'Cảnh báo: Tồn kho thấp — {{productName}}',
    inAppTemplate: '⚠️ {{productName}} ({{productCode}}) — Tồn kho: {{currentQty}} / Min: {{minQty}} {{unit}}',
  },
  {
    id: 'tpl_journal_pending', type: 'journal.pending_approval', name: 'Journal Pending Approval',
    channels: ['in_app'], isActive: true,
    inAppTemplate: 'Bút toán {{entryNumber}} chờ duyệt — {{description}} — {{amount}} VND',
  },
  {
    id: 'tpl_task_assigned', type: 'task.assigned', name: 'Task Assigned',
    channels: ['in_app', 'email'], isActive: true,
    subjectVi: 'Bạn được giao task: {{taskTitle}}',
    inAppTemplate: 'Task mới: {{taskTitle}} — Dự án: {{projectName}} — Hạn: {{dueDate}}',
  },
];

// ==================== Factory ====================

/**
 * Create a fully configured notification service with ERP templates
 */
export function createNotificationService(emailConfig?: EmailConfig): NotificationService {
  const service = new NotificationService(emailConfig);

  for (const template of ERP_NOTIFICATION_TEMPLATES) {
    service.registerTemplate(template);
  }

  console.log(`[NOTIFICATIONS] Service ready with ${ERP_NOTIFICATION_TEMPLATES.length} templates`);
  return service;
}
