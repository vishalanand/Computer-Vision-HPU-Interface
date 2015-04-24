var canvas;
var ctx;
var content;
var image = new Image();

var start_time;
var timer_started = false;
var count = 0

image.load_image = load_image;
image.render = render;


window.onload = function() {

	canvas = document.getElementById("canvas");
	content = document.getElementById("content");
	ctx = canvas.getContext("2d");

	init_canvas();
	image.load_image();

	canvas.oncontextmenu = function(event) {

		event.preventDefault()

		mousedown_x = event.pageX - canvas.offsetLeft;
		mousedown_y = event.pageY - canvas.offsetTop;

		//right_click_handler(mousedown_x, mousedown_y)

		return false
	}
}

window.onresize = function() {

	init_canvas();
	image.render();
}

window.onkeydown = function(event) {

	event.preventDefault();
	var key = (event.keyCode ? event.keyCode : event.which);

	if(key == 13) {

		image.data[count] = 1;
		count++;
		
		if(count == image.boxes.length) {

			count = 0;
			save_handler();
		}

		else
			image.render();
        
        return false;
	}

	else if(key == 32) {

		image.data[count] = 0;
		count++;
		
		if(count == image.boxes.length) {

			count = 0;
			save_handler();
		}

		else
			image.render();
        
        return false;
	}
}

function save_handler() {

	if(timer_started) {

		timer_started = false;
		var time = (new Date().getTime() - start_time) / 1000.0;

		var id = image.src.slice(image.src.lastIndexOf('-') + 1, -4);

		var response = id + " " + image.data.length + " " + time;

		for(var i = 0; i < image.data.length; i++)
			response += " " + image.data[i];

		console.log(response);

		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open("GET", "hpu2/save/" + response, true)
		xmlhttp.send()

		image.load_image();
	}
}

function init_canvas() {

	var scale = 2.5;

	var width = content.clientWidth;
	var height = content.clientHeight;

	ctx.canvas.height = Math.round(0.6 * height);
	ctx.canvas.width = Math.round(scale * ctx.canvas.height);

	if(ctx.canvas.width > 0.7 * width) {

		ctx.canvas.width = Math.round(0.7 * width);
		ctx.canvas.height = Math.round(ctx.canvas.width / scale);
	}

	canvas.style.marginTop = Math.round(0.5 * (height - ctx.canvas.height)) + "px";
}

function load_image() {

	var xmlhttp = new XMLHttpRequest();

	xmlhttp.open("GET", "hpu2/get", false)
	xmlhttp.send()

	var response = xmlhttp.response.split(' ');

	this.src = response[0];

	var len = (response.length - 1) / 4

	if(len == 0) {

		this.load_image();
		return false;
	}

	this.boxes = [];

	for(var i = 0; i < len; i++) {

		var x = parseInt(response[4 * i + 1]);
		var y = parseInt(response[4 * i + 2]);
		var w = parseInt(response[4 * i + 3]);
		var h = parseInt(response[4 * i + 4]);

		var box = new Box(x, y, w, h);
		this.boxes.push(box);
	}

	this.data = new Array(len);

	this.onload = function() {
		
		this.render();
		start_time = new Date().getTime()
		timer_started = true
	}
}

function render() {

	var box = this.boxes[count];

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.drawImage(this, box.x, box.y, box.w, box.h, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function Box(x, y, w, h) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
