var visualizerService = (function($){


	function filterList(activities, word){

		// check list for regex pattern
		var regex = new RegExp(word.toLowerCase(), 'g');

		function matchesFound(activity){
			return activity.activity_message.toLowerCase().match(regex);
		}
		return activities.filter(matchesFound);
	}

	function getLikes(activities){
		function totalLikes(preVal, activity, i, arr){
			return activity.activity_likes + preVal;
		}
		return activities.reduce(totalLikes, 0);
	}

	function init(){

	}

	return{
		filterList: filterList,
		getLikes: getLikes,
		init: init
	}
})(jQuery);