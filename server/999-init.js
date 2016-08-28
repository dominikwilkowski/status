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
	Server.SERVER.get( '/status/:period/:ID', Server.data.get )

	Server.SERVER
		//server
		.listen(1338, () => {
				Server.debugging.report(`Running server on http://localhost:8081`, 1);
	});
};


Server.init(); //self-start