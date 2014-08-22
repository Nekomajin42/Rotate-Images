// alert if one key used for multiple goals
function checkSettings()
{
	// check duration
	if (duration.value < 0 || duration.value > 1000)
	{
		alert(chrome.i18n.getMessage("settings_duration_warning"));
		duration.focus();
		return;
	}
	
	// check shortcuts
	for (var i=0; i<shortcut.length-1; i++)
	{
		for (var j=i+1; j<shortcut.length; j++)
		{
			if (shortcut[i].value == shortcut[j].value)
			{
				alert(chrome.i18n.getMessage("settings_key_warning"));
				return;
			}
		}
	}
	
	// let's save
	saveSettings();
}

// save settings
function saveSettings()
{
	// set values
	settings.preferences.transitionDuration.userValue = parseInt(duration.value, 10);
	settings.preferences.transitionTiming.userValue = timing.value;
	for (var i=0; i<shortcut.length; i++)
	{
		settings.shortcuts[shortcut[i].id].userValue = shortcut[i].value;
	}
	
	// save settings to local storage
	window.localStorage.rotateImages = JSON.stringify(settings);
	location.reload();
}

// reset settings
function resetSettings()
{
	// set values
	settings.preferences.transitionDuration.userValue = settings.preferences.transitionDuration.defaultValue;
	settings.preferences.transitionTiming.userValue = settings.preferences.transitionTiming.defaultValue;
	for (var i=0; i<shortcut.length; i++)
	{
		settings.shortcuts[shortcut[i].id].userValue = settings.shortcuts[shortcut[i].id].defaultValue;
	}
	
	// save settings to local storage
	window.localStorage.rotateImages = JSON.stringify(settings);
	location.reload();
}

// load settings
function loadSettings()
{
	// read saved settings
	if (window.localStorage.rotateImages)
	{
		settings = JSON.parse(window.localStorage.rotateImages);
		//window.localStorage.clear();
	}
	else
	{
		window.localStorage.rotateImages = JSON.stringify(settings);
	}
}

// set settings
function setSettings()
{
	// set transition
	duration.value = settings.preferences.transitionDuration.userValue;
	timing.value = settings.preferences.transitionTiming.userValue;
	
	// insert select options
	for (var i=0; i<shortcut.length; i++)
	{
		for (var j=0; j<keys.length; j++)
		{
			var option = document.createElement("option");
			option.text = keys[j].key;
			option.value = keys[j].code;
			shortcut[i].add(option);
		}
		shortcut[i].value = settings.shortcuts[shortcut[i].id].userValue;
	}
}

// global variables
var duration, timing, shortcut, menu;

// stuff to do on page load
window.addEventListener("load", function()
{
	// select locale strings (control.js)
	selectLocale();
	
	// get form fields
	duration = document.getElementById("transitionDuration");
	timing = document.getElementById("transitionTiming");
	shortcut = document.querySelectorAll("#shortcuts select");
	
	// load and set settings
	loadSettings();
	setSettings();
	
	// attach event listeners
	document.getElementById("saveSettings").addEventListener("click", checkSettings, false);
	document.getElementById("resetSettings").addEventListener("click", resetSettings, false);
	
	menu = document.querySelectorAll("menu li");
	for (var i=0; i<menu.length; i++)
	{
		menu[i].addEventListener("click", toggleMenu, false);
	}
	
	// check update (control.js)
	updatePopup();
}, false);
