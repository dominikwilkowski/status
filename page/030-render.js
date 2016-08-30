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
	// @param  [period]  {keyword}        The period/timeframe of the data
	// @param  [data]    {object}         The data to be graphed out
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.graph = function( $graph, period, data ) {
		Page.debugging( 'Running render.graph', 'report' );

		google.charts.setOnLoadCallback( function() {
			var graph = new google.visualization.DataTable();
			var chart = new google.visualization.LineChart( $graph[0] ); //the DOM element to be replaced
			var graphData = []; //we have to reformat the data we get from the server

			graph.addColumn('date', 'Date');
			graph.addColumn('number', 'Response time');
			graph.addColumn({ //tooltip gets it's own column so we can format it
				type: 'string',
				role: 'tooltip',
			});

			for(var i = 0; i < data.length; i++) { //format data
				graphData.push([
					moment( data[i].date ).toDate(), //the time we polled the server
					parseInt( data[i].time ),        //the response time
					moment( data[i].date ).format('MMMM Do YYYY, h:mm a').toString() + ': ' + data[i].time + 'ms', //text for the tooltip
				]);
			}

			graph.addRows( graphData );

			chart.draw(graph, { //chart options
				colors: ['#000'],
				hAxis: {
					title: 'Date',
					slantedText: false,
					maxAlternation: 1,
				},
				vAxis: {
					title: 'Response time',
				},
				legend: {
					position: 'none'
				},
				chartArea: {
					width: '500',
					height: '200'
				},
				// trendlines: {
				// 	0: {
				// 		color: 'blue',
				// 		lineWidth: 1,
				// 	},
				// },
				width: 600,
				height: 270,
			});

			$graph.addClass('is-rendered'); //add class so we can remove the loading pseudo element
		});
	};


	Page.render = module;

}(Page));