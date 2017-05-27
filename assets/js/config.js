/**
 * Declare this variable before loading RequireJS JavaScript library
 * To config RequireJS after it’s loaded, pass the below object into require.config();
 * Configure loading modules from the lib directory.
 * For any third party dependencies, like jQuery, place them in the lib folder.
 */
var require = {
    baseUrl: 'assets/js',
    paths: {
        'jquery': 'lib/jquery/jquery',
        'angular': 'lib/angular/angular',
        'bootstrap': 'lib/bootstrap/bootstrap'
    },
    /**
     * Remember: only use shim config for non-AMD scripts, scripts that do not already call define().
     * The shim config will not work correctly if used on AMD scripts,
     * in particular, the exports and init config will not be triggered,
     * and the deps config will be confusing for those cases.
     */
    shim: {
        'angular': {'exports': 'angular'}
    },
    urlArgs: 'v=1.0.0'
};