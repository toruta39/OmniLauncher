'use strict';

function navigateToSetting(id) {
    chrome.tabs.create({url: 'chrome://extensions/?id=' + id});
}

var applicationList = new ApplicationList(),
    refreshApplicationList = applicationList.getAll.bind(applicationList);

refreshApplicationList();

chrome.management.onInstalled.addListener(refreshApplicationList);
chrome.management.onUninstalled.addListener(refreshApplicationList);
chrome.management.onEnabled.addListener(refreshApplicationList);
chrome.management.onDisabled.addListener(refreshApplicationList);

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    var suggestions = applicationList.filterSuggestions(text);
    suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(function(text) {
    var filteredItems = applicationList.filter(text),
        matchedItem = filteredItems[0];

    if (matchedItem) {
        if (matchedItem.isApp && matchedItem.enabled) {
            chrome.management.launchApp(matchedItem.id);
        } else if (matchedItem.isManual && matchedItem.enabled) {
            chrome.tabs.create({url: matchedItem.homepageUrl});
        } else {
            navigateToSetting(matchedItem.id);
        }
    } else {
        console.log('No matched item');
    }
});
