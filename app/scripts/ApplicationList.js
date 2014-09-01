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

ApplicationList.prototype.filter = function(keyword) {
    if (!keyword.length) { return _.clone(this.items); }

    var chars = keyword.split(''),
        result = _.clone(this.items);

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

            _.every(_.range(1, keyword.length + 1), function(i) {
                var snippet = keyword.toLowerCase().substr(0, i);
                if (name.indexOf(snippet) >= 0) {
                    item._score += i;
                    return true;
                } else {
                    return false;
                }
            });
        }

        return isMatched;
    });

    result = _.sortBy(result, function(item) { return -item._score; });

    return result;
};

ApplicationList.prototype.filterSuggestions = function(keyword) {
    var filteredItems = this.filter(keyword);

    return filteredItems.map(function(item) {
        return {
            content: item.name,
            description: _.escape(item.name)
        };
    });
};
