/***************************************************************************************************************************************************************
 *
 * Data module
 *
 * Get data from server for an element on the page.
 *
 **************************************************************************************************************************************************************/


(function(Page) {

	var module = {};

	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Private function
	// Reformat the data for graph usage
	//
	// @param  [data]    {object}   The unformatted data coming for the RESTful API
	// @param  [ID]      {string}   The ID of the dataset
	// @param  [period]  {keyword}  The period/time frame of the data
	//
	// @return         {object}  Formated data object
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	function format( data, ID, period ) {
		Page.debugging( 'Running private data.format', 'report' );

		var graphData = [];         //the new data to-be
		var mean = 0;               //mean of the data
		var availability = 0;       //availability
		var IDstring = ID + period; //ID string for Page.ADDITIONS

		Page.ADDITIONS[ IDstring ] = {}; //this is where we store the additions to avoid going through the data again

		for(var i = 0; i < data.length; i++) { //format data
			var annotation = null;
			var annotationText = null;
			var date = moment( data[i].date ).format('MMMM Do YYYY, h:mm a').toString();

			if( data[i].time === -1 ) {
				annotation = 'Down';
				annotationText = 'The service was down on ' + date + ' with error "' + data[i].error + '"';
				data[i].time = 0;
				availability ++; //count how many times we were down
			}
			else {
				mean += parseInt( data[i].time ); //sum up all times for mean calculation
			}

			graphData.push([
				moment( data[i].date ).toDate(),   //the time we polled the server
				parseInt( data[i].time ),          //the response time
				date + ': ' + data[i].time + 'ms', //text for the tooltip
				annotation,                        //we show text for the times a service was down
				annotationText,                    //the text in the tooltip of the annotation
			]);
		}

		//calculate mean
		Page.ADDITIONS[ IDstring ].mean = ( Math.floor( mean / data.length ) ) + 'ms';
		//how much were we up in percent
		Page.ADDITIONS[ IDstring ].availability = ( Math.round( ( ( data.length - availability ) / data.length ) * 100000 ) / 1000 ) + '%';

		return graphData;
	}


	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Public function
	// get data from server and move it to Page.render
	//
	// @param  [$element]  {jQuery object}  The DOM element that has to be converted to a graph
	// @param  [ID]        {string}         The ID of the dataset
	// @param  [period]    {keyword}        The period/time frame of the data
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( $element, ID, period ) {
		Page.debugging( 'Running data.get for ' + ID, 'report' );

		var url = Page.ENDPOINTS + period + '/' + ID; //URL for RESTful server (Act II)

		if( period.length < 1 || Page.TIMEFRAME.indexOf( period ) === -1 ) { //check the period keyword
			$element //mark graph element as broken
				.addClass('has-error')
				.text('The given period "' + period + '" is not a valid option');
		}
		else {

			$.ajax({ //get data from RESTful server (Act II)
				url: url,
				dataType: 'json',
				timeout: 7000,
				success: function receivedData( data ) {
					Page.debugging( 'Got data for ' + ID, 'receive' );

					$element.addClass('js-rendered'); //mark as rendered

					Page.DATA[ ID + period ] = format( data, ID, period ); //store data render and re-renders

					Page.render.graph( $element, ID, period ); //generate the graph now that we have the data
				},
				error: function(jqXHR, status, errorThrown) {
					Page.debugging( 'Data error for ' + ID + ' with: ' + errorThrown, 'error' );

					$element //mark graph element as broken
						.addClass('has-error')
						.text('Could not reach the server: ' + errorThrown);
				}
			});

		}
	};


	Page.data = module;

}(Page));