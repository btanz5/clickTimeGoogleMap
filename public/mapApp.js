var map,
	currentLocation,
	stops = [],
	markerArray = [],
	directionView,
	directions,
	stepView,
	service;

function addStops() {
	var addStops = $('.addStopVal');

	for (var i = 0; i < addStops.length; i++){
		stops.push({
			location: addStops[i].value,
			stopover: false
		});
		var marker = new google.maps.Marker({
        icon: {
        	path: google.maps.SymbolPath.CIRCLE,
     		scale: 10
        },
        map: map
      });
	}

	$('.addStopVal').val('');
	$('.addStopVal').focus();
}

function calcRoute(){
	var transportOpt = $('input:radio[name=transportOpt]:checked').val();

	if (transportOpt === 'TRANSIT'){
		alert("Google Maps doesn\'t allows 'Public Transportations' to have Way Point stops, sorry");
	}

	var workRoute = {
		origin : currentLocation,
		destination: '282 2nd Steet 4th floor San Francisco, CA 94105',
		waypoints: stops,
		travelMode: google.maps.TravelMode[transportOpt]
	}
	directions.route(workRoute, function (responce, status){
		if (status === google.maps.DirectionsStatus.OK){
			directionView.setDirections(responce);
			showSteps(responce);
		}
	});
}

function showSteps(directionResults){
	var route = directionResults.routes[0].legs[0];
  	
  	for (var i = 0; i < route.steps.length; i++) {
      var marker = new google.maps.Marker({
        position: route.steps[i].start_point,
        map: map
      });
      attachInstructionTxt(marker, route.steps[i].instructions);
      markerArray[i] = marker;
	}

}

function attachInstructionTxt(directionMarker, text){
	google.maps.event.addListener(directionMarker, 'click', function (){
		stepView.setContent(text);
		stepView.open(map, directionMarker);
	});
}

function initialize(location){
	currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

	var mapOptions = {
		center: currentLocation,
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	directions = new google.maps.DirectionsService();
	directionView = new google.maps.DirectionsRenderer();
	stepView = new google.maps.InfoWindow();

	directionView.setMap(map);

	var marker = new google.maps.Marker({
		position: currentLocation, 
		map: map
	});

	service = new google.maps.places.PlacesService(map);

	$('.addStop').click(addStops);
	$('.showRoute').click(calcRoute);

	//traffic
	var traffic = new google.maps.TrafficLayer();
	$(".toggleTraffic").click(function (){
		if (traffic.getMap()){
			traffic.setMap(null);
		} else {
			traffic.setMap(map);
		}
	});
}

$(function (){
	$('.addStopVal').focus();
	navigator.geolocation.getCurrentPosition(initialize);
});