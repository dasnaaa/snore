import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const REMINDER_ID = 1200;
const CHANNEL_ID = 'leise-training';

/**
 * Configure the daily training reminder.
 *
 * Important: the browser Notification API can display notifications, but it
 * cannot schedule a notification for later once the PWA has been suspended or
 * closed. We therefore only report a reminder as enabled when the native
 * Capacitor LocalNotifications scheduler is available. This avoids the old
 * behaviour where the UI said "enabled" although nothing had been scheduled.
 */
export async function configureReminder(enabled: boolean, time: string): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    if (!enabled) return true;

    // Do not pretend that a browser permission equals a scheduled reminder.
    // Reliable PWA reminders require Web Push + a server-side scheduler.
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    return false;
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
    if (!enabled) return true;

    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') return false;

    // Android 8+ uses notification channels. Creating the channel is harmless
    // on platforms where it is not required and makes delivery settings
    // explicit on Android.
    if (Capacitor.getPlatform() === 'android') {
      await LocalNotifications.createChannel({
        id: CHANNEL_ID,
        name: 'Tägliches Training',
        description: 'Erinnerung an deine tägliche Leise-Trainingseinheit',
        importance: 4,
        visibility: 1,
        vibration: true,
      });
    }

    const [hour, minute] = time.split(':').map(Number);
    if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return false;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: 'Zeit für Leise',
          body: '10 Minuten für deine Mund- und Rachenmuskulatur.',
          channelId: Capacitor.getPlatform() === 'android' ? CHANNEL_ID : undefined,
          schedule: {
            on: { hour, minute },
            repeats: true,
            allowWhileIdle: true,
          },
          extra: { route: 'training' },
        },
      ],
    });

    // Verify that the native OS scheduler actually accepted the reminder.
    const pending = await LocalNotifications.getPending();
    return pending.notifications.some((notification) => notification.id === REMINDER_ID);
  } catch (error) {
    console.error('Could not configure training reminder', error);
    return false;
  }
}

/** Show an immediate notification so notification setup can be tested on-device. */
export async function sendTestNotification(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') return false;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID + 1,
          title: 'Leise Erinnerungen funktionieren',
          body: 'Du bekommst deine tägliche Trainingserinnerung zur eingestellten Zeit.',
          channelId: Capacitor.getPlatform() === 'android' ? CHANNEL_ID : undefined,
          schedule: { at: new Date(Date.now() + 1500) },
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Could not send test notification', error);
    return false;
  }
}
