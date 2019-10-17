var ccSessions = ( function () {

    var sessionTimesKey = "session-times",
        savesSessions = "save-sessions";

    var ccSessions = {

        campSchedule: [],

        selectedTimes: [
            "08:30", "10:00", "11:30", "12:00", "13:30", "15:00"
        ],

        getSessions: function () {

            var self = this;

            return fetch( "https://sessionize.com/api/v2/z6qqazzx/view/all" )
                .then( function ( response ) {

                    if ( response.ok ) {

                        return response.json()
                            .then( function ( sessions ) {

                                self.campSchedule = sessions;

                                return sessions;

                            } );


                    } else {

                        throw "session fetch failed";
                    }

                } );

        },

        saveSession: function ( id ) {

            var self = this;

            return this.getSessionById( id )
                .then( function ( session ) {

                    return self.getSavedSessions()
                        .then( function ( sessions ) {

                            sessions = sessions || [];

                            //this can stack up duplicates so need to fix...but I am tired.
                            sessions.push( session );

                            return localforage.setItem( savesSessions, sessions );

                        } );

                } );

        },

        removeSession: function ( id ) {

            var self = this;

            return this.getSavedSessions()
                .then( function ( sessions ) {

                    if ( sessions.length > 0 ) {

                        sessions = sessions.filter( function ( session ) {

                            return session.id != id;

                        } );

                        return localforage.setItem( savesSessions, sessions );

                    }

                } );

        },

        getSessionById: function ( id ) {

            id = parseInt( id, 10 );

            return this.getSessions()
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

        },

        searchSessions: function ( term ) {

            var self = this;

            term = term.toLowerCase();

            return new Promise( function ( resolve, reject ) {

                var results = self.campSchedule.filter( function ( session ) {

                    return ( ( session.title.toLowerCase().indexOf( term ) > -1 ||
                            session.body.toLowerCase().indexOf( term ) > -1 ||
                            session.speaker.toLowerCase().indexOf( term ) > -1 ) &&
                        session.date.indexOf( "2018-03-24" ) > -1 );

                } );

                resolve( results );

            } );

        },

        getSavedSessions: function () {

            return localforage.getItem( savesSessions );

        },

        getSelectedTimes: function () {

            var self = this;

            return localforage.getItem( sessionTimesKey )
                .then( function ( times ) {

                    if ( !times ) {

                        return self.updateSessionTimes( self.selectedTimes )
                            .then( function () {

                                return self.selectedTimes;

                            } );

                    }

                    return times;

                } );

        },

        addSessionTime: function ( sessionTime ) {

            var self = this;

            return self.getSelectedTimes()
                .then( function ( times ) {

                    times.push( sessionTime );

                    return self.updateSessionTimes( times );

                } );

        },

        removeSessionTime: function ( sessionTime ) {

            var self = this;

            return self.getSelectedTimes()
                .then( function ( times ) {

                    times = times.filter( function ( time ) {

                        return time != sessionTime;

                    } );

                    return self.updateSessionTimes( times );

                } );

        },

        updateSessionTimes: function ( times ) {

            return localforage.setItem( sessionTimesKey, times );

        },

        getSessionTimes: function () {

            return localforage.getItem( sessionTimesKey );

        },

        getFacetedSessions: function () {

            var self = this;

            return self.getSelectedTimes()
                .then( function ( times ) {

                    return self.campSchedule.filter( function ( session ) {

                        return times.indexOf( session.time ) > -1;

                    } );

                } );

        }

    };

    return ccSessions;

} )();