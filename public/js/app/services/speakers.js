( function () {

    "use strict";

    pubcon.utils.nameSpace( "pubcon.speakers" );

    var apiURL = "speaker";

    var SESSION_KEY = "-speakers",
        SESSION_STALE_KEY = SESSION_KEY + "-expires",
        USER_PROFILE = "-user-profile",
        MAX_LIST_CACHE = 15;

    function getSpeaker( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid speaker selection criteria supplied" );

        }

        return pubcon.data.getItem( {
            id: options.id
        }, apiURL, SESSION_KEY );

    }

    function getSpeakers( options ) {

        return pubcon.data
            .getItems( options, pubcon.apiURLBase + apiURL, SESSION_KEY );

    }

    function searchSpeakers( term ) {

        return getSpeakers()
            .then( function ( speakers ) {

                term = term.toLowerCase();

                return speakers.filter( function ( speaker ) {

                    return ( speaker.name
                        .toLowerCase().indexOf( term ) > -1 );

                } );

            } );

    }


    pubcon.speakers = {

        getSpeaker: getSpeaker,

        getSpeakers: getSpeakers,

        searchSpeakers: searchSpeakers

    };

}() );