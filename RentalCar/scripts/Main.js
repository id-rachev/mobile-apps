var app = app || {};

(function(a) {
    var freeCar = {
        model:"A4",
        vendor:"Audi",
        rentPrice:800,
        rentOption:1
    };
    
    var rentedCar = {
        model:"A4",
        vendor:"Audi",
        rentPrice:800,
        rentOption:0
    };
    
    sqlite.addCar(freeCar);
    sqlite.addCar(freeCar);
    sqlite.addCar(freeCar);
    sqlite.addCar(rentedCar);
    
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