
$(document).ready(main);

function main(){
	var activities = activityService.init(function(data){
		console.log(data);
		var mentions = visualizerService.getMentions(data, 'credo');
		console.log(mentions)
	});
}

