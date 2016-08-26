/***************************************************************************************************************************************************************
 *
 * Database module
 *
 * Save times into DB.
 *
 **************************************************************************************************************************************************************/


Poller.db = (() => {

	const DB = Poller.DATABASE.collection('data')

	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// save item into database
//
// @param  [item]  {object}   The item to be saved in format: { ID: '[string]', time: [integer], date: [Date object] }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		save: ( item ) => {
			Poller.debugging.report(`Running db.save for ${item.ID}`, 1);

			DB.insert(item, ( error, thisInsert ) => {
				if( error || !thisInsert ) {
					Poller.debugging.error(`db.save: DB insert error: ${error}`, 3);
				}
				else {
					Poller.debugging.report(`db.save: saved ${item.ID}`, 2);

					return thisInsert._id; //last insert ID
				}
			});
		},

	}
})();