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
		[debugcomment].use( Restify.fullResponse() ) //we only need headers locally as we have node behind a proxy in prod
		.use( Restify.bodyParser() );

	//routes
	Server.SERVER.get( '/status/:period/:ID', Server.data.get )

	Server.SERVER
		//server
		.listen(Server.PORT, () => {
				Server.debugging.report(`Running server on http://localhost:${Server.PORT}`, 1);
	});
};


Server.init(); //self-start