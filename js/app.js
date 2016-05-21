
$(document).ready(main);

function main(){
	var activities = activityService.init(function(data){
		console.log(data);

		// test word to search for in message property
		var word = 'placehold';
		var mentionedActivities = visualizerService.filterMentions(data, word);


		var mentions = mentionedActivities.length;
		var totalLikes = visualizerService.getLikes(mentionedActivities);
	
		visualizerService.init(mentionedActivities);

		console.log(mentions + ' mentions');
		console.log(totalLikes + ' likes');
		return data;
	});
}

