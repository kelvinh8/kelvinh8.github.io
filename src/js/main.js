import '../../node_modules/material-design-icons/iconfont/material-icons.css';
import '../../node_modules/materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import './ui.js';
import '../css/main.css';

$(document).ready(()=>{
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker registered successfully.'))
    .catch(error => console.log('Service Worker registration failed:', error));
  }else{
    console.log('Browser not supported')
  };
  if ('Notification' in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }
      
      if (('PushManager' in window)) {
        navigator.serviceWorker.getRegistration().then(function(registration) {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BEnLS2TVt4B6It1HvUrG5STb94eTrF-6RAqn4wgxSKT-drgBWXcEHHs3RKx8tC2_5i6LUnsgLL3pHDBFI_YM-lQ")
            }).then(function(subscribe) {
                console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                    null, new Uint8Array(subscribe.getKey('p256dh')))));
                console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                    null, new Uint8Array(subscribe.getKey('auth')))));
            }).catch(function(e) {
                console.error('Tidak dapat melakukan subscribe ', e.message);
            });
        });
    }
    });
  }
})
const urlBase64ToUint8Array = (base64String)=>{
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
