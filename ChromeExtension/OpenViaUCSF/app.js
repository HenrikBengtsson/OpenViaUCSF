// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
// Title: 'Open via USCF'
// Author: Henrik Bengtsson
// Created on: 2011-05-01
// Last updated on: 2016-01-02
// Copyright holder: Henrik Bengtsson
// License: LGPL (>= 3) [https://www.gnu.org/licenses/lgpl.txt]
// Full source: https://github.com/HenrikBengtsson/OpenViaUCSF
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
function trimString(s) {
  return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function isVpnUrl(url) {
  url = trimString(url);
  return (url.indexOf("https://remote.ucsf.edu/") != -1 ||
          url.indexOf("https://vpn.ucsf.edu/") != -1);
}

function urlToVpnUrl(url) {
  // Nothing to do?
  if (isVpnUrl(url)) {
    return url;
  }
  var vpnUrl = "https://remote.ucsf.edu/dana/home/launch.cgi?url=";
  url = trimString(url);
  vpnUrl = vpnUrl + url;
  return vpnUrl;
}

function vpnUrlToUrl(vpnUrl) {
  // Nothing to do?
  if (!isVpnUrl(vpnUrl)) {
    return vpnUrl;
  }

  vpnUrl = trimString(vpnUrl);
  var pattern = /https:[/][/](vpn|remote).ucsf.edu[/](.*),DanaInfo=([^,]*)(|,(.*))[+](.*)/;
  var mods = vpnUrl.replace(pattern, "$5");
  // Known modifiers:
  // "SSL": https
  // "SSO=U": ?
  var protocol = "http";
  if (mods == "SSL") {
    protocol = "https";
  }
  var url = vpnUrl.replace(pattern, protocol + "://$3/$2$6");
  return url;
}

function updateAddressBarIcon(tabId, changeInfo, tab) {
  if (isVpnUrl(tab.url)) {
    chrome.pageAction.setTitle({tabId:tab.id, title:"Reopen current page without UCSF VPN Web Proxy"});
    chrome.pageAction.show(tabId);
  } else {
    chrome.pageAction.setTitle({tabId:tab.id, title:"Reopen current page via UCSF VPN Web Proxy"});
    chrome.pageAction.show(tabId);
  }
}

function updateContextMenuEntries(tabId, changeInfo, tab) {
  var json = localStorage["entries"];
  
  // Default entries
  if (!json) {
    json = '{ "USCF": { "name": "USCF VPN Web Proxy", "urlPrefix": "https://remote.ucsf.edu/dana/home/launch.cgi?url=" } }'
  }
  
  var contexts = ["page", "link"];
  
  var how = "via";
  if (isVpnUrl(tab.url)) {
    how = "without";
  }

  chrome.contextMenus.removeAll();
  
  var entries = JSON.parse(json);
  for (var key in entries) {
    var entry = entries[key];
    var name = entry.name;
    var urlPrefix = entry.urlPrefix;
  
    var title;
  
    for (var ii = 0; ii < contexts.length; ii++) {
      var context = contexts[ii];
  
      if (context == "page") {
        title = "Open current page in new tab " + how + " " + name;
      } else if (context == "link") {
        title = "Open link in new tab " + how + " " + name;
      } else {
        alert("Unknown context: " + context);
      }
  
      var id = chrome.contextMenus.create({
        "title": title, "contexts":[context], "onclick": onClick
      });
    } // for (var ii ...)
  } // for (var key ...)
}


function onClickAddressBarIcon(tab) {
  var url = null;
  if (tab.url) {
    url = tab.url;
  } else {
    url = "";
  }
  if (isVpnUrl(url)) {
    url = vpnUrlToUrl(url);
  } else {
    url = urlToVpnUrl(url);
  }
  chrome.tabs.update(null, {url: url});
}

function onTabUnpdate(tabId, changeInfo, tab) {
  updateAddressBarIcon(tabId, changeInfo, tab);
  updateContextMenuEntries(tabId, changeInfo, tab);
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(onTabUnpdate);
chrome.pageAction.onClicked.addListener(onClickAddressBarIcon);


// The on-click callback function
function onClick(info, tab) {
  var url = null;
  if (info.linkUrl) {
    url = info.linkUrl;
  } else if (info.pageUrl) {
    url = info.pageUrl;
  }
  if (isVpnUrl(url)) {
    url = vpnUrlToUrl(url);
  } else {
    url = urlToVpnUrl(url);
  }
  window.open(url);
}


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
// HISTORY:
// 2015-07-15
// o Support for new UCSF VPN URL format. Old ones are still recognized.
// 2012-07-12
// o Now the context menu entries toggles between "Open ... via UCSF VPN"
//   and "Open ... without UCSF VPN" depending on the current URL.  Same
//   for the title of the address bar icon.
// o Added updateContextMenuEntries(); no longer done in the main script.
// o Added trimString(), isVpnUrl(), urlToVpnUrl() and vpnUrlToUrl().
// 2012-04-09
// o Added address bar icon.
// o Made into a UCSF specific app.
// 2011-05-01
// o Added options page.
// o Now supports both 'page' and 'link' context-menu entries.
// o Created.
//   See http://code.google.com/chrome/extensions/contextMenus.html
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
