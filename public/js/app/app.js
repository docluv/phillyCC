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

                loadSessionCardTemplate();

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

        if (document.body.clientWidth < 992) {

            document.body.classList.toggle("menu-toggle");

        }

    }

    //normally I would push this to a controller, but this is a simple, simple app....
    function renderHomeSessions(campSchedule) {

        //check IDB for what times the user last looked for

        //render all sessions by default
        renderSearchResults(campSchedule);

    }

    function initMySessions() {

        var btnMySessions = _d.qs(".btn-my-session");

        btnMySessions.addEventListener("click", function () {

            renderSelectedSessions();

        });

    }

    function renderSelectedSessions(savedSessions) {

        renderSearchResults(savedSessions);

    }

    function renderFullSchedule() {

        ccSessions.getFacetedSessions()
            .then(renderHomeSessions);

    }

    function loadSessions() {

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

            if (searchBox.value.length > 3) {

                ccSessions.searchSessions(searchBox.value)
                    .then(renderSearchResults);
            }

        });

    }

    function renderSearchResults(results) {

        var target = _d.qs(".page-content");

        target.innerHTML = Mustache.render(sessionCardTemplate, { sessions: results });

    }

    /* session card template */

    function loadSessionCardTemplate() {

        fetch("templates/session-list-item.html")
            .then(function (response) {

                if (response.ok) {

                    response.text()
                        .then(function (template) {

                            sessionCardTemplate = template;

                        });

                }

            })

    }

    initializeApp();

})();