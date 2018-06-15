var Api = require('../Api/Api'), 
	writeError = require('../helpers/response').writeError,
	writeResponse = require('../helpers/response').writeResponse, 
    dbUtils = require('../Utils/DbUtils'), 
    _ = require('lodash');

exports.CreateFillingForm = function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to match defined.', status: 400};
    }
    Api.CreateFillingFormQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.GetFillingForm = function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to match defined.', status: 400};
    }
    Api.ReadFillingFormQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.UpdateFillingForm = function (req, res, next) 
{
    var id = req.body.id;
    var name = req.body.name;
    var newId = req.body.newId;
	var newName = req.body.newName;
	if(typeof name === "undefined" || typeof id ===  "undefined" || (typeof newName === "undefined" && typeof newId ===  "undefined"))
    {
        throw {message: 'Nothing to update defined.', status: 400};
    }
    Api.UpdateFillingFormQuery(dbUtils.GetSession(req), id, name, newId, newName)
        .then(response => writeResponse(res, response))
        .catch(next);
};

exports.DeleteFillingForm = function (req, res, next) 
{
    var id = req.body.id;
	var name = req.body.name;
	if(typeof name === "undefined" || typeof id ===  "undefined")
    {
        throw {message: 'Nothing to delete defined.', status: 400};
    }
    Api.DeleteFillingFormQuery(dbUtils.GetSession(req), id, name)
        .then(response => writeResponse(res, response))
        .catch(next);
};