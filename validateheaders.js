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

let required_headers = ['required-header-test', 'user-agent', 'host', 'accept', 'accept-encoding','cache-control', 'accept-language', 'referer', 'pragma', 'upgrade-insecure-requests'];
let optional_headers = ['optional-header-test', 'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-port', 'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest'];
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

function validateheaders(r){
    for(var header in r.rawHeadersIn){
        // r.log "Checking " + header[0];
        const allGoodHeaders = required_headers.concat(optional_headers);
        const index = allGoodHeaders.findIndex(element =>{
            return element.toLowerCase() == header[0].toLowerCase();
        })
        if (index == -1) {
            const newHeader = ["F5_VIOLATION_Unexpected_Header", header[0]];
            r.rawHeadersOut.push(newHeader);
            return "F5_VIOLATION_Unexpected_Header";
            // return header[0];
        }
    }
    return "";
}

function check_required_headers(header){
    const index = required_headers.findIndex(element =>{
        return element.toLowerCase() == header.toLowerCase();
    })
    if (index == -1) {
        return false
    }
    return true
}

function check_optional_header(header) {
    const index = optional_headers.findIndex(element =>{
        return element.toLowerCase() == header.toLowerCase();
    })
    if (index == -1) {
        return false
    }
    return true
}

function check_disallowed_header(header) {
    const index = disallowed_headers.findIndex(element =>{
        return element.toLowerCase() == header.toLowerCase();
    })
    if (index == -1) {
        return false
    }
    return true

}

export default {headers_to_json, validateheaders}