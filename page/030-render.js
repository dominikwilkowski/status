/***************************************************************************************************************************************************************
 *
 * Render module
 *
 * Render DOM elements into graphs from data obtained in the Page.data module.
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
	// @param  [period]  {keyword}        The period/time frame of the data
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.graph = function( $graph, ID, period ) {
		Page.debugging( 'Running render.graph', 'report' );

		var graphData = Page.DATA[ ID + period ]; //where we stored the data in the Page.data module

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
				graph.addColumn({ //We need annotations to show when the server was down
					type: 'string',
					role: 'annotation',
				});
				graph.addColumn({ //some text for those annotations is nice
					type: 'string',
					role: 'annotationText',
				});

				graph.addRows( graphData ); //add data to graph

				chart.draw( graph, Page.GRAPH );

				$graph
					.removeClass('is-loading') //not loading anymore
					.addClass('is-rendered'); //add class so we can remove the loading pseudo element


				//iterate over each mean addition for rendering
				$('.js-status-mean[data-ID="' + ID + '"][data-period="' + period + '"]').not('.js-rendered').each(function iterateAvailability() {
					Page.render.addition( $(this), 'mean', ID, period );
				});

				//iterate over each availability addition for rendering
				$('.js-status-availability[data-ID="' + ID + '"][data-period="' + period + '"]').not('.js-rendered').each(function iterateAvailability() {
					Page.render.addition( $(this), 'availability', ID, period );
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
	// @param  [period]    {keyword}        The period/time frame of the data
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