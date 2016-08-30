/***************************************************************************************************************************************************************
 *
 * Data module
 *
 * This module gets the data from the database
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Moment = require('moment');


Server.data = (() => {

	const DB = Server.DATABASE.collection('data'); //database collection

	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// get data for a time period. The request object should include two parameters: request.params.ID {string} and request.params.period {keyword}
//
// @param  [request]  {object}  The request object
// @param  [result]   {object}  The result object
// @param  [next]     {object}  The next object
//
// @return            {object}  Data in json
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		get: ( request, result, next ) => {
			Server.debugging.report(`Running data.get for "${request.params.ID}" within ${request.params.period}`, 1);

			let newDocs = []; //for thinning out the result later
			let timestamp = Moment().subtract( 1, 'd' ).toDate(); //timestand to look for in DB
			let interval = 1; //for thinning out data

			//error handeling
			if( request.params.period.length < 1 || Server.TIMEFRAME.indexOf( request.params.period ) === -1 ) {
				result.send(400, new Error(`Please select the time frame. Allowed keywords are: ${Server.TIMEFRAME.join(', ')}`));
			}

			if( request.params.ID.length < 1 ) {
				result.send(400, new Error(`Please select the ID`));
			}

			//options for timeframes
			if( request.params.period === 'week' ) {
				timestamp = Moment().subtract( 7, 'd' ).toDate();
				interval = 7;
			}

			if( request.params.period === 'month' ) {
				timestamp = Moment().subtract( 30, 'd' ).toDate();
				interval = 30;
			}

			DB.find({
				ID: request.params.ID,
				date: {
					$gte: timestamp,
				},
			}, {
				_id: 0,
				ID: 1,
				time: 1,
				error: 1,
				date: 1,
			}, ( error, docs ) => {

				if( docs.length > 1000 ) { //only when we have enough data to thin out
					for( let i = 0; i < docs.length; i += interval ) { //get every interval-th doc as we don't need every single element from DB
						newDocs.push( docs[ i ] );
					};
				}
				else if ( docs.length === 0 ) {
					result.send(400, new Error(`ID not found`));
				}
				else {
					newDocs = docs;
				}

				result.send( newDocs );
			});
		},

	}
})();