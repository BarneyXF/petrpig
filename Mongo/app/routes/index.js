const ApiRoutes = require('./api_routes');

module.exports = function(Application, Database)
{
    ApiRoutes(Application, Database);
};