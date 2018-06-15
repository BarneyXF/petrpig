var Api = require('../Api/Api'), 
	writeError = require('../helpers/response').writeError,
	writeResponse = require('../helpers/response').writeResponse, 
    dbUtils = require('../Utils/DbUtils'), 
    _ = require('lodash');
    
//! Deprecated methods.

exports.CreateConnection= function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to match defined.', status: 400};
    }
    Api.CreateConnectionQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.GetConnection= function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to match defined.', status: 400};
    }
    Api.ReadConnectionQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.UpdateConnection= function (req, res, next) 
{
    var id = req.body.id;
    var name = req.body.name;
    var newId = req.body.newId;
	var newName = req.body.newName;
	if(typeof name === "undefined" || typeof id ===  "undefined" || (typeof newName === "undefined" && typeof newId ===  "undefined"))
    {
        throw {message: 'Nothing to update defined.', status: 400};
    }
    Api.UpdateConnectionQuery(dbUtils.GetSession(req), id, name, newId, newName)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.DeleteConnection= function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to delete defined.', status: 400};
    }
    Api.DeleteConnectionQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};