// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
/**
The basic premise of this plugin is that you start out with a header
which displays the month/week, and the next/prev buttons.  You are
then free to setup you own rendering of the actual calendar week
in a div of your choosing.  Sample usage as follows:

Your calendar control header: <div id="cal-header"><h4 id="week-title"></h4></div>
Calendar initialize: $('#cal-header').chriscal({
    'body': define your calendar body here,
    'next_btn': define your next button to change to next week,
    'prev_btn': define your prev button to change ot prev week,
    'title': using example above, would be $('#week-title') 
});

Once those are setup, simple pressing your next/prev buttons will change the week.  You'll
see the change in weeks within the title, and the actual 1-7 dates are available via the 
method getWeek which returns an array of the dates.

Additionally, once the week/month has been loaded, a "datesLoaded" event is fired off on your body
element specificed in the body option.  It has the week information within the "week" argument

ex: $('#calendar').on('datesLoaded', function(event, week) {
   // Do stuff for each date/day found. 
});
*/
(function ($) {
    $.fn.chriscal = function(options) {
        var $this = this,
            curr = new Date(),
            week = this.initWeek,
            month = this.initMonth,
            settings = $.extend({
                'body':  $('#calendar'),
                'next_btn':  $('#next_btn'),
                'prev_btn':  $('#prev_btn'),
                'title': $('#cal-title'),
                'mode': 'week'
            }, options);

        this.init = function() {
            this.initCalendar(settings.mode);
        };

        this.initCalendar = function(mode) {
            if (mode) {
                switch(mode) {
                    case 'week':
                        this.initWeek();
                    break;
                    case 'month':
                        this.initMonth(curr.getMonth(), curr.getUTCFullYear());
                    break;
                    default:
                }
            }  
        };

        this.initWeek = function() {
            var first = curr.getDate() - curr.getDay(), 
                i = 0;

            week = [];
            curr = curr || new Date();
            
            while (i < 7) {
              var next = new Date(curr.getTime());
              next.setDate(first + i);
              week.push(next.toString());
              i++;
            }
            
            this.setTitle(week[0], week[6]);
            settings.body.trigger('datesLoaded', [week]);
            return week;
        };

        this.initMonth = function(month, year) {
            
            var date = new Date(year, month, 1);
            var days = [];
            
            while (date.getMonth() === month) {
               days.push(new Date(date));
               date.setDate(date.getDate() + 1);
            }
            
            settings.body.trigger('datesLoaded', [days]);
            return days;
        };

        this.setTitle = function(from, to) {
            var title = from.split(" ")[1] + " " + from.split(" ")[2] + " - " + to.split(" ")[1] + " " + to.split(" ")[2];
            settings.title.html(title);
        };

        this.getWeek = function() {
            return week;
        };

        this.setWeek = function() {
            this.initWeek();
            return this.getWeek();
        };

        this.upWeek = function() {
            curr.setDate(curr.getDate() + 7);
            this.initWeek();
            return this.getWeek();
        };

        this.downWeek = function() {
            curr.setDate(curr.getDate() - 7);
            this.initWeek();
            return this.getWeek();
        };

        this.upMonth = function() {
            curr.setMonth(curr.getMonth()+ 1);
            this.initMonth(curr.getMonth(), curr.getUTCFullYear());
        };

        this.downMonth = function() {
            curr.setMonth(curr.getMonth()- 1);
            this.initMonth(curr.getMonth(), curr.getUTCFullYear());
        };

        settings.next_btn.on('click', function() {
            switch(settings.mode) {
                case 'week':
                    $this.upWeek();
                break;
                case 'month':
                    $this.upMonth();
                break;
                default:
            }
        });

        settings.prev_btn.on('click', function() {
            switch(settings.mode) {
                case 'week':
                    $this.downWeek();
                break;
                case 'month':
                    $this.downMonth();
                break;
                default:
            }
        });

        this.init();

        return {
            getWeek: this.getWeek,
            setWeek: this.setWeek,
            upWeek: this.upWeek,
            downWeek: this.downWeek
        };

    };
}(jQuery));
