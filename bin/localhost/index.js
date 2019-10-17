const _utils = require( "../libs/utils" ),
    rootPath = "../public/";

exports.getFile = function ( options ) {

    /*
    {
        Bucket: Bucket,
        key: templates[ templateName ]
    }
    */

    return new Promise( ( resolve, reject ) => {

        try {

            resolve( _utils.readFile( rootPath + options.key ) );

        } catch ( error ) {
            reject( error );
        }

    } );

};


exports.uploadFile = function ( options ) {

    /*
    {
                        Bucket: Bucket,
                            key: slug + "index.html",
                            body: pageHTML,
                            gzip: true,
                            body: body
    }
    */

    return new Promise( ( resolve, reject ) => {

        try {

            _utils.createFile( rootPath + options.key,
                options.body, true );

            resolve();

        } catch ( error ) {
            reject( error );
        }

    } );

};