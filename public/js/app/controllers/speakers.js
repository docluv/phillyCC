( function () {

    "use strict";

    var self = pubcon.component;

    var profile = {};

    function initialize() {

        requestAnimationFrame( function () {

            fetchItem();

            bindEvents();

        } );

    }

    function fetchItem() {

    }

    function renderResults() {


    }

    function bindEvents() {

        self.on( ".btn-cancel-edit", pubcon.events.click, function ( evt ) {

            evt.preventDefault();

            window.history.back();

            return false;

        } );

        return;

    }


    initialize();

} )();