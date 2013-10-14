(function (global) {
    app = global.app = global.app || {};

    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout", transition: "fade" });
    }, false);
    
    var applicationSettings = {
        apiKey: 'wWPalgivRBMkPWo1'
    };
    // initialize Icenium Everlive SDK
    var el = new Everlive({
        apiKey: applicationSettings.apiKey
    });
    
})(window);