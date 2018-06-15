var _ = require('lodash');

var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "abcde"));



