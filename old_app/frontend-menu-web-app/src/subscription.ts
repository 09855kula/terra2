//@ts-nocheck
const convertedVapidKey = urlBase64ToUint8Array("BCPZdsNw8jmtJ5Uxde6NMIJlekUsaXj7VMKRXCOdbBGYosB20kM-wKqPr8DO5pbqriZktlLjI5NhOwruHDG69ho")

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    // eslint-disable-next-line
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

function sendSubscription(subscription, desc, title, logo) {
    console.log('desc, title, logo:', desc, title, logo)
    // return fetch(`http://localhost:8081/notifications/subscribe`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         subscription: subscription,
    //         title: title,
    //         description: desc,
    //         icon: logo
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // })
    return fetch(`https://terra.menu/api/graphql/notifications/subscribe`, {
        method: 'POST',
        body: JSON.stringify({
            subscription: subscription,
            title: title,
            description: desc,
            icon: logo
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

let clicked = true

export function subscribeUser(desc, title, logo) {
    // console.log('desc, title, logo:',desc, title, logo)
    if (clicked) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function (registration) {
                if (!registration.pushManager) {
                    console.log('Push manager unavailable.')
                    return
                }
                registration.pushManager.getSubscription().then(function (existedSubscription) {
                    console.log('existedSubscription:', existedSubscription)
                    if (existedSubscription === null) {
                        console.log('No subscription detected, make a request.')
                        registration.pushManager.subscribe({
                            applicationServerKey: convertedVapidKey,
                            userVisibleOnly: true,
                        }).then(function (newSubscription) {
                            console.log('New subscription added.', newSubscription)
                            console.log('desc, title, logo:', desc, title, logo)
                            sendSubscription(newSubscription, desc, title, logo)
                        }).catch(function (e) {
                            if (Notification.permission !== 'granted') {
                                console.log('Permission was not granted.')
                            } else {
                                console.error('An error ocurred during the subscription process.', e)
                            }
                        })
                    } else {
                        console.log('Existed subscription detected.')
                        sendSubscription(existedSubscription, desc, title, logo)
                    }
                })
            })
                .catch(function (e) {
                    console.error('An error ocurred during Service Worker registration.', e)
                })
        }
    } else {
        console.log('Can not reachable to the service worker');
    }
}