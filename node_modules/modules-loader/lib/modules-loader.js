/**
 * @file
 * Loads modules according to defined rules.
 */

var loader = {};

var path = require( 'path' ),
    fs = require( 'fs' ),
    rules = require( './rules' );

/**
 * Array of rules. It's changeable by the user.
 */
loader.rules = {
    'isJavascript': rules.isJavascript,
    'isNotNodeModule': rules.isNotNodeModule,
    'isNotGit': rules.isNotGit
};

/**
 * Main method. Recursively loads the modules that pass the rules.
 *
 * @param folder string
 *   Path of the folder in which it has to recursively load the modules.
 * @return array
 *   Array of the loaded modules.
 */
loader.load = function( folder, callback ) {
    walk( folder, function( err, modules ) {
        if ( err ) {
            throw err;
        }

        // Apply each rule on the modules.
        Object.keys( loader.rules ).forEach( function( key ) {
            modules = loader.rules[ key ]( modules );
        });

        // And load each module.
        callback( loadModules( folder, modules ) );
    });

    /**
     * Loads all the modules and returns them.
     *
     * @param folder string
     *   The original folder.
     * @param modules array
     *   List of file paths to load.
     */
    function loadModules( folderPath, modules ) {
        var obj = {};

        // Load each module on the object with some mangled name.
        // This way, we avoid names conflicts.
        // Example:
        //   - Loaded folder: ./foo
        //   - File path: ./foo/bar/baz.js
        //   - Property name: barBaz
        modules.forEach( function( module ) {

            // Get the correct property name.
            var names = module.split( '/' );

            folderPath.split( '/' ).forEach( function() {
                names.shift();
            });

            // The first won't be capitalized, let's take it off.
            var first = names.shift();

            // Add all the others capitalized.
            names = names.map( function( name ) {
                return name.charAt( 0 ).toUpperCase() + name.slice( 1 );
            }).join( '' );

            // Now the object can have its property.
            obj[ first + names ] = require( module );
        });

        return obj;
    }

    /**
     * Walks a folder recursively and gets the list of its files.
     *
     * @param folder string
     *   The folder name to walk.
     * @param done function
     *   The callback when it's done.
     */
    function walk( folder, done ) {
        var results = [];

        fs.readdir( folder, function( err, list ) {
            if ( err ) {
                return done( err );
            }
            var pending = list.length;
            if ( !pending ) {
                return done( null, results );
            }
            list.forEach( function( file ) {
                file = folder + '/' + file;
                fs.stat( file, function( err, stat ) {
                    if ( stat && stat.isDirectory() ) {
                        walk( file, function( err, res ) {
                            results = results.concat( res );
                            if ( !--pending ) {
                                done( null, results );
                            }
                        });
                    } else {
                        results.push( file );
                        if ( !--pending ) {
                            done( null, results );
                        }
                    }
                });
            });
        });
    }
};

module.exports = loader;

