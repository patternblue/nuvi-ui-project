$(document).ready(main);

function getJSON(event){
	var url = 'https://nuvi-challenge.herokuapp.com/activities'
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		timeout: 2000,
		success:function(results){
			displayActivities(results);
		},
		error:function(xhr, status, errorThrown){
			console.log('there was an error!');
	        console.log( "Error: " + errorThrown );
	    	console.log( "Status: " + status );
			console.dir( xhr );
		},
		complete: function(){
			console.log('complete');
		}
	});
}

function displayActivities(activities){
	activities.forEach(function(activity, i, allActivities){
		var entry = '<div class="comment"><section class="top"><h6 class="byline"><span class="actor_avator"></span><span class="actor_username"></span><small> said <span class="data activity_date"></span></small></h6></section><section class="content activity_message"></section><section class="actions"><ul class="menu inline-list"><li class="like activity_likes"></li><li class="reply"></li><li class="source activity_url"></li></ul></section></div>',
			$entry = $(entry),
			elements = getElementList(activity),
			replyUrl = getReplyUrl(activity);

		for (var propName in activity){
			$entry.find('.' + propName).append(elements[propName]);
		}
		$entry.find('.reply').append('<a href="' + replyUrl + '" target="_blank">Reply</a>');
		entry = $entry[0].outerHTML;

		console.log(activity);
		console.log('\n');

		// render an activity after each interval
		setTimeout(function(){
			render(entry);
			// check if the comment is the last one in the list
			if(i >= allActivities.length - 1) waitForAnotherRequest();
		}, i*300);

	});
}

function getElementList(activity){
	return {
		actor_name: activity.actor_name,
		actor_username: '<a href="' + activity.actor_url + '" target="_blank">' + activity.actor_username + '</a>',
		activity_message: '<p>' + activity.activity_message + '</p>',
		activity_date: activity.activity_date,

		activity_likes: '<a href="http://www.facebook.com/plugins/like.php?href=' + activity.activity_url + ';layout=standard&amp;show_faces=false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;" target="_blank">Like (' + activity.activity_likes + ')</a>',

		activity_url: '<a href="' + activity.activity_url + '" target="_blank">View on ' + capitalize(activity.provider) + '</a>',
		// actor_avator property should be spelled as 'avatar' 
		actor_avator: '<a href="' + activity.actor_url + '" target="_blank"><img class="icon" src="' + activity.actor_avator + '" alt="avator"></img></a>'
	}
}
function getReplyUrl(activity){
	// set reply URL (need authorizations!)
	var replyUrl = '#';
	switch(activity.provider){
		case 'twitter':
			replyUrl = 'https://twitter.com/intent/tweet?in_reply_to=' + activity.id;
				break;	
		// case 'instagram':
		// 	replyUrl = 'https://api.instagram.com/v1/media/' + activity.id + '/comments';
		// 		break;	
	}
	return replyUrl;
}
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function render(entry){
	$('#comments').append(entry); 
	$('.comment:last').effect("highlight",{color: '#0c0'},1000);
}


// attach scroll event listener, and check if scrolled to bottom
function waitForAnotherRequest(){
    $('#ajax-notification').hide("fade", "swing", 500, function(){
		$(window).on('scroll', checkScrollBottom);
    });
}

// check if scrolled to bottom. If so, then render more activities
function checkScrollBottom(){
	if($(window).scrollTop() + $(window).height() > $(document).height() - $('.comment').height()) {
		$(window).off('scroll');
		getJSON();
	}
}

function main(){
	$(window).on('scroll', checkScrollBottom);

	$(document).ajaxStart(function() {
		$('#ajax-notification').show();
	});

}


