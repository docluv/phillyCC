(function () {

    var campSchedule;

    function initializeApp() {

        initFacetedSearch();

        ccSessions.getSessions()
            .then(function (sessions) {

                console.log(sessions);

                campSchedule = sessions;

            });

    }

    function initFacetedSearch() {

        var csBigChecks = _d.qsa(".big-check");

        for (var index = 0; index < csBigChecks.length; index++) {

            initFacetedFilter(csBigChecks[index]);

        }


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

    initializeApp();

})();