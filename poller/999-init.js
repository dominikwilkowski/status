/***************************************************************************************************************************************************************
 *
 * Application initialization
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initiate application
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Poller.init = () => {
	Poller.debugging.headline(`DEBUG|INFO`, 999);

	//check if we have more than one index installed
	Poller.DATABASE.collection('data').getIndexes(( error, indexes ) => {

		if( indexes === undefined ) { //if there is no index installed
			Poller.debugging.report(`Installing index`, 2);

			Poller.DATABASE.collection('data').createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } ); //set index on expireAt
		}
	});

	Poller.TIME = Date.now(); //save timing for log

	Poller.poll.init(); //start polling
};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Close application/connection to DB
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Poller.close = () => {
	Poller.debugging.report(`Running close`, 1);

	Poller.DATABASE.close(); //close connection

	Poller.log.info(`Poll(${Poller.QUEUE.length}) finished in ${( Date.now() - Poller.TIME )}ms`); //report for log
};


Poller.init(); //start right away