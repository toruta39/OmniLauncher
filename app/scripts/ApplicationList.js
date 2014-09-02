'use strict';

function ApplicationList() {
    this.items = [];
}

ApplicationList.prototype.getAll = function() {
    chrome.management.getAll(function(info) {
        this.items = _.clone(info);

        this.items.push({
            enabled: true,
            isManual: true,
            name: 'Store',
            homepageUrl: 'https://chrome.google.com/webstore/category/apps'
        });
    }.bind(this));
};

ApplicationList.prototype.search = function(keyword) {
    return this.proceedSearch(this.items, keyword);
};

ApplicationList.prototype.proceedSearch = function(items, keyword) {
    var chars = keyword.toLowerCase().split(''),
        result = _.clone(items);

    if (!keyword.length) { return result; }

    result = _.filter(result, function(item) {
        var name = item.name.toLowerCase(),
            prevIndex = -1,
            isMatched = true;

        _.every(chars, function(char) {
            prevIndex = name.indexOf(char, prevIndex + 1);
            isMatched = prevIndex >= 0;
            return isMatched; // Break when unmatched
        });

        if (isMatched) {
            item._score = 0;
            item._snippetLength = 0;
            item._snippetIndex = -1;

            _.every(_.range(1, keyword.length + 1), function(i) {
                var snippet = keyword.toLowerCase().substr(0, i),
                    snippetIndex = name.indexOf(snippet);
                if (snippetIndex >= 0) {
                    item._snippetLength = snippet.length;
                    item._snippetIndex = snippetIndex;
                    return true;
                } else {
                    return false;
                }
            });

            item._score = item._snippetLength * 1000 - item._snippetIndex;
        }

        return isMatched;
    });

    result = _.sortBy(result, function(item) { return -item._score; });

    return result;
};

ApplicationList.prototype.filterSuggestions = function(keyword) {
    var filteredItems = this.search(keyword);

    return filteredItems.map(function(item) {
        return {
            content: item.name,
            description: _.escape(item.name)
        };
    });
};
