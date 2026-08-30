import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
export async function configureReminder(enabled:boolean,time:string){
  if(!Capacitor.isNativePlatform()){
    if(enabled && 'Notification' in window && Notification.permission==='default') await Notification.requestPermission();
    return enabled && 'Notification' in window ? Notification.permission==='granted' : false;
  }
  await LocalNotifications.cancel({notifications:[{id:1200}]});
  if(!enabled) return true;
  const permission=await LocalNotifications.requestPermissions(); if(permission.display!=='granted') return false;
  const [hour,minute]=time.split(':').map(Number);
  await LocalNotifications.schedule({notifications:[{id:1200,title:'Zeit für Leise',body:'10 Minuten für deine Mund- und Rachenmuskulatur.',schedule:{on:{hour,minute},repeats:true,allowWhileIdle:true}}]}); return true;
}
