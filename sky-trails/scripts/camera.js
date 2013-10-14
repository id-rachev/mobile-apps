(function(global) {
    var isActivated = false;
    var cameraInit,
    imageSource,
    cameraApp,
    mimeMap,
    AppHelper,
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
                quality: 50,
                destinationType: that._destinationType.DATA_URL,
                encodingType: that._encodingType.PNG
            });
        },
        
        _getPhotoFromLibrary: function() {
            var that = this;
            // Retrieve image file location from specified source.
            navigator.camera.getPicture(function() {
                that._onPhotoDataSuccess.apply(that, arguments);
            }, function() {
                cameraApp._onFail.apply(that, arguments);
            }, {
                quality: 50,
                destinationType: cameraApp._destinationType.FILE_URI,
                sourceType: that._pictureSource.PHOTOLIBRARY,
                encodingType: that._encodingType.JPEG
            });
        },
    
        _onPhotoDataSuccess: function(imageData) {
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'block';
    
            // Show the captured photo.            
            smallImage.src = imageSource = imageData;
            document.getElementById("newPicture").innerText = imageSource;
        },
    
        _onFail: function(message) {
            alert(message);
        }
    };
    
    mimeMap = {
        jpg  : "image/jpeg",
        jpeg : "image/jpeg",
        png  : "image/png",
        gif  : "image/gif"
    };
    
    AppHelper = {
        resolveImageUrl: function (id) {
            if (id) {
                return el.Files.getDownloadUrl(id);
            }
            else {
                return "_";
            }
        },
        getBase64ImageFromInput : function (input, cb) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                if (cb)
                    cb(e.target.result);
            };
            reader.readAsDataURL(input);
        },
        getImageFileObject: function(input, cb) {
            var name = input.name;
            var ext = name.substr(name.lastIndexOf('.') + 1);
            var mimeType = mimeMap[ext];
            if (mimeType) {
                this.getBase64ImageFromInput(input, function(base64) {
                    var res = {
                        "Filename"    : name,
                        "ContentType" : mimeType,              
                        "base64"      : base64.substr(base64.lastIndexOf('base64,') + 7)
                    }
                    cb(null, res);
                });
            }
            else {
                cb("File type not supported: " + ext);    
            }
        }
    };
        
    var addImageToDB = kendo.observable({
        addTrailImageModel : {
            Location: function() {
                var latitude, longitude;
                
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
                
                function onSuccess(position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                };
                
                function onError(error) {
                    alert('code: ' + error.code + '\n' +
                          'message: ' + error.message + '\n');
                };
                
                return {
                    Latitude: parseFloat(latitude.replace(',', '.')),
                    Longitude: parseFloat(longitude.replace(',', '.'))
                }
            },
            ImageFile: imageSource
        },
        
        saveItem: function() {
            $.ajax({
                type: "POST",
                url: 'https://api.everlive.com/v1/wWPalgivRBMkPWo1/TrailsPictures',
                contentType: "application/json",
                data: JSON.stringify(addTrailImageModel),
                error: function(error) {
                    navigator.notification.alert(JSON.stringify(error));
                }
            });
        }
    });
    
    var saveImageToDB = function() {
        var uploadUrl = Everlive.$.Files.getUploadUrl();
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = "everlive.jpeg";
        options.mimeType = "image/jpeg";
        options.headers = Everlive.$.buildAuthHeader();
         
        var ft = new FileTransfer();
        ft.upload(imageSource, uploadUrl, 
                  function (r) {
                      alert('success')
                  }, 
                  function(error) {
                      alert("An error has occurred: Code = " + error.code);
                  }, options);
    };
    
    app.camera = {
        init: cameraInit,
        addImage: addImageToDB,
        saveImage: saveImageToDB
    };
})(window);