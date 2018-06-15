"use strict";

// neo4j cypher helper module
var nconf = require('./Config');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(nconf.get('neo4j-local'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));

if (nconf.get('neo4j') == 'remote') 
{
    driver = neo4j.driver(nconf.get('neo4j-remote'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));
}

exports.GetSession = function (context) 
{
    console.log('Log -- Trying to get session from context');
    if(context.neo4jSession) 
    {
        console.log('Log -- Getting session from context');
        return context.neo4jSession;
    }
    else
    {
        console.log('Warning -- Failed when tried get session from context\nLog -- Creating new session');
        context.neo4jSession = driver.session();
        return context.neo4jSession;
    }
};