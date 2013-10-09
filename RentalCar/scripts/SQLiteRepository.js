var sqlite = (function() {
    var app = app || {};
    app.db = null;

    app.openDb = function() {
        if (window.sqlitePlugin !== undefined) {
            app.db = window.sqlitePlugin.openDatabase("CarRental");
        }
        else {
            // For debugging in simulator fallback to native SQL Lite
            app.db = window.openDatabase("CarRental", "1.0", "CarRentalDemo", 200000);
        }
    }
    
    app.createTable = function() {
        app.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS Cars" +
                          "(id INTEGER PRIMARY KEY ASC, " +
                          "model TEXT, " +
                          "vendor TEXT, " +
                          "rentPrice DOUBLE, " +
                          "rentOption BIT);", []);
        });
    }

    app.insertRecord = function(car) {
        app.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO Cars(model, vendor, rentPrice, rentOption) VALUES (?,?,?,?);",
                          [car.model, car.vendor, car.rentPrice, car.rentOption],
                          app.onSuccess,
                          app.onError);
        });
    }
    
     app.deleteRecord = function(id) {
        app.db.transaction(function(tx) {
            tx.executeSql("DELETE FROM Cars WHERE id = ?;",
                          [id],
                          app.onSuccess,
                          app.onError);
        });
    }

    app.updateRecord = function(id, rentOption) {
        app.db.transaction(function(tx) {
            tx.executeSql("UPDATE Cars SET rentOption = ? WHERE id = ?;",
                          [rentOption, id],
                          app.onSuccess,
                          app.onError);
        });
    }

    app.selectAllRecords = function(fn) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM Cars;", [],
                          fn,
                          app.onError);
        });
    }

    function getAllTheData(handleReceivedData) {
        app.selectAllRecords(handleReceivedData);
    }

    app.onSuccess = function(tx, r) {
        console.log("Your SQLite query was successful!");
    }

    app.onError = function(tx, e) {
        console.log("SQLite Error: " + e.message);
    }

    function init() {
        app.openDb();
        app.createTable();
    }
    
    init();
    
    return {
        getData:getAllTheData,
        addCar:app.insertRecord,
        deleteCar:app.deleteRecord
    }
}());
/*
Available cars for rent
Car details and rent option
Rented cars with return date
Home/About/Contacts view
*/
