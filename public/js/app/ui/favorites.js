( function () {

    "use strict";

    var self = window.pubcon.component,
        favClass = "is-favorite",
        favoriteId = "favorite-id",
        btnFavorite = ".btn-favorite";

    function initialize() {

        bindEvents();
        setupFavorites();

    }

    function bindEvents() {

        self.on( btnFavorite, "click", toggleFavorite );

    }

    function setupFavorites() {

        var sessions = self.qsa( btnFavorite );

        pubcon.favorites.getFavorites()
            .then( function ( favorites ) {

                var f = 0,
                    index = 0;

                for ( index = 0; index < sessions.length; index++ ) {

                    var assetId = sessions[ index ].getAttribute( favoriteId ),
                        $icon = sessions[ index ].querySelector( ".far, .fas" );

                    for ( f = 0; f < favorites.length; f++ ) {

                        if ( assetId === favorites[ f ] ) {

                            sessions[ index ].classList.add( favClass );
                            $icon.classList.add( "fa-star" );
                            $icon.classList.remove( "fa-star-empty" );

                            f = favorites.length;

                        }

                    }

                }

            } );

    }

    function toggleFavorite( e ) {

        e.preventDefault();

        var target = e.currentTarget,
            $icon = target.querySelector( ".far, .fas" ),
            assetId = target.getAttribute( favoriteId );

        var isFavorite = !target.classList.contains( favClass );

        if ( isFavorite ) {

            pubcon.favorites.addFavorite( assetId );
            target.classList.add( favClass );
            $icon.classList.add( "fa-star" );
            $icon.classList.remove( "fa-star-empty" );


        } else {

            pubcon.favorites.deleteFavorite( assetId );
            target.classList.remove( favClass );
            $icon.classList.add( "fa-star-empty" );
            $icon.classList.remove( "fa-star" );

        }

        pubcon.sw_message.sendMessage( {
            event: "update-favorites"
        } );


        return false;

    }

    initialize();

}() );