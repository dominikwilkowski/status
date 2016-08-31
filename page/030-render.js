/***************************************************************************************************************************************************************
 *
 * Render module
 *
 * Render DOM elements into graphs
 *
 **************************************************************************************************************************************************************/


(function(Page) {

	var module = {};

	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Public function
	// render all elements on the page that have not been rendered
	//
	// @param  [$graph]  {jQuery object}  The DOM element that has to be converted to a graph
	// @param  [ID]        {string}         The ID of the dataset
	// @param  [period]  {keyword}        The period/timeframe of the data
	// @param  [data]    {object}         The data to be graphed out
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.graph = function( $graph, ID, period, graphData ) {
		Page.debugging( 'Running render.graph', 'report' );

		google.charts.setOnLoadCallback( function() {
			var graph = new google.visualization.DataTable();
			var chart = new google.visualization.LineChart( $graph[0] ); //the DOM element to be replaced

			graph.addColumn('date', 'Date');
			graph.addColumn('number', 'Response time');
			graph.addColumn({ //tooltip gets it's own column so we can format it
				type: 'string',
				role: 'tooltip',
			});
			graph.addColumn({ //We need annitations to show when the server was down
				type: 'string',
				role: 'annotation',
			});
			graph.addColumn({ //some text for those annotations is nice
				type: 'string',
				role: 'annotationText',
			});

			graph.addRows( graphData );

			chart.draw(graph, { //chart options
				title: 'The network response time of ' + ID + ' for a ' + period,
				titlePosition: 'none',
				colors: ['#42a5f5'],
				backgroundColor: '#263238',
				hAxis: {
					slantedText: false,
					maxAlternation: 1,
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
					position: 'none'
				},
				chartArea: {
					width: '500',
					height: '200'
				},
				annotations: {
					textStyle: {
						color: '#c80038',
					},
					stem: {
						color: '#c80038',
						length: 202,
					},
				},
				tooltip: {
					isHtml: true,
				},
				height: 270,
			});

			$graph.addClass('is-rendered'); //add class so we can remove the loading pseudo element

			//iterate over each mean addition for rendering
			$('.js-status-mean[data-ID="' + ID + '"][data-period="' + period + '"]').not('.js-rendered').each(function iterateAvailability() {
				Page.render.addition( $(this), 'mean', $(this).attr('data-id'), $(this).attr('data-period') );
			});

			//iterate over each availability addition for rendering
			$('.js-status-availability[data-ID="' + ID + '"][data-period="' + period + '"]').not('.js-rendered').each(function iterateAvailability() {
				Page.render.addition( $(this), 'availability', $(this).attr('data-id'), $(this).attr('data-period') );
			});
		});
	};


	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Public function
	// render additions
	//
	// @param  [$element]  {jQuery object}  The DOM element that has to be converted
	// @param  [addition]  {keyword}        What kind of addition is it
	// @param  [ID]        {string}         The ID of the dataset
	// @param  [period]    {keyword}        The period/timeframe of the data
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.addition = function( $element, addition, ID, period ) {
		Page.debugging( 'Running render.addition', 'report' );

		var IDstring = ID + period; //ID string for Page.ADDITIONS
		var content = Page.ADDITIONS[ IDstring ];

		if( content !== undefined && content[ addition ] !== undefined ) {
			$element
				.text( content[ addition ] )
				.addClass('js-rendered');
		}
		else {
			console.log('??!!');
			$element
				.addClass('has-error')
				.text( content );
		}

		$element.addClass('js-rendered');
	};


	Page.render = module;

}(Page));