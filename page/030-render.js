/***************************************************************************************************************************************************************
 *
 * Render module
 *
 * Render DOM elements into graphs from data optained in the Page.data module.
 *
 **************************************************************************************************************************************************************/


(function(Page) {

	var module = {};

	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Public function
	// render all elements on the page that have not been rendered
	//
	// @param  [$graph]  {jQuery object}  The DOM element that has to be converted to a graph
	// @param  [ID]      {string}         The ID of the dataset
	// @param  [period]  {keyword}        The period/timeframe of the data
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.graph = function( $graph, ID, period ) {
		Page.debugging( 'Running render.graph', 'report' );

		let graphData = Page.DATA[ ID + period ]; //where we stored the data in the Page.data module

		if( graphData === undefined ) { //no data = no graph
			Page.debugging( 'render.graph: No data available for "' + ID + period + '"', 'error' );

			$graph //mark graph element as broken
				.addClass('has-error')
				.text('The data was lost inside this app :(');
		}
		else {
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

				graph.addRows( graphData ); //add data to graph

				chart.draw(graph, { //chart options
					title: 'The network response time of ' + ID + ' for a ' + period, //not sure where this is used
					titlePosition: 'none', //we certainly don’t want to show it
					colors: ['#42a5f5'], //the line color
					backgroundColor: '#263238', //background color duh!
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
						isHtml: true, //we need to remove some of the css here which is only possible if the tooltips are rendered as HTML
					},
					height: 270, //seems like a sweet spot
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
		}
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
		var content = Page.ADDITIONS[ IDstring ]; //where we stored the additions in the Page.data module

		if( content !== undefined && content[ addition ] !== undefined ) {
			$element
				.text( content[ addition ] ); //add the addition to the element
		}
		else { //this will rarely happen
			$element //mark as broken
				.addClass('has-error')
				.text( content );
		}

		$element.addClass('js-rendered'); //mark as rendered
	};


	Page.render = module;

}(Page));