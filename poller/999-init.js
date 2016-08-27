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
		if( indexes.length < 2 ) { //if there is no index installed
			Poller.debugging.report(`Installing index`, 2);

			Poller.DATABASE.collection('data').createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } ); //set index on expireAt
		}
	});

	Poller.poll.init();
};


Poller.init();