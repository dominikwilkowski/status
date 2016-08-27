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
const Request = require('request');
const Http = require('http');


Poller.poll = (() => {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// request a service and keep the time.
//
// @param  [item]  {object}   The item object with options in format: { ID: '[string]', options: '[object]' }
//
// @return         {promise}  An {object} in format: { ID: '[string]', time: [integer] }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const request = ( item ) => {
		Poller.debugging.send(`Running request for "${item.ID}"`, 2);

		item.options.headers = { 'User-Agent': 'status-poller' }; //fixed header
		item.options.timeout = Poller.TIMEOUT;

		return new Promise(function( resolve, reject ) {
			let start = Date.now(); //starting timing

			Request( item.options, ( error, response ) => {
				if( error ) {
					reject({ //we return ID for DB
						ID: item.ID,
						error: error.code,
					});
				}

				resolve({
					ID: item.ID,
					time: ( Date.now() - start ),
				});
			});
		});
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// Check if the queue is empty
//
// @param  [counter]  {integer}   The counter of how many requests have resolved or rejected so far
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const checkLast = ( counter ) => {
		Poller.debugging.report(`Running checkLast with "${counter}"`, 1);

		if( counter >= Poller.QUEUE.length ) { //if there are no more requests
			Poller.debugging.report(`checkLast: last iteration reached`, 2);

			Poller.DATABASE.close();

			Poller.log.info(`Poll(${Poller.QUEUE.length}) finished`);
		}
	}


	let counter = 0; //for counting all callbacks and closing mongo connection after

	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// initialize polling by going through Poller.QUEUE
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		init: () => {
			Poller.debugging.report(`Running poll.init`, 1);

			for( let item of Poller.QUEUE ) {
				request( item )

					//on resolve
					.then(( item ) => {
						Poller.debugging.received(`poll.init: ${item.ID} with ${item.time}ms`, 3);

						counter ++; //count requests

						Poller.db.save({ //save into DB
							ID: item.ID,
							time: item.time,
						});

						checkLast( counter ); //close connection after last request
					})

					//on reject
					.catch(( item ) => {
						Poller.debugging.error(`poll.init: failed to request ${item.ID} with ${item.error}`, 3);

						Poller.db.save({ //save into DB
							ID: item.ID,
							time: -1,
							error: item.error,
						});

						counter ++; //count requests

						checkLast( counter ); //close connection after last request
				});
			};
		},

	}
})();