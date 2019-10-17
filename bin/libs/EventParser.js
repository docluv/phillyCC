"use strict";

const _ = require( "lodash" ),
    topics = require( "./topics" ),
    aws = require( "../libs/aws-utils" );


function parseEvent( event ) {

    const eventRecord = event && event.Records && event.Records[ 0 ];

    if ( eventRecord ) {

        if ( eventRecord.eventSource === "aws:s3" && eventRecord.s3 ) {

            console.log( "Parsing S3 event..." );

            return Promise.resolve( eventRecord.s3 );

        } else if ( eventRecord.EventSource === "aws:sns" && eventRecord.Sns ) {

            console.log( "Parsing SNS message..." );

            const snsEvent = JSON.parse( eventRecord.Sns.Message );
            const snsEventRecord = snsEvent.Records && snsEvent.Records[ 0 ];

            if ( snsEventRecord &&
                snsEventRecord.eventSource === "aws:s3" &&
                snsEventRecord.s3 ) {
                return Promise.resolve( snsEventRecord.s3 );
            }
        }
    }

    return Promise.reject( "no valid event source found" );
}

module.exports = {

    parseEvent: function ( event ) {

        return parseEvent( event );

    },

    // assumes SNS message
    nextEvent: function ( message, event ) {

        let msg = aws.parseSNSMessage( message ),
            data = msg.data,
            events = msg.events;

        if ( events && events.length > 0 ) {

            let index = 0;

            if ( event ) {

                index = _.findIndex( events, e => {

                    e === event;

                } );

            }

            return Promise.resolve( aws.publishMessage( {
                "TopicArn": topics[ events[ index ] ],
                "Message": JSON.stringify( {
                    data: data,
                    nextAction: events[ index + 1 ]
                } )
            } ) );

        }

        return Promise.resolve();

    }

};