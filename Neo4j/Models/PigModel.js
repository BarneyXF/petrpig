var _ = require('lodash');

/**
 * * Creates new pig.
 * @param node Json object with 1 parameter: Id - string with MongoDB id of pig.
 * @returns Json object.
 */
exports.Pig = function(node)
{
    var Id = node.properties['Id'];

    _.extend(this, {
       'id': Id,
    });
};