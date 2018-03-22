"use strict"; //https://love2dev.com/blog/javascript-strict-mode/

(function () {

    //initialize campSchedule as an array so the search will work in case it is empty ;)
    var filteredSessions = [],
        sessionCardTemplate = "";

    function initializeApp() {

        initFacetedSearch();

        initSearch();

        ccSessions.getSessions()
            .then(function () {

                return loadSessionCardTemplate();

            })
            .then(function () {

                initMenuToggle();

                if (location.pathname === "/") {

                    loadSessions();

                } else {

                    initSessionDetails();

                }

            });

    }

    // Menu toggle
    function initMenuToggle() {

        var toggler = _d.qs(".navbar-toggler");

        toggler.addEventListener("click", function (evt) {

            toggleMenu();

        });

    }

    function toggleMenu() {
        /* Choose 992 because that is the break point where BS hides the menu toggle button */
        if (document.body.clientWidth < 992) {

            document.body.classList.toggle("menu-toggle");

        }

    }

    function initMySessions() {

        var btnMySessions = _d.qs(".btn-my-session");

        btnMySessions.addEventListener("click", function () {

            ccSessions.getSavedSessions()
                .then(renderSearchResults);

        });

    }

    function renderFullSchedule() {

        ccSessions.getFacetedSessions()
            .then(renderSearchResults);

    }

    function loadSessions() {

        //attempt to load the user's schedule first, then the 'full' schedule
        ccSessions.getSavedSessions()
            .then(function (savedSessions) {

                if (savedSessions) {

                    renderSearchResults(savedSessions);

                } else {

                    renderFullSchedule();

                }

            });

    }

    /* Session Details */

    function initSessionDetails() {

        var addToScheduleCB = _d.qs(".session-actions label"),
            id = parseInt(addToScheduleCB.getAttribute("value"), 10);

        if (addToScheduleCB) {

            addToScheduleCB.addEventListener("click", function (e) {

                e.preventDefault();

                toggleSessiontoSchedule(e.target);

            });

        }

        ccSessions.getSavedSessions()
            .then(function (sessions) {

                sessions = sessions.filter(function (session) {

                    return session.id === id;

                });

                if (sessions && sessions.length > 0) {

                    var cb = _d.qs("[name='cb" + id + "']");
                    cb.checked = true;
                }

            });

        bindMySessions();

    }

    function toggleSessiontoSchedule(target) {

        var cbFor = target.getAttribute("for"),
            value = target.getAttribute("value"),
            cb = _d.qs("[name='" + cbFor + "']");

        if (cb) {

            if (cb.checked) {

                cb.checked = false;
                //push to session time filter
                ccSessions.removeSession(value);

            } else {

                cb.checked = true;
                //pop from session time filter
                ccSessions.saveSession(value);

            }

        }

    }

    function bindMySessions() {

        var mySessionsBtn = _d.qs(".btn-my-sessions");

        mySessionsBtn.addEventListener("click", function (e) {

            e.preventDefault();

            renderMySessions();

            return false;

        });

    }

    function renderMySessions() {

        return ccSessions.getSavedSessions()
            .then(renderSearchResults);

    }

    /*faceted search */

    function initFacetedSearch() {

        var csBigChecks = _d.qsa(".navigation-panel .big-check");

        for (var index = 0; index < csBigChecks.length; index++) {

            initFacetedFilter(csBigChecks[index]);

        }

        ccSessions.getSelectedTimes()
            .then(function (times) {

                times.forEach(function (sessionTime) {

                    var sessionCB = _d.qs("[name=cb" + sessionTime.replace(":", "") + "]");

                    sessionCB.checked = true;

                });

            });

    }

    function initFacetedFilter(cbLabel) {

        cbLabel.addEventListener("click", function (e) {

            e.preventDefault();

            var cbFor = e.target.getAttribute("for"),
                value = e.target.getAttribute("value"),
                cb = _d.qs("[name='" + cbFor + "']");

            if (cb) {

                if (cb.checked) {

                    cb.checked = false;
                    //push to session time filter
                    ccSessions.removeSessionTime(value)
                        .then(renderFullSchedule);

                } else {

                    cb.checked = true;
                    //pop from session time filter
                    ccSessions.addSessionTime(value)
                        .then(renderFullSchedule);

                }

            }

        });

    }

    /* search */
    function initSearch() {

        var searchBox = _d.qs(".search-query");

        searchBox.addEventListener("keyup", function (evt) {

            evt.preventDefault();

            if (searchBox.value.length > 3 || evt.keyCode === 13) {

                ccSessions.searchSessions(searchBox.value)
                    .then(renderSearchResults);
            }

            return false;

        });

    }

    function renderSearchResults(results) {

        var target = _d.qs(".page-content");

        target.innerHTML = Mustache.render(sessionCardTemplate, {
            sessions: results
        });

    }

    /* session card template */

    function loadSessionCardTemplate() {

        return fetch("templates/session-list-item.html")
            .then(function (response) {

                if (response.ok) {

                    return response.text()
                        .then(function (template) {

                            sessionCardTemplate = template;

                            return;
                        });

                }

                return;

            })

    }

    initializeApp();

    if ('serviceWorker' in navigator) {

        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful

            console.log('ServiceWorker registration successful with scope: ', registration.scope);

        }).catch(function (err) {
            // registration failed :(

            console.log('ServiceWorker registration failed: ', err);
        });

    }

})();