/***************************************************************************************************************************************************************
 *
 * Application initialization
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initiate application
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Server.init = () => {
	Server.debugging.headline(`DEBUG|INFO`, 999);

	Server.SERVER
		//plugins
		.use( Restify.fullResponse() )
		.use( Restify.bodyParser() );

	//routes
	Server.SERVER.get( '/status/day', Server.get.day )
	Server.SERVER.get( '/status/week', Server.get.week )
	Server.SERVER.get( '/status/month', Server.get.month );

	Server.SERVER
		//server
		.listen(8081, () => {
				Server.debugging.report(`Running server on http://localhost:8081`, 1);
	});
};


Server.init(); //self-start