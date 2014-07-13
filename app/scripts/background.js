'use strict';

function ApplicationList() {
    this.items = [];
}

function Keyword(query) {
    this.query = query.toLowerCase();
}

Keyword.prototype.match = function(target) {
    return !!~target.toLowerCase().indexOf(this.query); // jshint ignore:line
};

ApplicationList.prototype.getAll = function() {
    chrome.management.getAll(function(info) {
        this.items.length = 0;
        Array.prototype.push.apply(this.items, info);
    }.bind(this));
};

ApplicationList.prototype.filter = function(query) {
    var keyword = new Keyword(query),
        result = [];

    this.items.forEach(function(item) {
        if (keyword.match(item.name)) {
            result.push(item);
        }
    });

    return result;
};

ApplicationList.prototype.filterSuggestions = function(keyword) {
    var filteredItems = this.filter(keyword);

    return filteredItems.map(function(item) {
        return {
            content: item.name,
            description: item.name
        };
    });
};

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

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

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
        } else {
            navigateToSetting(matchedItem.id);
        }
    } else {
        console.log('No matched item');
    }
});
