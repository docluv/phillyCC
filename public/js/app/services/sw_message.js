( function () {

    "use strict";

    pubcon.utils.nameSpace( "pubcon.sw_message" );

    var messageHandlers = [];

    /*
        {
            event: "event name",
            handler: function(event){}
        }
    */
    function registerHandler( handler ) {

        messageHandlers.push( handler );

    }

    function sendMessage( msg ) {

        if ( navigator.serviceWorker.controller ) {
            navigator.serviceWorker.controller
                .postMessage( msg );
        }

    }

    if ( navigator.serviceWorker ) {

        navigator.serviceWorker.onmessage = function ( evt ) {

            var message;

            if ( typeof evt.data === "string" ) {
                message = JSON.parse( evt.data );
            } else {
                message = evt.data;
            }

            for ( let index = 0; index < messageHandlers.length; index++ ) {

                if ( messageHandlers[ index ].event === message.event ) {

                    messageHandlers[ index ].handler( evt );

                    index = messageHandlers.length;

                }

            }

            // var message = JSON.parse( evt.data ),
            //     isRefresh = message.type === "refresh",
            //     isAsset = message.url.includes( "asset" ),
            //     lastETag = localStorage.currentETag,
            //     isNew = lastETag !== message.eTag;

            // if ( isRefresh && isAsset && isNew ) {

            //     if ( lastETag ) {

            //         notice.hidden = false;

            //     }

            //     //this needs to be idb
            //     localStorage.currentETag = message.eTag;

            // }

        };

    }

    pubcon.sw_message = {

        sendMessage: sendMessage,

        registerHandler: registerHandler

    };

}() );