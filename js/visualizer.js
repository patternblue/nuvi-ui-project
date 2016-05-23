var visualizerService = (function($, d3){

	// map likes data to chart's attributes
	function likesFN(d){ 
		return d.activity_likes
	};
	
	// filter function for mapping data based on a specific provider name
	function providerFN(d){
		return d.provider.toLowerCase();
	}

	function init(chartData){

		//  size of svg element
		var svgHeight = 400,
			svgWidth = 480,
			//  width of each bar and offset between each bar
			barWidth = 40,
			barOffset = 40,
			// colors
			colorBackground = '#8a9078',
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
			.domain([0, maxLikes*1.2])
			.range([0, svgHeight]);
		// scale colors
		var colorScale = d3.scale.linear()
			.domain([0, sumOfLikesData.length*.33, sumOfLikesData.length*.66, sumOfLikesData.length])
			.range(['#c6d9a6', '#a4b8e2', '#ead8bc', '#d5b3c9']);

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
				return xScale(i);
			})
			.attr('y', function(data){
				return svgHeight - yScale(data.values);
			});

		var texts = svg.selectAll('text').data(sumOfLikesData).enter();
		// text label for number of likes
		texts.append('text')
			.text(function(data){
    		    return data.values + ' likes';
	   		})
			.attr('x', function(data, i) {
				return xScale(i) + 20;
			})
			.attr('y', function(data){
				return svgHeight - yScale(data.values) - 7;
			});
		// text label for provider name
		texts.append('text')
			.text(function(data){
    		    return activityService.capitalize(data.key);
	   		})
			.attr('x', function(data, i) {
				return xScale(i) + 20;
			})
			.attr('y', function(data){
				return svgHeight - yScale(data.values) - 30;
			});
	}

	return{
		init: init
	}
})(jQuery, d3);