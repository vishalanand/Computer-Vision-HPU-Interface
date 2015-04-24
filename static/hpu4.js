var canvas;
var ctx;
var content;
var image = new Image();

var mouse_x;
var mouse_y;

var start_time;
var timer_started = false;

image.load_image = load_image;
image.draw_image = draw_image;
image.draw_boxes = draw_boxes;
image.draw_circles = draw_circles;
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

	canvas.onmousemove = function(event) {

		mouse_x = event.pageX - canvas.offsetLeft;
		mouse_y = event.pageY - canvas.offsetTop;

		image.render();
	}

	canvas.onclick = function(event) {

		mousedown_x = event.pageX - canvas.offsetLeft;
		mousedown_y = event.pageY - canvas.offsetTop;

		click_handler(mousedown_x, mousedown_y);
	}
}

window.onresize = function() {

	resize_canvas();
	image.render();
}

window.onkeydown = function(event) {

	event.preventDefault();
	var key = (event.keyCode ? event.keyCode : event.which);

	if(key == 83 && (event.ctrlKey || event.metaKey)) {

		save_handler();
        return false;
	}

	else if(key == 90 && (event.ctrlKey || event.metaKey)) {

		if(image.circles.length > 0)
			image.circles.pop();

		image.render()
		return false;
	}
}

function save_handler() {

	if(timer_started) {

		timer_started = false;
		var time = (new Date().getTime() - start_time) / 1000.0;

		var id = image.src.slice(image.src.lastIndexOf('-') + 1, -4);

		var response = id + " " + image.circles.length + " " + time + " ";

		for(var i = 0; i < image.circles.length; i++) {

			var circle = image.circles[i];
			var x = circle.x/ image.scale - 50;
			var y = circle.y/ image.scale - 150;
		    w = 150;
		    h = 300;

			response += x + " " + y + " " + w + " " + h + " ";
		}

		response = response.slice(0, -1);
		console.log(response);

		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open("GET", "hpu4/save/" + response, true)
		xmlhttp.send()

		image.load_image();
	}
}

function click_handler(cx, cy) {

	var circle = new Circle(cx / image.scale, cy / image.scale);
	image.circles.push(circle)	

	image.render();
}

function init_canvas() {

	var width = content.clientWidth;
	var height = content.clientHeight;

	ctx.canvas.width = Math.round(0.85 * width);
	ctx.canvas.height = Math.round(0.8 * height);

	canvas.style.marginTop = Math.round(0.5 * (height - ctx.canvas.height)) + "px";
}

function resize_canvas() {

	var img_width = image.width;
	var img_height = image.height;

	var content_width = content.clientWidth;
	var content_height = content.clientHeight;

	var ratio = img_width / img_height;

	var height = content_height * 0.8;
	var width = height * ratio;

	if(width > 0.85 * content_width) {

		width = 0.85 * content_width;
		height = width / ratio;
	}

	image.scale = width / img_width;

	ctx.canvas.width = Math.round(width);
	ctx.canvas.height = Math.round(height);

	canvas.style.marginTop = Math.round(0.5 * (content_height - ctx.canvas.height)) + "px";

	canvas.style.cursor = "cell";
}

function load_image() {

	var xmlhttp = new XMLHttpRequest();

	xmlhttp.open("GET", "hpu4/get", false)
	xmlhttp.send()

	var response = xmlhttp.response.split(' ');

	this.src = response[0];

	var len = (response.length - 1) / 4

	this.cpu_boxes = [];

	for(var i = 0; i < len; i++) {

		var x = parseInt(response[4 * i + 1]);
		var y = parseInt(response[4 * i + 2]);
		var w = parseInt(response[4 * i + 3]);
		var h = parseInt(response[4 * i + 4]);

		var box = new Box(-3, x, y, w, h, this);
		this.cpu_boxes.push(box);
	}

	this.circles = [];

	this.onload = function() {
		
		resize_canvas();
		this.render();
		start_time = new Date().getTime()
		timer_started = true
	}
}

function draw_image() {

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.drawImage(this, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function draw_boxes() {

	for(var i = 0; i < this.cpu_boxes.length; i++)
		this.cpu_boxes[i].draw();

	if(this.active_box == -2 && new_box)
		this.temp_box.draw();
}

function draw_circles() {

	for(var i = 0; i < this.circles.length; i++)
		this.circles[i].draw(true);

	var mouse_circle = new Circle(mouse_x / image.scale, mouse_y / image.scale);
	mouse_circle.draw(false);
}

function render() {

	this.draw_image();
	this.draw_boxes();
	this.draw_circles();
}

function Circle(x, y) {

	this.x = x;
	this.y = y;

	this.draw = draw_circle;
}

function draw_circle(dark) {

	var scale = image.scale;

	var x = Math.round(this.x * scale);
	var y = Math.round(this.y * scale);

	ctx.fillStyle = dark ? "rgba(0, 255, 0, 0.8)" : "rgba(0, 0, 255, 0.6)";
	ctx.beginPath();
	ctx.arc(x, y, 7.5 * image.scale, 0, 2*Math.PI);
	ctx.fill();
}

function Box(id, x, y, w, h, image) {

	this.id = id;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.image = image
				
	this.draw = draw;
}

function draw() {

	var scale = this.image.scale;

	var x = Math.round(this.x * scale);
	var y = Math.round(this.y * scale);
	var w = Math.round(this.w * scale);
	var h = Math.round(this.h * scale);

	ctx.lineWidth = 3;
	
	ctx.strokeStyle = "#ffff00";

	ctx.strokeRect(x, y, w ,h);
}
