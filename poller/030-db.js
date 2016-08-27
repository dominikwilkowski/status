/***************************************************************************************************************************************************************
 *
 * Database module
 *
 * Save times into DB.
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Moment = require('moment');


Poller.db = (() => {

	const DB = Poller.DATABASE.collection('data'); //database collection

	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// save item into database
//
// @param  [item]  {object}   The item to be saved in format: { ID: '[string]', time: [integer], date: [Date object] }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		save: ( item ) => {
			Poller.debugging.report(`Running db.save for ${item.ID}`, 1);

			item.date = new Date();
			item.expireAt = Moment().add( Poller.MAXDAYS, 'd' ).toDate(); //expire after Poller.MAXDAYS days

			DB.insert(item, ( error, thisInsert ) => {
				if( error || !thisInsert ) {
					Poller.log.error(`db.save: DB insert error: ${error}`);
				}
				else {
					Poller.debugging.report(`db.save: saved ${item.ID}`, 1);

					return thisInsert._id; //last insert ID
				}
			});
		},

	}
})();