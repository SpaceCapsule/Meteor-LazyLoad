#LazyLoad
This is a small package for loading dependencies when needed.
It was original built into the Cordova package, since it allows to load the cordova.js specific to the device - why this library still holds the parsed `querystring` making it possible to load files depending on a parametre in the querystring eg. `?cordova=android-2.6.0`
I've made the code more general adding options for ready events based on dependency or requirement.

##The api
The api is pretty small:

###LazyLoad.queryString
Its an object holding the parsed querystring.
`http://localhost:3000?test=Hello`

```js
    console.log(LazyLoad.queryString['test']); // Prints "Hello"
```
###LazyLoad.addFile(filePaths, dependencies)
`filePaths` - Can be a string or an array of strings
`dependencies` - Can be a string or an array of strings

addFile is used to define dependencies eg.:
```js
    LazyLoad.addFile('/cordova-android-2.6.0.js', 'android-2.6.0');
```
or
```js
    LazyLoad.addFile([
            '/cordova-2.6.0/android.js'
            '/cordova-2.6.0/plugin-android.js'
        ], 'android-2.6.0');
```
or
```js
    LazyLoad.addFile([
            '/cordova-plugins/plugin-android.js'
        ], ['android-2.6.0', 'android-2.7.0']);
```


###LazyLoad.require(dependency, [onReady])
`dependency` - String
`onReady` - Optional callback - is called when all files needed by the dependency is loaded

When we want to load the files we can do:
```js
    LazyLoad.require('android-2.6.0');
```

or with a callback
```js
    LazyLoad.require('android-2.6.0', function() {
        // Great all the files are loaded, we can get going
    });
```
Files can't be loaded multiple times - even if required or added multiple times. eg.:
```js
    LazyLoad.addFile([
            '/myfile.js'
        ], 'depA');

    LazyLoad.addFile([
            '/myfile.js'
        ], 'depB');
```
*Note that both dependencies `depA` and `depB` requires the same file*
But the file will only be loaded once even if one requires both dependencies:
```js
    LazyLoad.require('depA');
    LazyLoad.require('depB');
```

*Any contributtions and feedback are wellcome, Regz. RaiX*
