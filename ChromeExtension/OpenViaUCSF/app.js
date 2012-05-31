// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
// Title: 'Open via USCF'
// Author: Henrik Bengtsson
// Created on: 2011-05-01
// Last updated on: 2012-04-09
// License: LGPL (>= 3)
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

function addAddressBarIcon(tabId, changeInfo, tab) {
  if (tab.url.indexOf("https://vpn.ucsf.edu/") != 0) {
    chrome.pageAction.show(tabId);
  }
}

function onClickAddressBarIcon(tab) {
  var url = "https://vpn.ucsf.edu/dana/home/launch.cgi?url=";
  if (tab.url) {
    url = url + tab.url;
  }
  chrome.tabs.update(null, {url: url});
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(addAddressBarIcon);
chrome.pageAction.onClicked.addListener(onClickAddressBarIcon);


// The on-click callback function
function onClick(info, tab) {
  var url = "https://vpn.ucsf.edu/dana/home/launch.cgi?url=";
  if (info.linkUrl) {
    url = url + info.linkUrl;
  } else if (info.pageUrl) {
    url = url + info.pageUrl;
  }
  window.open(url);
}

var json = localStorage["entries"];

// Default entries
if (!json) {
  json = '{ "USCF": { "name": "USCF VPN", "urlPrefix": "https://vpn.ucsf.edu/dana/home/launch.cgi?url=" } }'
}

var contexts = ["page", "link"];

var entries = JSON.parse(json);
for (var key in entries) {
  var entry = entries[key];
  var name = entry.name;
  var urlPrefix = entry.urlPrefix;

  var title;

  for (var ii = 0; ii < contexts.length; ii++) {
    var context = contexts[ii];

    if (context == "page") {
      title = "Open current page via " + name + " in new tab";
    } else if (context == "link") {
      title = "Open link via " + name + " in new tab";
    } else {
      alert("Unknown context: " + context);
    }

    var id = chrome.contextMenus.create({
      "title": title, "contexts":[context], "onclick": onClick
    });
  } // for (var ii ...)
} // for (var key ...)




// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
// HISTORY:
// 2012-04-09
// o Added address bar icon.
// o Made into a UCSF specific app.
// 2011-05-01
// o Added options page.
// o Now supports both 'page' and 'link' context-menu entries.
// o Created.
//   See http://code.google.com/chrome/extensions/contextMenus.html
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
