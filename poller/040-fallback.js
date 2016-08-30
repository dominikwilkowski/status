/***************************************************************************************************************************************************************
 *
 * Fallback module
 *
 * Fallback defines what happens when one service is not reachable for various reasons.
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Slack = require('node-slack');


Poller.fallback = (() => {

	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// Determine wheather and what fallback is to be taken.
//
// @param  [item]  {object}   The ID and error in format: { ID: '[string]', error: '[string] error code' }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		run: ( item ) => {
			Poller.debugging.report(`Running fallback.run for ${item.ID}`, 1);

			if( item.error === 'ETIMEDOUT' ) {
				Poller.debugging.report(`Reporting ${item.ID} failure to slack`, 2);

				const slack = new Slack( Poller.SLACKURL );

				slack.send({
					'text': `ERROR! ${item.ID} down!`,
					'channel': `#status-errors`,
					'username': `Network Status Poller`,
				});
			}
		},

	}
})();