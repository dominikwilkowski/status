/***************************************************************************************************************************************************************
 *
 * Initiate app
 *
 **************************************************************************************************************************************************************/


(function(Page) {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initiate app
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	Page.init = function() {
		if( !window.console ) { //removing console.log from IE8
			console = {
				log: function() {}
			};
		}

		Page.debugging( 'DEBUGGING INFORMATION', 'headline' );

		//remove fallback HTML class
		$('html')
			.removeClass('no-js')
			.addClass('js');

		//detecting tab key press
		$('body').on('keydown', function(e) {
			var keyCode = e.keyCode || e.which;

			if(keyCode == 9) {
				Page.debugging( 'Page: Tab detected', 'report' );

				$('html').addClass('is-keyboarduser');

				$('body').off('keydown');
			}
		});

		if( Page.ENDPOINTS === undefined ) {
			Page.debugging( 'No Endpoint set', 'error' );
		}
		else {

			google.charts.load( 'current', { packages: ['corechart', 'line'] } ); //load Google charts lib

			$('.js-status').not('.js-rendered').each(function iterateGraphs() { //iterate over each graph element for rendering
				var $this = $(this);
				var ID = $this.attr('data-id');
				var period = $this.attr('data-period');

				$this.addClass('is-loading');

				if( Page.DATA[ ID + period ] !== undefined ) { //if we already have the data
					Page.render.graph( $this, ID, period ); //generate graph
				}
				else {
					Page.data.get( $this, ID, period ); //get data
				}
			});

			//making the charts responsive of sorts
			$(window).resize(function() {
				$('.js-rendered').removeClass('js-rendered');

				$('.js-status').not('.js-rendered').each(function iterateGraphs() { //iterate over each graph element for rendering
					var $this = $(this);
					var ID = $this.attr('data-id');
					var period = $this.attr('data-period');

					Page.render.graph( $this, ID, period ); //render graph
				});
			});
		}
	};

}(Page));