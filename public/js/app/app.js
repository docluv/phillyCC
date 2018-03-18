(function () {

    //initialize campSchedule as an array so the search will work in case it is empty ;)
    var campSchedule = [],
        filteredSessions = [],
        sessionCardTemplate = "";

    function initializeApp() {

        initFacetedSearch();

        initSearch();

        loadSessions();

        loadSessionCardTemplate();

    }

    function loadSessions() {

        ccSessions.getSessions()
            .then(function (sessions) {

                console.log(sessions);

                campSchedule = sessions;

            });

    }

    /*faceted search */

    function initFacetedSearch() {

        var csBigChecks = _d.qsa(".big-check");

        for (var index = 0; index < csBigChecks.length; index++) {

            initFacetedFilter(csBigChecks[index]);

        }


    }

    function removeFilteredSessions(removeTime){

    }

    function addFilteredSessions(addTime){

    }

    function initFacetedFilter(cbLabel) {

        cbLabel.addEventListener("click", function (e) {

            e.preventDefault();

            var cbFor = e.target.getAttribute("for"),
                cb = _d.qs("[name='" + cbFor + "']");

            if (cb.checked) {

                cb.checked = false;
                //push to session time filter

            } else {

                cb.checked = true;
                //pop from session time filter

            }

        });


    }

    /* search */
    function initSearch() {

        var searchBox = _d.qs(".search-query");

        searchBox.addEventListener("keyup", function (evt) {

            if (searchBox.value.length > 3) {

                searchSessions(searchBox.value)
                    .then(renderSearchResults);
            }

        });

    }

    function renderSearchResults(results) {

        var target = _d.qs(".page-content");

        target.innerHTML = Mustache.render(sessionCardTemplate, { sessions: results });

    }

    function searchSessions(term) {

        return new Promise(function (resolve, reject) {

            var results = campSchedule.filter(function (session) {

                return ((session.title.indexOf(term) > -1 || session.body.indexOf(term) > -1)
                        && session.date.indexOf("2018-03-24") > -1);

            });

            resolve(results);

        });

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