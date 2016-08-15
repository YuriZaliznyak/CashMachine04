// class timer
var Timer = function () {
    this.Interval = 1000; // milliseconds, ticks once per second
    this.Enable = false;
    this.Tick = null;
    var timerId = 0;
    var thisObject;
    this.Start = function () {
        this.Enable = true;
        thisObject = this;
        if (thisObject.Enable) {
            thisObject.timerId = setInterval(
                function () {
                    thisObject.Tick();
                }, thisObject.Interval);
        }
    };
    this.Stop = function () {
        thisObject.Enable = false;
        clearInterval(thisObject.timerId);
    };

};