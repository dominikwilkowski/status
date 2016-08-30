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
	// Public function
	// get data from server and move it to Page.render
	//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function() {
		Page.debugging( 'Running data.get', 'report' );

		$('.js-status').not('.js-rendered').each(function iterateGraphs() { //iterate over each element for toggling
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

						Page.render.graph( $this, period, data );
					},
					error: function(jqXHR, status, errorThrown) {
						Page.debugging( 'Data error for ' + ID, 'error' );

						$this
							.addClass('has-error')
							.text('Could not reach the server: ' + status);
					}
				});

			}
		});
	};


	Page.data = module;

}(Page));