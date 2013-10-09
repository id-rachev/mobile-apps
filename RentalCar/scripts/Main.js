var app = app || {};

(function(a) {
    var carFree = {
        model:"golf",
        vendor:"voltswagen",
        rentPrice:1000,
        rentOption:1
    };
    
    var carRented = {
        model:"golf",
        vendor:"voltswagen",
        rentPrice:1000,
        rentOption:0
    };
    
    sqlite.addCar(carFree);
    sqlite.addCar(carFree);
    sqlite.addCar(carRented);
    sqlite.addCar(carRented);
    
    var viewModel = kendo.observable({
        cars:[]
    });
    
    function getDataSource() {
        var carsFromDb = [];
        sqlite.getData(getCars);
        function getCars(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                carsFromDb.push(rs.rows.item(i));
            }
           
            viewModel.set("cars", carsFromDb);
        }
    }
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        getDataSource();       
    }
    
    document.addEventListener("deviceready", function(e) {
        var app = new kendo.mobile.Application(document.body);
    }, false);
    
    a.cars = {
        init:init
    }
}(app))