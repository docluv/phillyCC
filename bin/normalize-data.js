const fs = require( "fs" ),
    path = require( "path" ),
    utils = require( "./utils" ),
    utf8 = "utf-8";

let codecamp = utils.readJSON( "../public/api/2019.2.json" );

let sessions = [],
    speakers = [];


function getSessionRoom( roomId ) {

    return codecamp.rooms.filter( room => {

        return room.id === roomId;

    } );
}

function getSessionSpeakers( speakers ) {

    let temp = codecamp.speakers.filter( speaker => {

        let match = false;

        for ( let index = 0; index < speakers.length; index++ ) {

            if ( speaker.id === speakers[ index ] ) {

                match = true;

                console.log( speaker.id );

            }

        }

        return match;

    } );

    return temp.map( speaker => {

        return {
            id: speaker.id,
            firstName: speaker.firstName,
            lastName: speaker.lastName,
            profilePicture: speaker.profilePicture
        };

    } );

}

function getSpeakerSessions( sessions ) {

    let temp = codecamp.sessions.filter( session => {

        let match = false;

        for ( let index = 0; index < sessions.length; index++ ) {

            if ( parseInt( session.id, 10 ) === sessions[ index ] ) {

                match = true;

            }

        }

        return match;

    } );

    return temp.map( session => {

        return {
            id: session.id,
            title: session.title
        };
    } );

}


speakers = codecamp.speakers.map( speaker => {

    speaker.sessions = getSpeakerSessions( speaker.sessions );

    return speaker;

} );

sessions = codecamp.sessions.map( session => {

    session.speakers = getSessionSpeakers( session.speakers );
    session.room = getSessionRoom( session.roomId );

    return session;

} );

console.log( sessions[ 0 ].speakers[ 0 ].sessions );

utils.createFile( "../public/api/sessions.json",
    JSON.stringify( sessions ), true );

sessions.forEach( session => {

    utils.createFile( "../public/api/sessions/" + session.id + ".json",
        JSON.stringify( session ), true );

} );

utils.createFile( "../public/api/speakers.json",
    JSON.stringify( speakers ), true );

speakers.forEach( speaker => {

    utils.createFile( "../public/api/speakers/" + speaker.id + ".json",
        JSON.stringify( speaker ), true );

} );