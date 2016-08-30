/***************************************************************************************************************************************************************
 *
 * Application framework and settings
 *
 * Status, a network status tool in three acts
 * Act I: POLLER, the part of the application that polls services to record response time.
 *
 * @license    https://raw.githubusercontent.com/dominikwilkowski/status/master/LICENSE  GNU GPLv3
 * @author     Dominik Wilkowski  hi@dominik-wilkowski.com
 * @repository https://github.com/dominikwilkowski/status
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Mongojs = require('mongojs');
const CFonts = require(`cfonts`);
const Chalk = require(`chalk`);


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Constructor
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Poller = (() => { //constructor factory
	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		DEBUG: false,  //Debug settings
		DEBUGLEVEL: 3,   //Debug level setting
		TIMEOUT: 3500,   //when we stop waiting for the request and call it a fail
		MAXDAYS: 31,     //how many days of data we retain in the database
		DATABASE: Mongojs( 'mongodb://127.0.0.1:27017/status', ['data'] ), //mongo DB connection
		SLACKURL: `https://hooks.slack.com/services/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`, //slack API URL
		QUEUE: [
			{
				ID: 'getNormal',
				options: {
					uri: 'http://localhost:8081',
					method: 'GET',
				},
			},
			{
				ID: 'postNormal',
				options: {
					uri: 'http://localhost:8081',
					method: 'POST',
					form: {},
					encoding: 'binary',
				},
			},
			{
				ID: 'getDelayed',
				options: {
					uri: 'http://localhost:8080',
					method: 'GET',
				},
			},
			{
				ID: 'postDelayed',
				options: {
					uri: 'http://localhost:8080',
					method: 'POST',
					form: {},
					encoding: 'binary',
				},
			},
			{
				ID: 'notExist',
				options: {
					uri: 'http://192.241.237.199',
					method: 'GET',
				},
			},
		],


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Debugging prettiness
//
// debugging, Print debug message that will be logged to console.
//
// @method  headline                      Return a headline preferably at the beginning of your app
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  report                        Return a message to report starting a process
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  error                         Return a message to report an error
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  interaction                   Return a message to report an interaction
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  send                          Return a message to report data has been sent
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  received                      Return a message to report data has been received
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: {

			headline: ( text ) => {
				if( Poller.DEBUG ) {
					CFonts.say(text, {
						'align': 'center',
						'colors': ['cyan', 'gray'],
						'maxLength': 12,
					});
				}
			},

			report: ( text, level = 99 ) => {
				if( Poller.DEBUG && level >= Poller.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.bold.green(' \u2611  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			error: ( text, level = 99 ) => {
				if( Poller.DEBUG && level >= Poller.DEBUGLEVEL ) {
					console.log(Chalk.bgRed(`\n${Chalk.white(' \u2612  ')} ${Chalk.white(`${text} `)}`));
				}
			},

			interaction: ( text, level = 99 ) => {
				if( Poller.DEBUG && level >= Poller.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.blue(' \u261C  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			send: ( text, level = 99 ) => {
				if( Poller.DEBUG && level >= Poller.DEBUGLEVEL ) {
					console.log(Chalk.bgBlue(`\n${Chalk.bold.white(' \u219D  ')} ${Chalk.white(`${text} `)}`));
				}
			},

			received: ( text, level = 99 ) => {
				if( Poller.DEBUG && level >= Poller.DEBUGLEVEL ) {
					console.log(Chalk.bgGreen(`\n${Chalk.bold.black(' \u219C  ')} ${Chalk.black(`${text} `)}`));
				}
			}
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Log to console.log
//
// Log to console and in extension save in log file regardless of debug mode
//
// @method  info                       Log info to console.log and in extension to node log file
//          @param   [text]  {string}  The sting you want to log
//          @return  [ansi]            output
//
// @method  error                      Log error to console.log and in extension to node log file
//          @param   [text]  {string}  The sting you want to log
//          @return  [ansi]            output
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		log: {

			info: ( text ) => {
				console.log(`${Chalk.bold.gray(`Info `)} ${new Date().toString()}:  ${text}`);
			},

			error: ( text ) => {
				console.log(`${Chalk.bold.red(`ERROR`)} ${new Date().toString()}:  ${text}`);
			},
		}
	}

})();
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

			Poller.close();
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

						Poller.db.save({ //save time into DB
							ID: item.ID,
							time: item.time,
						});

						checkLast( counter ); //close connection after last request
					})

					//on reject
					.catch(( item ) => {
						Poller.debugging.error(`poll.init: failed to request ${item.ID} with ${item.error}`, 3);

						Poller.db.save({ //save error into DB
							ID: item.ID,
							time: -1,
							error: item.error,
						});

						Poller.fallback.run({ ID: item.ID, error: item.error }); //run fallback

						counter ++; //count requests

						checkLast( counter ); //close connection after last request
				});
			};
		},

	}
})();
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