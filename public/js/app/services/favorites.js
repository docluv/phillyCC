( function () {

    "use strict";

    pubcon.utils.nameSpace( "pubcon.favorites" );

    var favorites_key = "user_favorites",
        UPDATE_FAVORITES = "update-favorites";

    function getFavorites() {

        return localforage.getItem( favorites_key )
            .then( function ( favorites ) {

                if ( !favorites ) {
                    favorites = [];
                }

                return favorites;

            } );

    }

    function addFavorite( favorite ) {

        return updateFavorite( favorite, "update" );

    }

    function deleteFavorite( favorite ) {

        return updateFavorite( favorite, "delete" );

    }

    function updateFavorite( favorite, action ) {

        return getFavorites()
            .then( function ( favorites ) {

                var updated = false;

                favorites = favorites || [];

                action = action || "update";

                for ( var index = 0; index < favorites.length; index++ ) {

                    if ( favorites[ index ] ) {

                        if ( favorite === favorites[ index ] ) {

                            switch ( action ) {
                                case "update":

                                    favorites[ index ] = favorite;
                                    break;

                                case "delete":

                                    delete favorites[ index ];

                                    break;

                                default:
                                    break;
                            }

                            updated = true;
                            index = favorites.length;
                        }

                    }

                }

                if ( !updated ) {
                    favorites.push( favorite );
                }

                return localforage.setItem( favorites_key, favorites );

            } );

    }


    pubcon.favorites = {

        getFavorites: getFavorites,
        deleteFavorite: deleteFavorite,
        addFavorite: addFavorite

    };

}() );