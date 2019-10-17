class SpeakerManager {

    constructor( data ) {

        this.data = data;

        this.speakerTimesKey = "speaker-times";
        this.savesSpeakers = "save-speakers";

        this.SPEAKER_KEY = "-speakers";
        this.SPEAKER_STALE_KEY = this.SPEAKER_KEY + "-expires";
        this.MAX_LIST_CACHE = 15;

        this.this.campSchedule = [];
        this.this.selectedTimes = [
            "08:30", "10:00", "11:30", "12:00", "13:30", "15:00"
        ];

    }

    getSpeaker( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid speaker selection criteria supplied" );

        }

        return this.data.getItem( {
            id: options.id
        }, apiURL, this.SPEAKER_KEY );

    }

    getSpeakers() {

        return this.data.getItems( {
            item_key: this.SPEAKER_KEY,
            url: "api/speakers.json"
        } );

    }

    searchSpeakers( term ) {

        return getSpeakers()
            .then( speakers => {

                term = term.toLowerCase();

                return speakers.filter( speaker => {

                    return ( speaker.title
                        .toLowerCase().indexOf( term ) > -1 );

                } );

            } )

    }

}