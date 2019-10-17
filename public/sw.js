importScripts( "js/libs/localforage.min.js",
    "js/libs/mustache.min.js" );

const version = "0.02",
    preCache = "PRECACHE-" + version,
    cacheList = [ "/",
        "speakers/",
        "sessions/",
        "profile/",
        "about/",
        //        "img/phillycodecamp-logo-1200x334.png", "img/phillycodecamp-logo-992x276.png", "img/phillycodecamp-logo-768x214.png", "img/phillycodecamp-logo-576x160.png", "img/phillycodecamp-logo-460x128.png", "img/phillycodecamp-logo-320x89.png",
        "font/pubcon.woff2?4247060",
        "templates/offline.html",
        "templates/session-list.html",
        "templates/session.html",
        "templates/shell.html",
        "templates/speaker-list.html",
        "templates/speaker.html",
        "css/bootstrap.min.css",
        "css/addtohomescreen.css",
        "css/site.css",
        "css/mdb.min.css",
        "js/libs/addtohomescreen.min.js",
        "js/libs/localforage.min.js",
        "js/libs/mustache.min.js",
        "js/app/services/utils.js",
        "js/app/services/data.js",
        "js/app/services/sessions.js",
        "js/app/services/speakers.js",
        "js/app/services/favorites.js",
        "js/app/ui/component.base.js",
        "js/app/ui/favorites.js",
        "js/libs/share.js",
        "js/app/services/sw_message.js",
        "js/app/app.js",
        "js/app/controllers/search.js"
    ],
    OFFLINE_MSG_KEY = "toggle-online",
    SESSION_KEY = "sessions",
    SPEAKER_KEY = "speakers",
    FAVORITES_KEY = "user_favorites",
    STALE_KEY = "-expires",
    UPDATE_DATA = "update-data",
    UPDATE_FAVORITES = "update-favorites",
    MAX_LIST_CACHE = 120;

self.addEventListener( "install", function ( event ) {

    console.log( "Installing the service worker!" );

    self.skipWaiting();

    event.waitUntil(

        caches.open( preCache )
        .then( cache => {

            cacheList.forEach( url => {

                fetch( url )
                    .then( function ( response ) {
                        if ( !response.ok ) {
                            throw new TypeError( 'bad response status - ' + response.url );
                        }
                        return cache.put( url, response );
                    } )
                    .catch( err => {
                        console.error( err );
                    } );

            } );

        } )

    );

} );

self.addEventListener( "activate", function ( event ) {

    event.waitUntil(

        //wholesale purge of previous version caches
        caches.keys().then( cacheNames => {
            cacheNames.forEach( value => {

                if ( value.indexOf( version ) < 0 ) {
                    caches.delete( value );
                }

            } );

            console.log( "service worker activated" );

            return;

        } )
        .then( () => {

            return getTemplates();

        } )
        .then( () => {

            return updateCachedData();

        } )
        .then( () => {

            return renderSite();
        } )

    );

} );

self.addEventListener( "fetch", function ( event ) {

    event.respondWith(

        caches.match( event.request )
        .then( function ( response ) {

            if ( response ) {
                return response;
            }

            return fetch( event.request )
                .then( response => {

                    if ( response && ( response.ok || response.status === 0 ) ) {

                        return caches.open( "phillycodecamp" )
                            .then( cache => {
                                return cache.put( event.request, response.clone() );
                            } )
                            .then( () => {
                                return response;
                            } );

                    } else {

                        //offline fallback
                    }

                } );
        } )


    );

} );

self.addEventListener( "message", event => {

    switch ( event.data.event ) {

        case UPDATE_DATA:

            updateCachedData();
            break;

        case OFFLINE_MSG_KEY:

            toggleOffline( event.data.state );

            break;

        case UPDATE_FAVORITES:

            updatefavorites();

            break;
        default:

            console.log( event );

            break;
    }

} );


/*
    - fetch sessions and speakers when sw installed
    - trigger update for each page load
    - set time expiration at 60 minutes
    - render all session and speaker pages

*/


function renderSite() {

    let speakers = [],
        sessions = [];

    return localforage.getItem( SESSION_KEY )
        .then( results => {

            sessions = results;

            return localforage.getItem( SPEAKER_KEY );
        } )
        .then( res => {

            speakers = res;

            let pages = [];

            sessions.forEach( session => {

                pages.push( renderPage( "session/" +
                    session.id + "/", "session", session ) );

            } );

            speakers.forEach( speaker => {

                pages.push( renderPage( "speaker/" +
                    speaker.id + "/", "speaker", speaker ) );

            } );

            pages.push( renderPage( "speakers/", "speakers", {
                speakers: speakers
            } ) );

            //render home page
            pages.push( renderPage( location.origin, "sessions", {
                sessions: sessions
            } ) );

            return Promise.all( pages );

        } )
        .then( results => {

            console.log( "site updated" );

        } )
        .then( updatefavorites )
        .catch( err => {

            console.error( err );

        } );

}

let templates = {};

function getTemplates() {

    return getHTMLAsset( "templates/session-list.html" )
        .then( html => {
            templates.sessions = html;
        } )
        .then( () => {

            return getHTMLAsset( "templates/session.html" )
                .then( html => {
                    templates.session = html;
                } );

        } )
        .then( () => {

            return getHTMLAsset( "templates/shell.html" )
                .then( html => {
                    templates.shell = html;
                } );

        } )
        .then( () => {

            return getHTMLAsset( "templates/speaker-list.html" )
                .then( html => {
                    templates.speakers = html;
                } );

        } )
        .then( () => {

            return getHTMLAsset( "templates/speaker.html" )
                .then( html => {
                    templates.speaker = html;
                } );

        } );

}

function renderPage( slug, templateName, data ) {

    let pageTemplate = templates[ templateName ];

    let template = templates.shell.replace( "<%template%>", pageTemplate );

    pageHTML = Mustache.render( template, data );

    let response = new Response( pageHTML, {
        headers: {
            "content-type": "text/html",
            "date": new Date().toLocaleString()
        }
    } );

    return caches.open( "phillycodecamp" )
        .then( cache => {
            cache.put( slug, response );
        } );

}

function updateCachedData() {

    return fetch( "api/sessions.json" )
        .then( response => {

            if ( response && response.ok ) {

                return response.json();

            } else {
                throw {
                    status: response.status,
                    message: "failed to fetch session data"
                };
            }

        } )
        .then( sessions => {

            return localforage.setItem( SESSION_KEY, sessions );

        } )
        .then( () => {

            var dt = new Date();

            dt.setMinutes( dt.getMinutes() + MAX_LIST_CACHE );

            return localforage
                .setItem( SESSION_KEY + STALE_KEY, dt );

        } )
        .then( () => {

            return fetch( "api/speakers.json" )
        } )
        .then( response => {

            if ( response && response.ok ) {

                return response.json();

            } else {
                throw {
                    status: response.status,
                    message: "failed to fetch session data"
                };
            }

        } )
        .then( speakers => {

            return localforage.setItem( SPEAKER_KEY, speakers );

        } )
        .then( () => {

            var dt = new Date();

            dt.setMinutes( dt.getMinutes() + MAX_LIST_CACHE );

            return localforage
                .setItem( SPEAKER_KEY + STALE_KEY, dt );

        } );

}

function updatefavorites() {

    return getFavorites()
        .then( favorites => {

            let actions = [];

            favorites.forEach( id => {

                actions.push( getSessionById( id ) );

            } );

            return Promise.all( actions );

        } )
        .then( sessions => {

            return renderPage( "favorites/", "sessions", {
                sessions: sessions
            } );

        } );

}

function getFavorites() {

    return localforage.getItem( FAVORITES_KEY )
        .then( function ( favorites ) {

            if ( !favorites ) {
                favorites = [];
            }

            return favorites;

        } );

}

function getSessionById( id ) {

    return localforage.getItem( SESSION_KEY )
        .then( sessions => {

            return sessions.find( session => {

                return session.assetId === id;
            } );

        } );

}

function send_message_to_client( client, msg ) {
    return new Promise( function ( resolve, reject ) {
        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function ( event ) {
            if ( event.data.error ) {
                reject( event.data.error );
            } else {
                resolve( event.data );
            }
        };

        client.postMessage( msg, [ msg_chan.port2 ] );
    } );
}

function getHTMLAsset( slug ) {

    return caches.match( slug )
        .then( response => {

            if ( response ) {

                return response.text();

            }

        } );

}