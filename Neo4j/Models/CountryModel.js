var _ = require('lodash');

exports.Country = function(node)
{
    var Name = node.properties['Name'];

    _.extend(this, 
    {
        'name': Name
    });
}