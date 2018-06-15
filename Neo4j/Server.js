const Express = require('express'), 
      BodyParser = require('body-parser'), 
      Path = require('path'), 
      Countries = require('./routes/Countries'), 
      Pigs = require('./routes/Pigs'), 
      Extraditions = require('./routes/Extraditions'), 
      FillingForms = require('./routes/FillingForms'), 
      RequestCitizenships = require('./routes/RequestCitizenships'), 
      TransferOfAsserts = require('./routes/TransferOfAsserts'),  
      Nconf = require('./Utils/Config'), 
      Cors = require('cors'), 
      Application = Express(),
      MethodOverride = require('method-override'),
      SetAuthUser = require('./middlewares/setAuthUser'),
      Neo4jSessionCleanup = require('./middlewares/neo4jSessionCleanup'),
      swaggerJSDoc = require('swagger-jsdoc'), 
      Port = 8809;

Application.use(BodyParser.json());
Application.use(Cors());
//Application.use(Nconf.get('api_path'), Api);

var SwaggerDefinition = 
{
    info: 
    {
        title: 'Neo4j Petr Pig Api(Node/Express)',
        version: '1.0.0',
        description: '',
    },
    host: 'localhost:' + Port,
    basePath: '/',
};

// Options for the swagger docs
var Options = 
{
    // import swaggerDefinitions
    swaggerDefinition: SwaggerDefinition,
    // Pathto the Api docs
    apis: ['./Api/*.js'],
};

// initialize swagger-jsdoc
var SwaggerSpec = swaggerJSDoc(Options);

Application.use('/docs', Express.static(Path.join(__dirname, 'swaggerui')));
Application.set('port', Port);

// Pig's REST API
Application.post('/piggie', Pigs.CreatePig);
Application.get('/piggie/:id', Pigs.GetPig);
Application.put('/piggie/:id', Pigs.UpdatePig);
Application.delete('/piggie/:id', Pigs.DeletePig);

Application.post('/country', Countries.CreateCountry);
Application.get('/country/:name', Countries.GetCountry);
Application.put('/country/:name', Countries.UpdateCountry);
Application.delete('/country/:name', Countries.DeleteCountry);

Application.post('/extradition', Extraditions.CreateExtradition);
Application.get('/extradition', Extraditions.GetExtradition);
Application.put('/extradition', Extraditions.UpdateExtradition);
Application.delete('/extradition', Extraditions.DeleteExtradition);

Application.post('/fillingform', FillingForms.CreateFillingForm);
Application.get('/fillingform', FillingForms.GetFillingForm);
Application.put('/fillingform', FillingForms.UpdateFillingForm);
Application.delete('/fillingform', FillingForms.DeleteFillingForm);

Application.post('/requestcitizenship', RequestCitizenships.CreateRequestCitizenship);
Application.get('/requestcitizenship', RequestCitizenships.GetRequestCitizenship);
Application.put('/requestcitizenship', RequestCitizenships.UpdateRequestCitizenship);
Application.delete('/requestcitizenship', RequestCitizenships.DeleteRequestCitizenship);

Application.post('/transferofasserts', TransferOfAsserts.CreateTransferOfAsserts);
Application.get('/transferofasserts', TransferOfAsserts.GetTransferOfAsserts);
Application.put('/transferofasserts', TransferOfAsserts.UpdateTransferOfAsserts);
Application.delete('/transferofasserts', TransferOfAsserts.DeleteTransferOfAsserts);

Application.listen(Application.get('port'), () => 
{
    console.log('Express server listening on port ' + Application.get('port') + ' see docs at /docs');
});