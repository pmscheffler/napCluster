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

let required_headers = ['required-header-test'];
let optional_headers = ['optional-header-test'];
let disallowed_headers = ['disallowed-header-test'];

function add_header(header, headerType){
    if (headerType.tostring().toLowerCase() == 'required') {
        required_headers.push(header);
    }else if (headerType.toString().toLowerCase() == 'optional'){
        optional_headers.push(header);
    } else if (headerType.toString().toLowerCase() == 'disallowed'){
        disallowed_headers.push(header);
    }
}

function headers_to_json(r) {
    var kvpairs = '';
    for (var header in r.rawHeadersIn) {
        if ( kvpairs.length ) {
            kvpairs += ',';
        }
        kvpairs += '"' + r.rawHeadersIn[header][0] + '';

        if(check_disallowed_header(r.rawHeadersIn[header][0])) {
            kvpairs += '(disallowed)":'
            r.log("We have a disallowed header");
        } else if (check_optional_header(r.rawHeadersIn[header][0])) {
            kvpairs += '(optional)":'
            r.log("We have an optional header");
        } else if (check_required_headers(r.rawHeadersIn[header][0])) {
            kvpairs += '(required)":'
            r.log("We have a required header");
        } else {
            kvpairs += '(unexpected)":'
            r.log("We have an unexpected header: " + r.rawHeadersIn[header][0]);
        }

        if ( isNaN(r.rawHeadersIn[header]) ) {
            kvpairs += '"' + r.rawHeadersIn[header][1] + '"';
        } else {
            kvpairs += r.rawHeadersIn[header][1];
        }
    }
    return kvpairs;
}

function check_required_headers(){

}

function check_optional_header() {

}

function check_disallowed_header(header) {
    if (disallowed_headers.includes(header)) {
        return true;
    }
    return false;
}

export default {headers_to_json}