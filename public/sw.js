'use strict';

self.importScripts("js/libs/localforage.min.js",
    "js/libs/mustache.min.js",
    "js/app/sessions.js"
);

const version = "1.03",
    preCache = "PRECACHE-" + version,
    dynamicCache = "DYNAMIC-" + version,
    cacheList = [
        "/",
        "img/phillydotnet.png",
        "js/app/app.js",
        "js/app/sessions.js",
        "js/libs/localforage.min.js",
        "js/libs/mustache.min.js",
        "js/libs/utils.js",
        "css/libs/bootstrap.min.css",
        "css/libs/fontawesome-all.css",
        "css/app/site.css",
        "css/webfonts/fa-solid-900.woff2",
        "api/philly-cc-schedule.json",
        "html/app-shell.html",
        "templates/session-list-item.html",
        "templates/session.html"
    ];

/*  Service Worker Event Handlers */

self.addEventListener("install", event => {

    self.skipWaiting();

    console.log("Installing the service worker!");

    caches.open(preCache)
        .then(function (cache) {

            cache.addAll(cacheList);

        });

});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {
          cacheNames.forEach(value => {
    
            if (value.indexOf(version) < 0) {
              caches.delete(value);
            }
    
          });
    
          console.log("service worker activated");
    
          return;
    
        })
    
      );
    
});

self.addEventListener("fetch", event => {

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {

                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(response => {

                        if (response.ok || response.status === 0) {

                            //I have no clue why the chrome extensions requests are passed through the SW
                            //but I don't like the error messages in the console ;)
                            if (event.request.url.indexOf("chrome-extension") === -1) {

                                let copy = response.clone();

                                //if it was not in the cache it must be added to the dynamic cache
                                caches.open(dynamicCache)
                                    .then(cache => {
                                        cache.put(event.request, copy);
                                    });

                            }

                            return response;

                        }

                    }).catch(err => {

                        if (err.message === "Failed to fetch") {

                            if (event.request.url.indexOf("session") > -1) {

                                return renderSession(event);

                            }

                        }

                    });
            })
    );

});


function getAppShell() {

    return fetch("html/app-shell.html")
        .then(response => {

            if (response.ok) {

                return response.text()
                    .then(html => {

                        return html;

                    });
            }

        });

}

function getSessionTemplate() {

    return fetch("templates/session.html")
        .then(response => {

            if (response.ok) {

                return response.text()
                    .then(html => {

                        return html;

                    });
            }

        });

}

function getSessionBySlug(slug) {

    return fetch("api/philly-cc-schedule.json")
        .then(response => {

            return response.json()

        })
        .then(sessions => {

            let session = sessions.filter(ses => {

                return ses.slug === slug;

            });

            if (session.length > 0) {

                return session[0];

            }

        });

}

function getSlug(url) {

    let slug = url.split("\/"),
        index = slug.length - 1;

    if (slug[index] === "") {

        index--;

    }

    return slug[index];

}

function renderSession(event) {

    let slug = getSlug(event.request.url),
        appShell = "",
        sessionTemplate = "";

    return getAppShell()
        .then(html => {

            appShell = html;

        })
        .then(() => {

            return getSessionTemplate()
                .then(html => {

                    sessionTemplate = html;

                });

        }).then(() => {

            let sessionShell = appShell.replace("<%template%>", sessionTemplate);

            return getSessionBySlug(slug)
                .then((session) => {

                    let sessionPage = Mustache.render(sessionShell, session);

                    //make custom response
                    let response = new Response(sessionPage, {
                        headers: {
                            'content-type': 'text/html'
                        }
                    }),
                        copy = response.clone();

                    caches.open(dynamicCache)
                        .then(cache => {
                            cache.put(event.request, copy);
                        });

                    return response;

                });

        });

};

