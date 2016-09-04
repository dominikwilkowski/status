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
		TIMEFRAME: [      //allowed keywords for time frame
			'day',
			'week',
			'month',
		],
		DATA: {},         //storing data so we don’t look it up every time we render
		ADDITIONS: {},    //storing additional infos like mean and available here for later reuse
		GRAPH: {          //chart option defaults
			title: 'The network response time', //not sure where this is used
			titlePosition: 'none', //we certainly don’t want to show it
			colors: ['#42a5f5'], //the line color
			backgroundColor: '#263238', //background color duh!
			lineWidth: 1,  //looks nicer with the amount of data
			hAxis: {
				slantedText: false, //nah that looks weird
				maxAlternation: 1, //no alternating multiple lines
				textStyle: {
					color: '#fff',
				},
				gridlines: {
					color: '#556E79',
				},
			},
			vAxis: {
				title: 'Response time',
				titleTextStyle: {
					color: '#42a5f5',
				},
				textStyle: {
					color: '#fff',
				},
				gridlines: {
					color: '#556E79',
				},
			},
			legend: {
				position: 'none' //ugly
			},
			chartArea: {
				height: '200' //height is fixed so annotations can be positioned
			},
			annotations: {
				textStyle: {
					color: '#c80038',
				},
				stem: {
					color: '#c80038',
					length: 202, //position the "down" markers nicely
				},
			},
			tooltip: {
				isHtml: true, //we need to remove some of the css here which is only possible if the tooltip are rendered as HTML
			},
			height: 270, //seems like a sweet spot
		},


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