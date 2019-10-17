const //fileMgr = require( "../libs/aws-utils" ),
    fileMgr = require( "../localhost" ),
    _utils = require( "../libs/utils" ),
    mustache = require( "mustache" ),
    Bucket = "phillycc.love2dev.com",
    templates = {
        "sessions": "templates/session-list.html",
        "session": "templates/session.html",
        "speakers": "templates/speaker-list.html",
        "speaker": "templates/speaker.html"
    };

let shell = "";

fileMgr.getFile( {
        Bucket: Bucket,
        key: "templates/shell.html"
    } )
    .then( s => {

        shell = s;

    } )
    .catch( err => {
        console.log( "error loading shell: ", err );
    } );


exports.renderPage = function ( slug, templateName, data ) {

    fileMgr.getFile( {
            Bucket: Bucket,
            key: templates[ templateName ]
        } )
        .then( pageTemplate => {

            let template = shell.replace( "<%template%>", pageTemplate );

            return mustache.render(
                template, data );

        } )
        .then( pageHTML => {

            return fileMgr.uploadFile( {
                Bucket: Bucket,
                key: slug + "/index.html",
                body: pageHTML,
                gzip: true
            } );

        } )
        .catch( err => {
            console.log( err );
        } );

};