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
		DEBUG: [Debug],  //Debug settings
		DEBUGLEVEL: 1,   //Debug level setting
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