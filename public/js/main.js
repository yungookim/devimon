requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    paths : {
        text : 'ext/text'
    }
});

// Start the main app logic.
requirejs([
    'router'
    ], 
function(Router) {
   Router.initialize();
});

Date.prototype.toISOString = function(){
    //Override the default toISOString() since it returns 
    //GMT. eg. From
    //Sat Aug 25 2012 18:11:39 GMT-0400 (EDT)
    //to
    //"2012-08-25T18:11:39Z"
    //Useful for timeago.js

    var d = (new Date());
    var all = d.toLocaleString();
    all = all.split(' ');

    var date = all[2];
    var year = all[3];
    var month = d.getMonth() + 1;

    if (month < 10){
        month = "0" + month;
    }

    return year + "-" + month + "-" + date + "T" + d.toLocaleTimeString() + "Z-04:00";//Should be -05 during non-summer time
}