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
		DEBUG: [Debug],  //Debug settings
		DEBUGLEVEL: 1,   //Debug level setting
		DATABASE: Mongojs( 'mongodb://127.0.0.1:27017/status', ['data'] ), //mongo DB connection
		QUEUE: [
			{
				ID: 'GUI website',
				url: 'gel.westpacgroup.com.au',
				kind: 'get',
			},
			{
				ID: 'blender',
				url: '128.199.200.220:8080',
				kind: 'post',
				form: {},
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
					console.log(Chalk.bgWhite(`\n${Chalk.red(' \u2612  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			interaction: ( text, level = 99 ) => {
				if( Poller.DEBUG && level >= Poller.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.blue(' \u261C  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			send: ( text, level = 99 ) => {
				if( Poller.DEBUG && level >= Poller.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.bold.cyan(' \u219D  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			received: ( text, level = 99 ) => {
				if( Poller.DEBUG && level >= Poller.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.bold.cyan(' \u219C  ')} ${Chalk.black(`${text} `)}`));
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