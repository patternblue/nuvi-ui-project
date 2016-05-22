
$(document).ready(main);

function processActivities(data){
	console.log(data);

	var word = $('#brand-input').val();
	var mentionedActivities = activityService.filterMentions(data, word);
	var mentions = mentionedActivities.length;
	var totalLikes = activityService.getLikes(mentionedActivities);

	visualizerService.init(mentionedActivities);

	console.log(mentions + ' mentions');
	console.log(totalLikes + ' likes');
	// return data;
}

function main(){

	var $form = $('#brand-form');
	$form.validation();

	// events

	$('#submit-brand').click(function(event){

		// do ajax if client-side validation succeeds
		// or show error
		if(!$form.validate()){
			$('#submit-error').show();
		}else{
			$('#submit-error').hide();
			activityService.init(processActivities);
		}
		event.preventDefault();
	});

}

