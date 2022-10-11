/*
    Inspect Headers and Check against a List of Required / Optional Headers
    @scheff Oct 2022
    (c) F5

    Shamelessly built from one of Liam Crilly's github repos

    Include this JS in your nginx.conf:
    js_include validateheaders.js

    then you need to call the JS with the following:
    js_set $headers_json headers_to_json;

    you now have the headers in the $headers_json variable in your nginx.conf

*/

function headers_to_json(r) {
    var kvpairs = '';
    for (var header in req.headers) {
        if ( kvpairs.length ) {
            kvpairs += ',';
        }
        kvpairs += '"' + header + '":';
        if ( isNaN(r.headers[header]) ) {
            kvpairs += '"' + r.headers[header] + '"';
        } else {
            kvpairs += req.headers[header];
        }
    }
    return kvpairs;
}
