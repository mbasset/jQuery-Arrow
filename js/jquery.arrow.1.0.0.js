/* 
 * Version: 1.0.0
 * Created: 2011-04-24
 * Updated: 2011-04-24
 * Author: 	Matthew Basset
 * 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 */
(function($){

	var num_arrows = 0;

	function InvalidArgumentException(value) {
		this.value = value;
		
		this.toString = function() {
			return "The argument '" + this.value + "' is invalid.";
		};
	}

	function Arrow(parent, options) {
		
		// Some sensible defaults for the arrow object
		this.defaults = {
			image:   			'arrow.png',
			image_orientation:	'up',
			style: 				'topleft',
			movement_amount:	30,
			movement_speed:		650,
			persist:			true,
			trigger_event:		'',
			stop_event:			'',
			height:				'auto',
			width:				'auto'
		};
	   
	    // Set the options for this arrow instance.
		this.options = $.extend(this.defaults, options);
	   
	    // The parent DOM object we have attached this arrow to.
	   	this.parent = parent;
	   	
	   	// The instance of the arrow DOM object.
	   	this.instance = null;
	   	
	   	// Marks the item as persisting.
	   	this.persisting = false;
	   	
	   	/**
		 * Instantiate a new instance of the arrow on this element.
		 */
	   	this.init = function() {
	    	var parent = this.parent,
	    		o = this.options,
	    		ar_height = o["height"],
	    		ar_width = o["width"],
	    		arrow_tag = "",
	    		positioning = null;
	    		
	    	arrow_tag = "<img id='arrow_" + num_arrows + "' class='jarrow' src='" + o["image"] + "'";
			if (ar_height != 'auto') {
				arrow_tag += "height='" + ar_height + "'";
			} 
			if (ar_height != 'auto') {
				arrow_tag += "width='" + ar_width + "'";
			}
			arrow_tag += ">";
			num_arrows += 1;
	
			parent.after(arrow_tag);
			arrow = $("#arrow_" + (num_arrows - 1) + '.jarrow');
			this.instance = arrow;
			arrow.data("arrow", this);
			
			// Correct the positioning.
			positioning = this.base_position();
			arrow.css("position", "absolute");
			arrow.css("top", positioning.top);
			arrow.css("left", positioning.left);
			arrow.rotate(positioning.rotation);
			
			// Bind to given events	
			if(o["trigger_event"] == '' || o["trigger_event"] === null) {
				this.animate();
			}
			else {
				this.parent.bind(o["trigger_event"], function() {
					$(this).data("arrow").animate();
				});					
			}
				
			if( !(o["stop_event"] == '' || o["stop_event"] === null) ) {		
				this.parent.bind(o["stop_event"], function() {
					$(this).data("arrow").stop();
				});
			}
		};
		
		/**
		 * Used to destroy the instance of the arrow on this element.
		 */
		this.destroy = function() {
			this.stop();
			this.parent
				.removeData("arrow")
				.unbind(this.options["trigger_event"])
				.unbind(this.options["stop_event"]);
			this.instance
				.removeData("arrow")
				.remove();
		};
		
		this.base_position = function() {

			// Adjust to the correct orientation.
			var o = this.options,
				rotation = 0,
				iheight = this.instance.height(),
				iwidth = this.instance.width(),
				pheight = this.parent.height(),
				pwidth = this.parent.width(),
				top = this.parent.position().top + parseFloat(this.parent.css("marginTop").replace('px', '')),
				left = this.parent.position().left + parseFloat(this.parent.css("marginLeft").replace('px', '')),
				direction_top = '+=0',
				direction_left = '+=0',
				amt = o["movement_amount"],
				sqr_amt = Math.sqrt(Math.pow(amt,2)/2);
				
			switch(o["image_orientation"]) {
			case 'up':
				rotation = 0;
				break
			case 'down':
				rotation = 180;
				left -= (iwidth / 2);
				break
			case 'left':
				rotation = 90;
				iwidth = this.instance.height();
				iheight = this.instance.width();
				break
			case 'right':
				rotation = 270;
				iwidth = this.instance.height();
				iheight = this.instance.width();
				left -= iwidth/2;
				break
			default:
			  	rotation = (360 - (o["image_orientation"] % 360));
			}
			
			// Convert the style to the correct orientation.			
			switch(o["style"]) {
			case 'top':
				rotation += 180;
				top -= iheight;
				left += pwidth / 2;
				direction_top = '-=' + amt;
				break
			case 'bottom':
				rotation += 0;
				top += pheight;
				left += pwidth / 2;
				direction_top = '+=' + amt;
				break
			case 'left':
				rotation += 90;
				top += pheight/2 - iwidth/2;
				left -= iheight / 2;
				direction_left = '-=' + amt;
				break
			case 'right':
				rotation += 270;
				top += pheight/2 - iwidth/2;
				left += pwidth + iheight/2;
				direction_left = '+=' + amt;
				break
			case 'topleft':
				rotation += 135;
				top -= iheight;
				left -= iwidth / 2;
				direction_top = '-=' + sqr_amt;
				direction_left = '-=' + sqr_amt;
				break
			case 'bottomleft':
				rotation += 45;
				top += pheight;
				left -= iwidth / 2;
				direction_top = '+=' + sqr_amt;
				direction_left = '-=' + sqr_amt;
				break
			case 'topright':
				rotation += 225;
				top -= iheight;
				left += pwidth + iwidth / 2;
				direction_top = '-=' + sqr_amt;
				direction_left = '+=' + sqr_amt;
				break
			case 'bottomright':
				rotation += 315;
				top += pheight;
				left += pwidth + iwidth / 2;
				direction_top = '+=' + sqr_amt;
				direction_left = '+=' + sqr_amt;
				break
			default:
				throw new InvalidArgumentException(o["style"]);
			}
			
			return {
				rotation: rotation,
				top: top,
				left: left,
				direction_top: direction_top,
				direction_left: direction_left
			}
		}
	   
		this.animate = function(looping) {
			var o = this.options;
			
			// Don't have the looping animation continue grouping. 
			if( this.persisting && !looping ){
				return;
			}
			
			if (o["persist"]) {
				this.persisting = true;
			}
			
			if (this.persisting) {
				this.animate_forward(function() {
					$(this).data().arrow.animate_reverse(function() {
						$(this).data().arrow.animate(true);
					});
				});
			}
			else {
				this.animate_forward(function() {
					$(this).data().arrow.animate_reverse()
				});
			}
		};
		
		this.animate_forward = function(completion){
			var o = this.options,
				pos = this.base_position();
			this.instance.clearQueue().animate({ top: pos.direction_top, left: pos.direction_left }, o['movement_speed'], completion);
		};
		
		this.animate_reverse = function(completion){
			var o = this.options;
			this.instance.animate(this.base_position(), o['movement_speed'], completion);
		};
		
		this.stop = function() {
			var o = this.options;
			this.persisting = false;
			this.instance.stop().animate(this.base_position(), o['movement_speed']);
		}
	   
	};
	
	$.fn.extend({ 
		arrow: function(options) {

			// For each chainable item in the list.
			return this.each(function(){
				var o = options,
					arrow = null;
				
				// Create a new arrow instance.
				if($(this).data("arrow") != undefined) {
					if (options == "destroy") {
						$(this).data().arrow.destroy();
					}
				}
				else {
					arrow = new Arrow($(this), o);
					arrow.init();
					$(this).data("arrow", arrow);	
				}
			});
			
		}
	});
})(jQuery);