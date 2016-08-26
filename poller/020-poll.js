/***************************************************************************************************************************************************************
 *
 * Poll module
 *
 * Poll each item in the Poller.QUEUE and get record time.
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Http = require('http');
const Request = require('request');


Poller.poll = (() => {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// converting, [add string to text]
//
// @param  [item]  {object}   The item object with options in format: { ID: '[string]', url: '[string]', kind: '[keyword] get|post', form: [object] }
//
// @return         {promise}  An {object} in format: { ID: '[string]', time: [integer] }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const request = ( item ) => {
		Poller.debugging.report(`Running request for "${item.ID}"`, 1);

		let start = Date.now(); //starting timing

		if( item.kind === 'get' ) { //GET method
			Poller.debugging.send(`request: shooting off GET request`, 1);

			return new Promise(function( resolve, reject ) {
				Http.get({ host: item.url }, ( error, response ) => {
					error = response = ''; //cleaning up after myself

					resolve({ //we return ID and time so we know what time goes where in the DB
						ID: item.ID,
						time: ( Date.now() - start )
					});
				});
			});
		}

		else if( item.kind === 'post' ) {  //POST method
			Poller.debugging.send(`request: shooting off POST request`, 1);

			return new Promise(function( resolve, reject ) {
				Request.post({
					url: item.url,
					form: item.form,
					encoding: 'binary',
					headers: {
						'User-Agent': 'ping',
					},
				}, ( error, response ) => {
					error = response = ''; //cleaning up after myself

					resolve({
						ID: item.ID,
						time: ( Date.now() - start )
					});
				});
			});

		}
	}


	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// initialize polling by going through Poller.QUEUE
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		init: () => {
			Poller.debugging.report(`Running poll.init`, 1);

			for( let item of Poller.QUEUE ) {
				request( item ).then(( item ) => {

					Poller.debugging.received(`poll.init: ${item.ID} with ${item.time}ms`, 1);

					Poller.db.save({
						ID: item.ID,
						time: item.time,
						date: new Date(),
					});

				});
			};
		},

	}
})();