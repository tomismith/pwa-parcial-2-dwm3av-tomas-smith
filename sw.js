const nombreCache = "TERCA";


    const archivos = ['/', //archivos a cachear
                'index.html',
                'css/styles.css',
                'css/bootstrap.css',
                'js/checkout.js',
                'js/CarritoClass.js',
                'js/ProductoClass.js',
                'js/index.js',
                'checkout.html',
                'img/banner terca.jpg',
                'img/banner terca.png',
                'img/icons/icon-16x16.png',
                'img/icons/icon-144x144.png',
                'img/icons/icon-512x512.png',
];



self.addEventListener('install', precaching => {
    self.skipWaiting();
    precaching.waitUntil(
        caches.open(nombreCache)
            .then(cache => {
                console.log('Se cachearon los archivos');
                return cache.addAll(archivos.map(url => new Request(url).url)) // Modify this line
                    .catch(error => {
                        console.error('Error al cachear archivos:', error);
                    });
            })
    );
});




self.addEventListener('fetch', cargarCache => {
    cargarCache.respondWith(
        caches
            .match(cargarCache.request) // busca en el caché
            .then(respuesta => {
                if (respuesta) {
                    return respuesta;
                }

                const requestUrl = new URL(cargarCache.request.url);
                // Evitar poner en caché solicitudes con el esquema 'chrome-extension'
                if (requestUrl.protocol === 'chrome-extension:') {
                    return fetch(cargarCache.request);
                }

                let peticionCache = cargarCache.request.clone(); // clonamos la petición

                return fetch(peticionCache) // hacemos la petición
                    .then(respuesta => {
                        if (!respuesta) { // si no hay respuesta
                            return respuesta;
                        }
                        let respuestaCache = respuesta.clone(); // clonamos la respuesta
                        caches
                            .open(nombreCache)
                            .then(cache => {
                                cache.put(peticionCache, respuestaCache);
                            })
                        return respuesta;
                    })
            })
    );
});