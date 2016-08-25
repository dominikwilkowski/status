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
				GUI.debugging( 'GUI: Tab detected', 'report' );

				$('html').addClass('is-keyboarduser');

				$('body').off('keydown');
			}
		});
	};

}(Page));


Page.init();