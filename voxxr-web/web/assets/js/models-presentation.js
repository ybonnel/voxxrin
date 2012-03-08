(function(exports) {

    var PresentationRate = function() {
        var self = this;
        self.nb = ko.observable(0);
        self.avg = ko.observable(0);
        self.avgDisplay = ko.computed(function() {
            return (self.avg() / 100).toFixed(2);
        });
    }

    var PresentationPoll = function(data) {
        var self = this;
        self.choices = ko.observableArray(data.choices);
    }

    var Presentation = function(data) {
        var self = this;

        self.id = ko.observable(data.id);
        self.eventId = ko.observable(data.eventId);
        self.uri = ko.observable(data.uri || ('/events/' + data.eventId + '/presentations/' + data.id));
        self.title = ko.observable(null);
        self.speakers = ko.observableArray(null);
        self.slot = ko.observable(null);
        self.fromTime = ko.observable(null);
        self.toTime = ko.observable(null);
        self.room = ko.observable({});
        self.summary = ko.observable(null);
        self.playing = ko.observable(false);
        self.rate = new models.PresentationRate();
        self.currentPoll = ko.observable(null);
        self.loading = ko.observable(false);
        self.state = ko.observable('STOPPED');
        self.startedAt = ko.observable(null);
        self.timeElasped = ko.observable(0);
        self.time = ko.observable('');
        self.hotFactor = ko.observable(0);
        self.hash = ko.computed(function() {return "#presentation/" + self.eventId() + "/" + self.id()});

        self.speakerNames = ko.computed(function() {
            return _(this.speakers()).map(function(s){return s.name();}).join(', ');
        }, self);

        self.withDetails = ko.observable(false);
        self.toggleDetails = function() { self.withDetails(!self.withDetails()) };
        self.moreOrLess = ko.computed(function() { return self.withDetails() ? '<<less' : 'more>>'});
        self.shortSummary = ko.computed(function() {
           return self.withDetails() ? self.summary() : (self.summary() && self.summary().length > 200) ?
               self.summary().substring(0, 197) + "..."
               : self.summary();
        });

        var cron = null;
        function updateTime() {
            self.time(new Date(new Date() - self.startedAt()).format('UTC:H:MM:ss'));
            cron = setTimeout(updateTime, 1000);
        }
        self.start = function() {
            self.state('STARTED');
            self.startedAt(new Date());
            self.timeElasped(0);
            updateTime();
        }
        self.stop = function() {
            self.state('STOPPED');
            self.startedAt(null);
            self.timeElasped(0);
            self.time('');
            clearTimeout(cron);
        }

        function loadData(data) {
            if (data.title) self.title(data.title);
            if (data.speakers) self.speakers(_(data.speakers).map(function(s) { return ds.speaker(s);}));
            if (data.slot) self.slot(data.slot);
            if (data.fromTime) self.fromTime(data.fromTime);
            if (data.toTime) self.toTime(data.toTime);
            if (data.room) self.room(ds.room(data.room));
            if (data.summary)  self.summary(data.summary);
            self.loading(false);
        }

        self.load = function(data, onloaded) {
            if (data) {
                loadData(data);
                if (onloaded) onloaded(self);
            } else {
                if (!self.summary()) { // check if already loaded
                    self.loading(true);
                    $.ajax({
                        url: models.baseUrl + self.uri(),
                        dataType:"json",
                        type: "GET",
                        success: function(data) {
                            loadData(data); if (onloaded) onloaded(self);
                        },
                        error: function() {
                            console.log('error occured while loading ', self.uri());
                        }
                    });
                } else {
                     if (onloaded) onloaded(self);
                }
            }
        }

        loadData(data);

        self.enter = function() {}
        self.quit = function() {}
    }

    exports.models = exports.models || {};
    exports.models.Presentation = Presentation;
    exports.models.PresentationRate = PresentationRate;
    exports.models.PresentationPoll = PresentationPoll;
})(window);