$(document).ready(function() {
	$('#container h1').arrow({ height: "30px", style: "topleft", image_orientation: "right", persist: false, trigger_event: 'mouseover' });
	$('#container h2').arrow({ height: "30px", style: "bottomleft", image_orientation: "right", persist: true, trigger_event: 'mouseover', stop_event: 'mouseout' });
	$('#container h3').arrow({ height: "30px", style: "topright", image_orientation: "right", persist: false });
	$('#container h4').arrow({ height: "30px", style: "bottomright", image_orientation: "right", persist: true });

	$('#container_2 h1').arrow({ height: "30px", style: "top", image_orientation: "right", persist: false, trigger_event: 'mouseover' });
	$('#container_2 h2').arrow({ height: "30px", style: "bottom", image_orientation: "right", persist: true, trigger_event: 'mouseover', stop_event: 'mouseout' });
	$('#container_2 h3').arrow({ height: "30px", style: "left", image_orientation: "right", persist: false });
	$('#container_2 h4').arrow({ height: "30px", style: "right", image_orientation: "right", persist: true });
});