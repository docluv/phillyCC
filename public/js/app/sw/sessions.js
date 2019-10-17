class SessionManager {

    constructor( data ) {

        this.data = data;

        this.sessionTimesKey = "session-times";
        this.savesSessions = "save-sessions";

        this.SESSION_KEY = "-sessions";
        this.SESSION_STALE_KEY = this.SESSION_KEY + "-expires";
        this.MAX_LIST_CACHE = 15;

        this.this.campSchedule = [];
        this.this.selectedTimes = [
            "08:30", "10:00", "11:30", "12:00", "13:30", "15:00"
        ];

    }

    getSession( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid session selection criteria supplied" );

        }

        return this.data.getItem( {
            id: options.id
        }, apiURL, this.SESSION_KEY );

    }

    getSessions() {

        return this.data.getItems( {
            item_key: this.SESSION_KEY,
            url: "api/sessions.json"
        } );

    }

    searchSessions( term ) {

        return getSessions()
            .then( sessions => {

                term = term.toLowerCase();

                return sessions.filter( session => {

                    return ( session.title
                        .toLowerCase().indexOf( term ) > -1 );

                } );

            } )

    }

    saveSession( id ) {

        return getSessionById( id )
            .then( session => {

                return getSavedSessions()
                    .then( sessions => {

                        sessions = sessions || [];

                        //this can stack up duplicates so need to fix...but I am tired.
                        sessions.push( session );

                        return localforage.setItem( this.savesSessions, sessions );

                    } );

            } );

    }

    removeSession( id ) {

        return getSavedSessions()
            .then( sessions => {

                if ( sessions.length > 0 ) {

                    sessions = sessions.filter( session => {

                        return session.id != id;

                    } );

                    return localforage.setItem( this.savesSessions, sessions );

                }

            } );

    }

    getSessionById( id ) {

        id = parseInt( id, 10 );

        return getSessions()
            .then( sessions => {

                let _s = sessions.filter( session => {

                    return session.id === id;

                } );

                if ( _s && _s.length > 0 ) {

                    return _s[ 0 ];

                } else {
                    return undefined;
                }

            } );

    }

    getSavedSessions() {

        return localforage.getItem( this.savesSessions );

    }

    selectedTimes() {

        return localforage.getItem( this.sessionTimesKey )
            .then( times => {

                if ( !times ) {

                    return updateSessionTimes( this.selectedTimes )
                        .then( () => {

                            return this.selectedTimes;

                        } );

                }

                return times;

            } );

    }

    addSessionTime( sessionTime ) {

        return getthis.selectedTimes()
            .then( times => {

                times.push( sessionTime );

                return updateSessionTimes( times );

            } );

    }

    removeSessionTime( sessionTime ) {

        return getthis.selectedTimes()
            .then( times => {

                times = times.filter( time => {

                    return time != sessionTime;

                } );

                return updateSessionTimes( times );

            } );

    }

    updateSessionTimes( times ) {

        return localforage.setItem( this.sessionTimesKey, times );

    }

    getSessionTimes() {

        return localforage.getItem( this.sessionTimesKey );

    }

    getFacetedSessions() {

        return getthis.selectedTimes()
            .then( times => {

                return this.campSchedule.filter( session => {

                    return times.indexOf( session.time ) > -1;

                } );

            } );

    }

}