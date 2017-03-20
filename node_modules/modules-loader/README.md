modules-loader
===

What it's for
---

Loads modules according to defined rules.

Usage
---

    var loader = require( 'modules-loader' ),
        path = require( 'path' );

    loader.load( path.join( __dirname, 'foo', function( modules ) {
        console.log( modules );
    });

Documentation
---

This modules provides the `load` method to load the modules, but also the
`rules` object to define the rules.

### Rules

Some default rules already exist, you can find what they are with:

    console.log( loader.rules );

    {
       'isJavascript': [Function],
       'isNotGit': [Function],
       'isNotNodeModule': [Function]
    }

They're quite explicit :-). The first requires javascript files only, the
second requires files that are *not* in `.git/` folders and the third requires
files that are *not* in `node_modules/` folders.

Writing such a rule is easy. Let's take a look at an example:

    function isJavascript( files ) {
        // The files argument is an array with the list of file paths.
        // Absolute file paths.
        return files.filter( function( file ) {

            // Only return the files ending in .js
            return file.slice( -3 ) === '.js';
        });
    }

Adding your own rule is done this way:

    var loader = require( 'modules-loader' );

    loader.rules.isCustomRule = function( files ) {
        // Your filtering code there.
    };

Deleting an existing rule can be done this way:

    delete loader.rules.isJavascript;

### The load method

The `load` method requires two arguments:

1. The absolute path to the folder in which to load the modules.
2. A callback.

Getting the absolute path of a folder isn't so hard, here is an example:

    var path = require( 'path' );

    console.log( path.join( __dirname, 'foo' ) );

    "/absolute/path/to/foo"

The callback gets the `modules` argument, an object with all the modules
loaded.

Here is an example with the following folder structure:

    foo/
        bar/
            bar.js
        baz/
            baz.js
        bar.js
        baz.js

    loader.load( folder, function( modules ) {
        console.log( modules );
    });

    {
        "barBar.js": [Object object],
        "bazBaz.js": [Object object],
        "bar.js": [Object object],
        "baz.js": [Object object]
    }

Such a naming convention is chosen for the following reasons:

- To avoid names conflicts, the folder is added to the property name.
- Because you might load non-js files, the extension is kept.

Contributors
---

- [Florian Margaine](http://margaine.com)

License
---

MIT License.

