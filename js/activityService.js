var activityService = (function($){

	function getJSON(cb){
		var url = 'https://nuvi-challenge.herokuapp.com/activities';
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 2000,
			headers: {
				'Connection': 'Keep-Alive'
			},
			success:function(results){
				$('#comments').empty();
				$('#bar-chart').empty();
				$('#ajax-loading').hide();
				cb(results);
				var entries = getEntries(results);
				displayActivities(entries);
			},
			error:function(xhr, status, errorThrown){
				console.log('there was an error!');
		        console.log( "Error: " + errorThrown );
		    	console.log( "Status: " + status );
				console.dir( xhr );
				$('#ajax-loading').hide();
				$('#ajax-error').show().html('<p>' + errorThrown + '</p>');
			},
			complete: function(){
				console.log('complete');
			}
		});
	}

	function getEntries(activities){
		var stack = [];
		activities.forEach(function(activity, i, allActivities){
			var entry = '<div class="comment"><section class="top"><h6 class="byline"><span class="actor_avator"></span><span class="actor_username"></span><small> said <span class="data activity_date"></span></small></h6></section><section class="content activity_message"></section><section class="actions"><ul class="menu inline-list"><li class="like activity_likes"></li><li class="reply"></li><li class="source activity_url"></li></ul></section></div>',
				$entry = $(entry),
				elements = getElementList(activity),
				replyUrl = getReplyUrl(activity);

			// use elements list to determine what to append to the entry
			for (var propName in activity){
				$entry.find('.' + propName).append(elements[propName]);
			}
			// append the reply URL to the entry
			$entry.find('.reply').append('<a href="' + replyUrl + '" target="_blank">Reply</a>');
			entry = $entry[0].outerHTML;

			stack.unshift(entry);	
		});
		return stack;
	}
	function displayActivities(stack){
		$('#render-displaying').show();				
		renderHowMany(stack, 10, function(updatedStack){
		    $('#render-displaying').hide("fade", "swing", 500, function(){
				listenForMore(updatedStack);			
			});			
		});
	}
	function listenForMore(stack){
		if(stack.length > 0){
			// attach scroll event listener, and check if scrolled to bottom
			$(window).on('scroll', function(){
				checkScrollBottom(function(){	
					displayActivities(stack);
				});
			});
		}
	}
	function renderHowMany(stack, amount, cb){
		var count = 0;
		if(stack.length < amount) amount = stack.length; 
		for (var i = 0; i < amount; i++){
			setTimeout(function(){
				render(stack[stack.length - 1]);
				stack.pop();
				count++;
				if (count >= amount) cb(stack);		
			}, i*400);					
		}
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
		// set reply URL (need keys/authorizations!)
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
	function checkScrollBottom(cb){
		if($(window).scrollTop() + $(window).height() > $(document).height() - $('.comment').height()) {
			$(window).off('scroll');
			cb();
		}
	}

	function filterMentions(list, word){
		// check list for regex pattern
		var regex = new RegExp(word.toLowerCase(), 'g');

		function matchesFound(activity){
			return activity.activity_message.toLowerCase().match(regex);
		}
		return list.filter(matchesFound);
	}

	function getLikes(list){
		function totalLikes(preVal, activity){
			return activity.activity_likes + preVal;
		}
		return list.reduce(totalLikes, 0);
	}

	function init(cb){
		// display loading bar while rendering the comments
		$(document).ajaxStart(function() {
			$('#ajax-error').hide();
			$('#ajax-loading').show();
		});

		getJSON(cb);
	}

	return {
		init: init,
		filterMentions: filterMentions,
		getLikes: getLikes,
		capitalize: capitalize
	}

})(jQuery);
