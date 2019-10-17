( function () {

    "use strict";

    window.pubcon = window.pubcon || {};

    //based on bootstrap 4
    var hidden = "hidden",
        show = "show";

    /**
     * contains common methods used to manage UI
     * Assumes Mustache is global
     */
    window.pubcon.component = {

        init: function ( config ) {

            //todo: merge external depenendencies into the core

        },

        toggleHidden: function ( show, hide ) {

            hide.classList.add( hidden );
            show.classList.remove( hidden );

        },

        toggleClass: function ( target, className ) {

            target = this.qsa( target );

            for ( var i = 0; i < target.length; i++ ) {

                target[ i ].classList.toggle( className );

            }

        },

        fetchAndRenderTemplate: function ( src, data ) {

            var self = this;

            return self.fetchTemplate( {
                    src: src
                } )
                .then( function ( template ) {

                    return self.renderTemplate( template, data );

                } );

        },

        renderTemplate: function ( html, data ) {

            return Mustache.render( html, data );

        },

        fetchTemplate: function ( options ) {

            return fetch( options.src )
                .then( function ( response ) {

                    return response.text();

                } );

        },

        parentAttributeValue: function ( target, attrName, level ) {

            var value = target.parentElement.getAttribute( attrName );

            if ( value ) {

                return value;

            } else {

                if ( level && level > 2 ) {
                    return "cardPrinters";
                }

                if ( level === undefined ) {
                    level = 0;
                }

                return this.parentAttributeValue( target.parentElement, attrName, ++level );

            }

        },

        qs: function ( s ) {
            return document.querySelector( s );
        },
        qsa: function ( s ) {
            return document.querySelectorAll( s );
        },
        gei: function ( s ) {
            return document.getElementById( s );
        },
        gen: function ( s ) {
            return document.getElementsByName( s );
        },

        /**
         * Event handler method
         * abstracts addEventListener binding
         */
        on: function ( target, evt, fn, bubble ) {

            if ( typeof target === "string" ) {
                target = this.qsa( target );
            }

            if ( target.length === undefined ) {
                target = [ target ];
            }

            bubble = ( bubble === true ) ? true : false;

            for ( var i = 0; i < target.length; i++ ) {
                target[ i ].addEventListener( evt, fn, bubble );
            }

        },
        off: function ( target, evt, fn, bubble ) {

            if ( typeof target === "string" ) {
                target = this.qsa( target );
            }

            if ( target.length === undefined ) {
                target = [ target ];
            }

            for ( var i = 0; i < target.length; i++ ) {
                target[ i ].removeEventListener( evt, fn, bubble );
            }

        }

    };

    window.pubcon.events = {

        click: "click",
        keyup: "keyup",
        keydown: "keydown",
        change: "change",
        select: "select",
        focus: "focus",
        blur: "blur",
        submit: "submit"
    };

}() );