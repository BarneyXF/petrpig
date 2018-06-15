'use strict';

var nconf = require('nconf');

nconf.env(['PORT', 'NODE_ENV']).argv(
{
    'e': {
        alias: 'NODE_ENV',
        describe: 'Set production or development mode.',
        demand: false,
        default: 'development'
    },
    'p': {
        alias: 'PORT',
        describe: 'Port to run on.',
        demand: false,
        default: 8809
    },
    'n': 
    {
        alias: "neo4j",
        describe: "Use local or remote neo4j instance",
        demand: false,
        default: "local"
    }
}).defaults(
{
    'USERNAME': 'neo4j',
    'PASSWORD' : '111111',
    'neo4j': 'local',
    'neo4j-local':  'bolt://localhost:11002',
    'neo4j-remote': 'bolt:http://162.243.100.222:11002',
    'base_url': 'http://localhost:8809',
    'api_path': '/Api/Api'
});

module.exports = nconf;