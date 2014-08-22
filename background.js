chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	var settings = JSON.parse(window.localStorage.rotateImages);
	sendResponse(settings);
});

chrome.runtime.onInstalled.addListener(function(details)
{
	if (details.reason != "chrome_update")
	{
		chrome.tabs.create({"url" : "options/options.html?reason=" + details.reason});
	}
});