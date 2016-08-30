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

		google.charts.load( 'current', { packages: ['corechart', 'line'] } ); //load google charts lib

		Page.data.get(); //get data and go from there
	};

}(Page));


Page.init();