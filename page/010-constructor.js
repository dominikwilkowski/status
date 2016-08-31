/***************************************************************************************************************************************************************
 *
 * Application framework and settings
 *
 * Status, a network status tool in three acts
 * Act III: PAGE
 *
 * @license    https://raw.githubusercontent.com/dominikwilkowski/status/master/LICENSE  GNU GPLv3
 * @author     Dominik Wilkowski  hi@dominik-wilkowski.com
 * @repository https://github.com/dominikwilkowski/status
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Constructor
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
var Page = (function() {
	return { //constructor factory
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		DEBUG: [Debug],   //Enable/disable debugger
		DEBUGfilter: [],  //filter debug messages
		[debugcomment]ENDPOINTS: 'http://localhost:1338/status/', //Where the server sits
		[prodcomment]ENDPOINTS: 'https://gel.westpacgroup.com.au:8081/status/', //Where the server sits
		TIMEFRAME: [      //allowed keywords for time frame
			'day',
			'week',
			'month',
		],
		DATA: {},         //storing data so we don’t look it up every time we render
		ADDITIONS: {},    //storing additional infos like mean and available here for later reuse


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// debugging prettiness
//
// @param   text  [string]  Text to be printed to debugger
// @param   code  [string]  The urgency as a string: ['headline', 'report', 'error', 'interaction', 'send', 'receive']
//
// @return  [none]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: function Debug( text, code ) {

			if( Page.DEBUGfilter.length > 0 ) {
				var identifier = text.split(': ');
				var output = '';

				for(var i = Page.DEBUGfilter.length - 1; i >= 0; i--) {
					if( identifier[0] === Page.DEBUGfilter[i] ) {
						output = text;
					}
				};

				text = output;
			}

			if( Page.DEBUG && text.length > 0 ) {
				if( code === 'headline' ) {
					console.log('%c' + text, 'font-size: 25px;');
				}

				else if( code === 'report' ) {
					console.log('%c\u2611 ', 'color: green; font-size: 18px;', text);
				}

				else if( code === 'error' ) {
					console.log('%c\u2612 ', 'color: red; font-size: 18px;', text);
				}

				else if( code === 'interaction' ) {
					console.log('%c\u261C ', 'color: blue; font-size: 18px;', text);
				}

				else if( code === 'send' ) {
					console.log('%c\u219D ', 'color: pink; font-size: 18px;', text);
				}

				else if( code === 'receive' ) {
					console.log('%c\u219C ', 'color: pink; font-size: 18px;', text);
				}
			}

		},

	}

}());