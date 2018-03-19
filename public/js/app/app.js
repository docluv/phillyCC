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
            .then(function(){

                initMenuToggle();

                if (location.pathname === "/") {

                    loadSessions();

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

                    renderSelectedSessions(savedSessions);

                } else {

                    renderFullSchedule();

                }

            });

    }

    /*faceted search */

    function initFacetedSearch() {

        var csBigChecks = _d.qsa(".big-check");

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

        target.innerHTML = Mustache.render(sessionCardTemplate, { sessions: results });

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