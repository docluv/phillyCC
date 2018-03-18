(function () {

    var sessionTimesKey = "session-times",
        savesSessions = "save-sessions";

    window.ccSessions = {

        campSchedule: [],

        selectedTimes: [
            "08:30", "10:00", "11:30", "12:00", "13:30", "15:00"
        ],

        getSessions: function () {

            var self = this;

            return fetch("api/philly-cc-schedule.json")
                .then(function (response) {

                    if (response.ok) {

                        return response.json()
                            .then(function (sessions) {

                                self.campSchedule = sessions;

                                return sessions;

                            });


                    } else {

                        throw "session fetch failed";
                    }

                });

        },

        getSession: function (id) {

            return fetch("api/sessions/" + id + ".json")
                .then(function (response) {

                    if (response.ok) {

                        return response.json();

                    } else {

                        throw "session fetch failed";
                    }

                });

        },

        saveSession: function (session) {

            return getSavedSessions()
                .then(function (sessions) {

                    sessions = sessions || [];

                    //this can stack up duplicates so need to fix...but I am tired.
                    sessions.push(session);

                    localforage.setItem(savesSessions, sessions);

                });

        },

        removeSession: function (id) {

            return getSavedSessions()
                .then(function (sessions) {

                    if (sessions.length > 0) {

                        sessions = sessions.filter(function (session) {

                            return session.id != id;

                        });

                        localforage.setItem(savesSessions, sessions);

                    }

                });

        },

        searchSessions: function (term) {

            var self = this;

            return new Promise(function (resolve, reject) {

                var results = self.campSchedule.filter(function (session) {

                    return ((session.title.indexOf(term) > -1 || session.body.indexOf(term) > -1)
                        && session.date.indexOf("2018-03-24") > -1);

                });

                resolve(results);

            });

        },

        getSavedSessions: function () {

            return localforage.getItem(savesSessions);

        },

        getSelectedTimes: function () {

            var self = this;

            return localforage.getItem(sessionTimesKey)
                .then(function (times) {

                    if (!times) {

                        return self.updateSessionTimes(self.selectedTimes)
                            .then(function () {

                                return self.selectedTimes;

                            });

                    }

                    return times;

                });

        },

        addSessionTime: function (sessionTime) {

            var self = this;

            return self.getSelectedTimes()
                .then(function (times) {

                    times.push(sessionTime);

                    return self.updateSessionTimes(times);

                });

        },

        removeSessionTime: function (sessionTime) {

            var self = this;

            return self.getSelectedTimes()
                .then(function (times) {

                    times = times.filter(function (time) {

                        return time != sessionTime;

                    });

                    return self.updateSessionTimes(times);

                });

        },

        updateSessionTimes: function (times) {

            return localforage.setItem(sessionTimesKey, times);

        },

        getSessionTimes: function () {

            return localforage.getItem(sessionTimesKey);

        },

        getFacetedSessions: function () {

            var self = this;

            return self.getSelectedTimes()
                .then(function (times) {

                    return self.campSchedule.filter(function (session) {

                        return times.indexOf(session.time) > -1;

                    });

                });

        }

    }

})();