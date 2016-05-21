
$(document).ready(main);

function main(){
	var activities = activityService.init(function(data){
		console.log(data);
		var activitiesFiltered = visualizerService.filterList(data, 'placehold');

		var mentions = activitiesFiltered.length;
		var totalLikes = visualizerService.getLikes(activitiesFiltered);
		console.log(mentions + ' mentions');
		console.log(totalLikes + ' likes');
		return data;
	});
}

