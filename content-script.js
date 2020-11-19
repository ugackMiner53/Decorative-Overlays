var lightType = null;
var lightOpacity = null;
var customImageUrl = null;
function loaded()
{
	// Delete the old image if there is one
	if (document.getElementById("lights-image") != null)
		document.getElementById("lights-image").parentNode.removeChild(document.getElementById("lights-image"));
	// If the settings are broken, do not load
	if (lightType === "none")
		return false;
	// Set the source to a local image
	var imgSrc = chrome.runtime.getURL("/images/" + lightType + ".png");
	if (lightType === 'custom')
	{
		// If it's custom, then the source should be the URL
		var imgSrc = customImageUrl;
	};
	// Create the image Element
	var img = document.createElement('img');
	// Set the source to the URL
	img.src = imgSrc;
	img.id = "lights-image";
	// Doesn't work unless it is the first element in the head for some reason
	document.body.insertBefore(img, document.body.firstChild);
	// Import the stylesheet
	var link = document.createElement("link");
	link.href = chrome.extension.getURL("styles.css");
	link.type = "text/css";
	link.rel = "stylesheet";
	document.head.appendChild(link);
	// Apply the opacity
	document.getElementById('lights-image').style.opacity = lightOpacity;
}


function main()
{
	// Get the settings and assign variables
	chrome.storage.sync.get({
		typeOfLight: 'none',
		opacityOfLight: 1.0,
		imageUrl: 'none',
		}, function(items) {
		lightType = items.typeOfLight;
		lightOpacity = items.opacityOfLight;
		customImageUrl = items.imageUrl;
		loaded();
	});
}

// Add a listener to see if the settings should update
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "updateLightSettingsEvent")
	  main();
  });



// Call the load function
main();