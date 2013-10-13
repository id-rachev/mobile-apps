(function(global) {
    var isActivated = false;
    var cameraInit,
    imageSource,
    cameraApp,
    app = global.app = global.app || {};
    
    cameraInit = function() {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
        
    function onDeviceReady() {
        if (!isActivated) {
            cameraApp = new _cameraApp();
            cameraApp.run();
            isActivated = true;
        }
    }
    
    function id(element) {
        return document.getElementById(element);
    }
    
    function _cameraApp() {
    };
    
    _cameraApp.prototype = {
        _pictureSource: null,
        _encodingType: null,
        _destinationType: null,
                
        run: function() {
            var that = this;
            that._pictureSource = navigator.camera.PictureSourceType;
            that._encodingType = navigator.camera.EncodingType;
            that._destinationType = navigator.camera.DestinationType;
            id("capturePhotoButton").addEventListener("click", function() {
                that._capturePhoto.apply(that, arguments);
            });
            id("getPhotoFromLibraryButton").addEventListener("click", function() {
                that._getPhotoFromLibrary.apply(that, arguments)
            });
        },
    
        _capturePhoto: function() {
            var that = this;
        
            // Take picture using device camera and retrieve image as base64-encoded string.
            navigator.camera.getPicture(function() {
                that._onPhotoDataSuccess.apply(that, arguments);
            }, function() {
                that._onFail.apply(that, arguments);
            }, {
                quality: 60,
                destinationType: that._destinationType.FILE_URI,
                encodingType: that._encodingType.JPG
            });
        },
        
        _getPhotoFromLibrary: function() {
            var that = this;
            that._getPhoto(that._pictureSource.PHOTOLIBRARY);         
        },
    
        _getPhoto: function(source) {
            var that = this;
            // Retrieve image file location from specified source.
            navigator.camera.getPicture(function() {
                that._onPhotoURISuccess.apply(that, arguments);
            }, function() {
                cameraApp._onFail.apply(that, arguments);
            }, {
                quality: 60,
                destinationType: cameraApp._destinationType.FILE_URI,
                sourceType: source,
                encodingType: that._encodingType.JPG
            });
        },
    
        _onPhotoDataSuccess: function(imageData) {
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'block';
    
            // Show the captured photo.            
            smallImage.src = imageSource = imageData;
            document.getElementById("image-source").innerText = imageSource;
        },
    
        _onPhotoURISuccess: function(imageURI) {
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'block';
         
            // Show the captured photo.
            smallImage.src = imageSource = imageURI;
            document.getElementById("image-source").innerText = imageSource;
        },
    
        _onFail: function(message) {
            alert(message);
        }
    };
    
    app.camera = {
        init: cameraInit
    };
})(window);