( function () {

    "use strict";

    pubcon.utils.nameSpace( "pubcon.sessions" );

    var apiURL = "session";

    var sessionTimesKey = "session-times",
        savesSessions = "save-sessions";

    var SESSION_KEY = "-sessions",
        SESSION_STALE_KEY = SESSION_KEY + "-expires",
        USER_PROFILE = "-user-profile",
        MAX_LIST_CACHE = 15;

    var campSchedule = [],
        selectedTimes = [
            "08:30", "10:00", "11:30", "12:00", "13:30", "15:00"
        ];

    function getSession( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid session selection criteria supplied" );

        }

        return pubcon.data.getItem( {
            id: options.id
        }, apiURL, SESSION_KEY );

    }

    function getSessions() {

        return pubcon.data
            .getItems( {
                item_key: SESSION_KEY,
                url: "api/sessions.json"
            } );

    }

    function searchSessions( term ) {

        return getSessions()
            .then( function ( sessions ) {

                term = term.toLowerCase();

                return sessions.filter( function ( session ) {

                    /*
                    - speakers
                    - time
                    - date
                    */

                    return ( session.title
                        .toLowerCase().indexOf( term ) > -1 );

                } );

            } );

    }

    function saveSession( id ) {

        return getSessionById( id )
            .then( function ( session ) {

                return getSavedSessions()
                    .then( function ( sessions ) {

                        sessions = sessions || [];

                        //this can stack up duplicates so need to fix...but I am tired.
                        sessions.push( session );

                        return localforage.setItem( savesSessions, sessions );

                    } );

            } );

    }

    function removeSession( id ) {

        return getSavedSessions()
            .then( function ( sessions ) {

                if ( sessions.length > 0 ) {

                    sessions = sessions.filter( function ( session ) {

                        return session.id != id;

                    } );

                    return localforage.setItem( savesSessions, sessions );

                }

            } );

    }

    function getSessionById( id ) {

        id = parseInt( id, 10 );

        return getSessions()
            .then( function ( sessions ) {

                var _s = sessions.filter( function ( session ) {

                    return session.id === id;

                } );

                if ( _s && _s.length > 0 ) {

                    return _s[ 0 ];

                } else {
                    return undefined;
                }

            } );

    }

    function getSavedSessions() {

        return localforage.getItem( savesSessions );

    }

    function getSelectedTimes() {

        return localforage.getItem( sessionTimesKey )
            .then( function ( times ) {

                if ( !times ) {

                    return updateSessionTimes( selectedTimes )
                        .then( function () {

                            return selectedTimes;

                        } );

                }

                return times;

            } );

    }

    function addSessionTime( sessionTime ) {

        return getSelectedTimes()
            .then( function ( times ) {

                times.push( sessionTime );

                return updateSessionTimes( times );

            } );

    }

    function removeSessionTime( sessionTime ) {

        return getSelectedTimes()
            .then( function ( times ) {

                times = times.filter( function ( time ) {

                    return time != sessionTime;

                } );

                return updateSessionTimes( times );

            } );

    }

    function updateSessionTimes( times ) {

        return localforage.setItem( sessionTimesKey, times );

    }

    function getSessionTimes() {

        return localforage.getItem( sessionTimesKey );

    }

    function getFacetedSessions() {

        return getSelectedTimes()
            .then( function ( times ) {

                return campSchedule.filter( function ( session ) {

                    return times.indexOf( session.time ) > -1;

                } );

            } );

    }

    pubcon.sessions = {

        getSession: getSession,
        getSessions: getSessions,
        searchSessions: searchSessions,
        getFacetedSessions: getFacetedSessions,
        getSessionTimes: getSessionTimes,
        updateSessionTimes: updateSessionTimes,
        removeSessionTime: removeSessionTime,
        addSessionTime: addSessionTime,
        getSelectedTimes: getSelectedTimes,
        saveSession: saveSession,
        removeSession: removeSession,
        getSessionById: getSessionById,
        getSavedSessions: getSavedSessions

    };

}() );