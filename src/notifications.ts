import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
export async function configureReminder(enabled:boolean,time:string){
  if(!Capacitor.isNativePlatform()){
    return !enabled;
  }
  try {
  if(enabled && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return false;
  if(enabled && (await LocalNotifications.requestPermissions()).display!=='granted') return false;
  await LocalNotifications.cancel({notifications:[{id:1200}]});
  if(!enabled) return true;
  const [hour,minute]=time.split(':').map(Number);
  await LocalNotifications.createChannel({id:'training',name:'Training',importance:4,visibility:1,vibration:true});
  await LocalNotifications.schedule({notifications:[{id:1200,channelId:'training',title:'Zeit für Leise',body:'Zeit für dein Mund- und Rachenmuskeltraining.',schedule:{on:{hour,minute},repeats:true,allowWhileIdle:true}}]});
  return (await LocalNotifications.getPending()).notifications.some(n=>n.id===1200);
  } catch { return false; }
}
export const nativeReminders = Capacitor.isNativePlatform();
