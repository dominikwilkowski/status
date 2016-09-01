/***************************************************************************************************************************************************************
 *
 * Application framework and settings
 *
 * Status, a network status tool in three acts
 * Act II: SERVER
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
const Restify = require(`restify`);
const Mongojs = require('mongojs');
const CFonts = require(`cfonts`);
const Chalk = require(`chalk`);


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Constructor
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Server = (() => { //constructor factory
	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		DEBUG: false,  //Debug settings
		DEBUGLEVEL: 1,   //Debug level setting
		PORT: 1338,      //port server is listening on
		TIMEFRAME: [     //allowed keywords for time frame
			'day',
			'week',
			'month',
		],
		SERVER: Restify.createServer({ name: 'Status-Server' }), //start server
		DATABASE: Mongojs( 'mongodb://127.0.0.1:27017/status', ['data'] ), //mongo DB connection

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
				if( Server.DEBUG ) {
					CFonts.say(text, {
						'align': 'center',
						'colors': ['cyan', 'gray'],
						'maxLength': 12,
					});
				}
			},

			report: ( text, level = 99 ) => {
				if( Server.DEBUG && level >= Server.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.bold.green(' \u2611  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			error: ( text, level = 99 ) => {
				if( Server.DEBUG && level >= Server.DEBUGLEVEL ) {
					console.log(Chalk.bgRed(`\n${Chalk.white(' \u2612  ')} ${Chalk.white(`${text} `)}`));
				}
			},

			interaction: ( text, level = 99 ) => {
				if( Server.DEBUG && level >= Server.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.blue(' \u261C  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			send: ( text, level = 99 ) => {
				if( Server.DEBUG && level >= Server.DEBUGLEVEL ) {
					console.log(Chalk.bgBlue(`\n${Chalk.bold.white(' \u219D  ')} ${Chalk.white(`${text} `)}`));
				}
			},

			received: ( text, level = 99 ) => {
				if( Server.DEBUG && level >= Server.DEBUGLEVEL ) {
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
			let timestamp = Moment().subtract( 1, 'd' ).toDate(); //timestamp to look for in DB
			let interval = 1; //for thinning out data

			//error handling
			if( request.params.period.length < 1 || Server.TIMEFRAME.indexOf( request.params.period ) === -1 ) {
				result.send(400, new Error(`Please select the time frame. Allowed keywords are: ${Server.TIMEFRAME.join(', ')}`));
			}

			if( request.params.ID.length < 1 ) {
				result.send(400, new Error(`Please select the ID`));
			}

			//options for time-frames
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
/***************************************************************************************************************************************************************
 *
 * Application initialization
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initiate application
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Server.init = () => {
	Server.debugging.headline(`DEBUG|INFO`, 999);

	Server.SERVER
		//plugins
		// .use( Restify.fullResponse() ) //we only need headers locally as we have node behind a proxy in prod
		.use( Restify.bodyParser() );

	//routes
	Server.SERVER.get( '/status/:period/:ID', Server.data.get )

	Server.SERVER
		//server
		.listen(Server.PORT, () => {
				Server.debugging.report(`Running server on http://localhost:${Server.PORT}`, 1);
	});
};


Server.init(); //self-start