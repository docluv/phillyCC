( function () {

    window.pubcon = window.pubcon || {};

    window.pubcon.utils = {

        parse: function ( obj ) {

            if ( typeof obj === "string" ) {

                obj = JSON.parse( obj );

            }

            return obj;
        },

        stringify: function ( value ) {

            if ( typeof value === "object" ) {
                value = JSON.stringify( value );
            }

            return value;
        },

        nameSpace: function ( root, ns ) {

            if ( !ns ) {
                ns = root;
                root = window;
            }

            var parts = ns.split( '.' ),
                parent = root,
                i;

            // strip redundant leading global
            if ( parts[ 0 ] === root.toString() ) {
                parts = parts.slice( 1 );
            }

            for ( i = 0; i < parts.length; i += 1 ) { // create a property if it doesn't exist

                if ( typeof parent[ parts[ i ] ] === "undefined" ) {
                    parent[ parts[ i ] ] = {};
                }

                parent = parent[ parts[ i ] ];

            }

            return parent;
        },

        queryStringtoJSON: function () {

            var pairs = location.search.slice( 1 ).split( '&' );

            var result = {};
            pairs.forEach( function ( pair ) {
                pair = pair.split( '=' );
                result[ pair[ 0 ] ] = decodeURIComponent( pair[ 1 ] || '' );
            } );

            return result;

        },

        jsonToQueryString: function ( json ) {

            if ( !json ) {
                return "";
            }

            return '?' +
                Object.keys( json ).map( function ( key ) {
                    return encodeURIComponent( key ) + '=' +
                        encodeURIComponent( json[ key ] );
                } ).join( '&' );
        }

    };

}() );