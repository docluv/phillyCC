( function () {

    "use strict";

    var self = window.pubcon.component,
        webShare = 'share' in navigator;


    var defaults = {
            quoteTargets: ".share-quote",
            shareBtn: ".btn-share",
            fallback: ".share-buttons"
        },
        options = {};


    function initialize( config ) {

        options = Object.assign( {}, defaults, config );

        displayTargets()
            .then( function () {
                bindShareButtons();
            } );

    }

    function displayTargets() {

        //feature detect to show/hide native or fallback targets
        if ( navigator.share ) {
            // If we have web share enabled use that
            self.toggleClass( options.shareBtn, "d-none" );
        } else {
            // Else do something else to help people share
            // your content
            self.toggleClass( options.fallback, "d-none" );

        }

        return Promise.resolve();

    }

    function bindShareButtons() {

        self.on( options.shareBtn, "click", sendTarget );
        self.on( options.quoteTargets, "click", sendTarget );

    }

    function sendTarget( evt ) {

        evt.preventDefault();

        var target = evt.target;

        if ( webShare ) {

            var share = {
                title: self.getAttributeValue( target, "share-title" ),
                text: self.getAttributeValue( target, "share-text" ),
                url: self.getAttributeValue( target, "share-url" )
            };

            navigator.share( share )
                .then( function () {
                    console.log( 'Successful share' );
                } )
                .catch( function ( error ) {
                    console.log( 'Error sharing', error );
                } );

        }

        return false;

    }

    initialize();

    window.shareMgr = {
        initialize: initialize
    };

} )();