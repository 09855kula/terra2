console.log("Service Worker Loaded...");
self.addEventListener('push', async event => {
    const data = event.data.json()
    console.log('New notification', data)
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.description,
            icon: './android-chrome-256x256.png',
            vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
            tag: 'vibration-sample',
            requireInteraction: true,
        })
    );

})

self.addEventListener('notificationclick', function(event) {
    const clickedNotification = event.notification;
    clickedNotification.close();
});