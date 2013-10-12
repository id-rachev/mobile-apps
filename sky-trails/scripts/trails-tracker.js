(function(global) {  
    var TrailsTrackerViewModel,
        app = global.app = global.app || {};
    
    TrailsTrackerViewModel = kendo.data.ObservableObject.extend({
        trailsDataSource: null,
        
        init: function () {
            var that = this,
                dataSource;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/trails.json",
                        dataType: "json"
                    }
                }
            });
            
            that.set("trailsDataSource", dataSource);           
        }        
    });  
    
    app.trailsTracker = {
        viewModel: new TrailsTrackerViewModel()
    };
})(window);