var oldUrl = "https://picsum.photos/536/354";

function save_options() {
  // Get the values of the things
  var lightType = document.getElementById('lightType').value;
  var lightOpacity = document.getElementById('lightOpacity').value;
  var customImageUrl = "";
  if (lightType == "custom")
  {
    // If custom, then ask for the URL
    customImageUrl = prompt("Paste in your image URL", [oldUrl]);
  }
  // Convert from a range to a percentage
  lightOpacity = ( (lightOpacity - 0) / (100 - 0) ) * (1 - 0) + 0;
  // Save the settings
  chrome.storage.sync.set({
    typeOfLight: lightType,
	opacityOfLight: lightOpacity,
    imageUrl: customImageUrl,
  }, function() {
    // Display the saved message
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    // Send a message to all tabs in the current window to update them
    chrome.tabs.query({currentWindow:true}, function(tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, {greeting: "updateLightSettingsEvent"}, function(response) {
                console.log(response.farewell);
            });
        }

    });
    // Get rid of the display
    setTimeout(function() {
      status.textContent = '';
    }, 750);
	
  });
}

function restore_options() {
  // Get the settings
  chrome.storage.sync.get({
    typeOfLight: 'none',
	opacityOfLight: 'none',
    imageUrl: 'none',
  }, function(items) {
    // Set the options to the settings
    document.getElementById('lightType').value = items.typeOfLight;
	document.getElementById('lightOpacity').value = ( (items.opacityOfLight - 0) / (1 - 0) ) * (100 - 0) + 0;
    oldUrl = items.imageUrl;
  });
}

// These just call the functions
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);