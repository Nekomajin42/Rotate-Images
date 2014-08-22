/* === popup === */
function showInfo()
{
	var text = chrome.i18n.getMessage("contentScript_info_rotate") + " " + Math.round((angle*180)/Math.PI) + "°";
	text += "\n" + chrome.i18n.getMessage("contentScript_info_flip") + " "
	text += (x != 1) ? "X" : "-";
	text += " , ";
	text += (y != 1) ? "Y" : "-";
	alert(text);
}

/* === slide image === */
function slide()
{
	// resize container
	s = Math.abs(Math.sin(angle));
	c = Math.abs(Math.cos(angle));
	w = image.clientWidth;
	h = image.clientHeight;
	wn = h*s + w*c;
	hn = h*c + w*s;
	image.style.left = (wn >= window.innerWidth) ? Math.ceil((wn-w)/2) + "px" : Math.ceil((wn-w)/w) + "px";
	image.style.top = (hn >= window.innerHeight) ? Math.ceil((hn-h)/2) + "px" : Math.ceil((hn-h)/h) + "px";
}
	
/* === rotate and flip === */
function rotate(angle, x, y)
{
	// apply transform
	if (isWebkit)
	{
		image.style.WebkitTransform = "rotate(" + angle + "rad) scale(" + y + ", " + x + ")";
	}
	else
	{
		image.style.transform = "rotate(" + angle + "rad) scale(" + y + ", " + x + ")";
	}
	
	// move it
	slide();
}
	
/* === detect keyboard input === */
function detectKey(e)
{
	if (e.keyCode == settings.shortcuts.left90.userValue) // L90
	{
		angle -= Math.PI / 2;
	}
	else if (e.keyCode == settings.shortcuts.right90.userValue) // R90
	{
		angle += Math.PI / 2;
	}
	else if (e.keyCode == settings.shortcuts.left1.userValue) // L1
	{
		angle -= Math.PI / 180;
	}
	else if (e.keyCode == settings.shortcuts.right1.userValue) // R1
	{
		angle += Math.PI / 180;
	}
	else if (e.keyCode == settings.shortcuts.original.userValue) // O
	{
		angle = 0; x = 1; y = 1;
	}
	else if (e.keyCode == settings.shortcuts.fliph.userValue) // H
	{
		y = -y;
	}
	else if (e.keyCode == settings.shortcuts.flipv.userValue) // V
	{
		x = -x;
	}
	else if (e.keyCode == settings.shortcuts.info.userValue) // I
	{
		showInfo();
	}
	rotate(angle, x, y);
}
	
/* === detect image size change === */
function checkSize()
{
	// check the image container width
	if (image.clientWidth != curSize)
	{
		// slide image to prevent cropping
		curSize = image.clientWidth;
		slide();
	}
}

/* === global variables === */
var settings = {}; // user preferences
var image; // the image
var angle, x, y; // angle of rotation and flip
var s, c, w, h, wn, hn; // image dimensions
var isWebkit; // vendor prefix
var curSize; // current width of the image
var t; // timer

/* === do some stuff on page load === */
chrome.runtime.sendMessage("", function(response)
{
	if (document.getElementsByTagName("img").length == 1) // don't run if more than one image is present
	{
		// tell the user that something is working
		console.log("Rotate Images: ON!");
		
		// get user settings
		settings = response;
		
		// bind keydown listener
		window.addEventListener("keydown", detectKey, false);
		
		// detect vendor prefix
		isWebkit = (typeof document.body.style["transform"] == "undefined") ? true : false;
		
		// get the image
		image = document.getElementsByTagName("img")[0];
		
		// apply some style to center the image
		image.parentNode.parentNode.style.display = "table";
		image.parentNode.parentNode.style.width = "100%";
		image.parentNode.parentNode.style.height = "100%";
		image.parentNode.style.display = "table-cell";
		image.parentNode.style.verticalAlign = "middle";
		image.style.display = "block";
		image.style.position = "relative";
		image.style.margin = "auto";
		
		// apply transition
		image.style.transition = "all " + settings.preferences.transitionDuration.userValue + "ms " + settings.preferences.transitionTiming.userValue;
		
		// get current width of the image
		curSize = image.clientWidth;
		
		// set a timer to check the width of the container
		// we need this to prevent cropping if some kind of image resizer extension is active
		t = setInterval(checkSize, 100);
		
		// set default angle and flip values
		angle = 0; x = 1; y = 1;
	}
});