const fs = require( "fs" ),
    path = require( "path" ),
    utils = require( "./utils" ),
    page = require( "./page" ),
    utf8 = "utf-8";

function renderSite() {

    let speakers = utils.readJSON( "../public/api/speakers.json" ),
        sessions = utils.readJSON( "../public/api/sessions.json" );

    let pages = [];

    sessions.forEach( session => {

        pages.push( page.renderPage( "session/" +
            session.id, "session", session ) );

    } );

    speakers.forEach( speaker => {

        pages.push( page.renderPage( "speaker/" +
            speaker.id, "speaker", speaker ) );

    } );

    pages.push( page.renderPage( "speakers/", "speakers", {
        speakers: speakers
    } ) );

    //render home page
    pages.push( page.renderPage( "/", "sessions", {
        sessions: sessions
    } ) );

    return Promise.all( pages );

}


renderSite().then( () => {
        console.log( "done!" );
    } )
    .catch( err => {

        console.log( err );
    } );