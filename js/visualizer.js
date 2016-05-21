var visualizerService = (function($){

	function getMentions(activities, word){
		var mentions = 0;
		var regex = new RegExp(word.toLowerCase(), 'g');
		activities.forEach(function(activity){
			// console.log(activity.activity_message.toLowerCase());
			var message = activity.activity_message.toLowerCase();
			var matchFound = message.match(regex);
			// console.log(matchFound);
			if(matchFound){
				mentions += matchFound.length;
			}
			// console.log(mentions);
			// mentions += message.match(regex).length;
		});
		// console.log(mentions);
		return mentions;
	}

	function init(){

	}

	return{
		getMentions: getMentions,
		init: init
	}
})(jQuery);