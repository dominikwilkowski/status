/***************************************************************************************************************************************************************
 *
 * Data module
 *
 * Get data from server
 *
 **************************************************************************************************************************************************************/


(function(Page) {

	var module = {};

	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Private function
	// Reformat the data for graph ussage
	//
	// @param  [data]    {object}   The unformatted data coming for the RESTful API
	// @param  [ID]      {string}   The ID of the dataset
	// @param  [period]  {keyword}  The period/timeframe of the data
	//
	// @return         {object}  Formated data object
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	function format( data, ID, period ) {
		Page.debugging( 'Running private data.format', 'report' );

		var graphData = [];         //the new data to-be
		var mean = 0;               //mean of the data
		var availability = 0;       //availability
		var IDstring = ID + period; //ID string for Page.ADDITIONS

		Page.ADDITIONS[ IDstring ] = {};

		for(var i = 0; i < data.length; i++) { //format data
			var annotation = null;
			var annotationText = null;
			var date = moment( data[i].date ).format('MMMM Do YYYY, h:mm a').toString();

			if( data[i].time === -1 ) {
				annotation = 'Down';
				annotationText = 'The service was down on ' + date;
				data[i].time = 0;
				availability ++;
			}
			else {
				mean += parseInt( data[i].time );
			}

			graphData.push([
				moment( data[i].date ).toDate(), //the time we polled the server
				parseInt( data[i].time ),        //the response time
				date + ': ' + data[i].time + 'ms', //text for the tooltip
				annotation,
				annotationText,
			]);
		}

		Page.ADDITIONS[ IDstring ].mean = ( Math.round( ( mean / data.length ) * 100 ) / 100 ) + 'ms';
		Page.ADDITIONS[ IDstring ].availability = ( Math.round( ( ( data.length - availability ) / data.length ) * 100000 ) / 1000 ) + '%';

		return graphData;
	}


	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Public function
	// get data from server and move it to Page.render
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function() {
		Page.debugging( 'Running data.get', 'report' );

		$('.js-status').not('.js-rendered').each(function iterateGraphs() { //iterate over each graph for rendering
			var $this = $(this); //each element to be rendered one by one
			var ID = $this.attr('data-id');
			var period = $this.attr('data-period');
			var url = Page.ENDPOINTS + period + '/' + ID;

			if( period.length < 1 || Page.TIMEFRAME.indexOf( period ) === -1 ) {
				$this
					.addClass('has-error')
					.text('The given period "' + period + '" is not a valid option');
			}
			else {

				$.ajax({
					url: url,
					dataType: 'json',
					timeout: 7000,
					success: function receivedData( data ) {
						Page.debugging( 'Got data for ' + ID, 'receive' );

						$this.addClass('js-rendered');

						Page.render.graph( $this, ID, period, format( data, ID, period ) );
					},
					error: function(jqXHR, status, errorThrown) {
						Page.debugging( 'Data error for ' + ID, 'error' );

						$this
							.addClass('has-error')
							.text('Could not reach the server: ' + errorThrown);
					}
				});

			}
		});
	};


	Page.data = module;

}(Page));