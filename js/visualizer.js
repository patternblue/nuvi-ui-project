var visualizerService = (function($, d3){


	function filterMentions(list, word){
		// check list for regex pattern
		var regex = new RegExp(word.toLowerCase(), 'g');

		function matchesFound(activity){
			return activity.activity_message.toLowerCase().match(regex);
		}
		return list.filter(matchesFound);
	}
	
	// function filterProvider(list, provider){
	// 	// check list for regex pattern
	// 	// var regex = new RegExp(word.toLowerCase(), 'g');

	// 	function matchFound(activity){
	// 		return activity.provider.toLowerCase() === provider;
	// 	}
	// 	return list.filter(matchFound);
	// }

	function getLikes(list){
		function totalLikes(preVal, activity){
			return activity.activity_likes + preVal;
		}
		return list.reduce(totalLikes, 0);
	}


	function init(chartData){

		// map likes data to chart's attributes
		function likesFN(d){ 
			return d.activity_likes
		};
		
		
		// filter function for mapping data based on a specific provider name
		function providerFN(d){
			// return d.provider.toLowerCase() === provider;
			return d.provider.toLowerCase();
		}

		//  size of svg element
		var svgHeight = 400,
			svgWidth = 420,
			//  width of each bar and offset between each bar
			barWidth = 40,
			barOffset = 40,
			// colors
			colorBackground = '#8a9078',
			// colorBackground = '#dff0d8',
			// colorFill = '#3c763d',
			colorStroke = '#364996';

		// sort/nest chart data by provider name, then sum the likes for each provider
		var sumOfLikesData = d3.nest()
			.key(providerFN)
			.rollup(function(d){
			   return d3.sum(d, likesFN);
			})
			.entries(chartData);

		console.log(sumOfLikesData);

		// scale width
		var xScale = d3.scale.ordinal()
		        .domain(d3.range(0, sumOfLikesData.length))
		        .rangeBands([0, svgWidth]);
		// scale height
		var maxLikes = d3.max(sumOfLikesData, function(d){ return d.values; });
		var yScale = d3.scale.linear()
			.domain([0, maxLikes])
			.range([0, svgHeight]);
		// scale colors
		var colorScale = d3.scale.linear()
			.domain([0, sumOfLikesData.length*.33, sumOfLikesData.length*.66, sumOfLikesData.length])
			.range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1']);

		var svg = d3.select('#bar-chart').append('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.style('background', colorBackground);

		svg.selectAll('rect').data(sumOfLikesData).enter().append('rect')
			.style({
				'fill': function(data,i){return colorScale(i);}, 
				'stroke': colorStroke, 
				'stroke-width': '5'
			})
			.attr('width', xScale.rangeBand())
			.attr('height', function(data){
				return yScale(data.values);
			})
			.attr('x', function(data, i){
				// if data.provider()
				// return i*(barWidth + barOffset);
				return xScale(i);
			})
			.attr('y', function(data){
				return svgHeight - yScale(data.values);
			});

	}

	return{
		filterMentions: filterMentions,
		// filterProvider: filterProvider,
		getLikes: getLikes,
		init: init
	}
})(jQuery, d3);