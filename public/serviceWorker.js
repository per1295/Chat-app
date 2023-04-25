const LOADING_STATUS = "LOADING_STATUS";
const CONNECTION_STATUS = "CONNECTION_STATUS";

self.addEventListener("install", event => {
    event.waitUntil(caches.open("self-store"));
});

self.addEventListener("fetch", event => {
    event.respondWith(
        (async () => {            
            let client;

            if ( event.clientId ) {
                client = await self.clients.get(event.clientId);
            }

            if ( client ) {
                client.postMessage({
                    type: LOADING_STATUS,
                    payload: {
                        status: "loading"
                    }
                });
            }

            const cache = await caches.open("self-store");
            const { request } = event;
            const { method, headers, keepalive, url } = request;
            const { protocol } = new URL(url);

            let response;

            try {
                const nowResponse = await fetch(request, { method, headers, keepalive });

                if ( !/^chrome\-extension/i.test(protocol) && nowResponse.status < 400 && method.toLowerCase() === "get" ) {
                    await cache.put(request, nowResponse.clone());
                }

                response = nowResponse;
            } catch (error) {
                let cachedResponse = await cache.match(request);

                if ( cachedResponse ) {
                    response = cachedResponse;
                } else {
                    response = new Response(error.name, {
                        status: 500,
                        statusText: error.name
                    });
                }
            }

            if ( client ) {
                client.postMessage({
                    type: LOADING_STATUS,
                    payload: {
                        status: "idle"
                    }
                })
            }
            
            return response;
        })()
    )
});

self.addEventListener("offline", event => {
    let client;

    if ( event.clientId ) {
        client = self.clients.get(event.clientId);
    }

    if ( client ) {
        client.postMessage({
            type: CONNECTION_STATUS,
            payload: {
                status: "offline"
            }
        });
    }
});

self.addEventListener("online", event => {
    let client;

    if ( event.clientId ) {
        client = self.clients.get(event.clientId);
    }

    if ( client ) {
        client.postMessage({
            type: CONNECTION_STATUS,
            payload: {
                status: "online"
            }
        });
    }
});