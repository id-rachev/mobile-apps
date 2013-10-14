(function(global) {  
    var TrailsTrackerViewModel,
    el, mimeMap,
    AppHelper,
    app = global.app = global.app || {};
    
    el = new Everlive({
        apiKey: "wWPalgivRBMkPWo1"
    });
    
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
    
    TrailsTrackerViewModel = kendo.data.ObservableObject.extend({
        trailsDataSource: null,
        trailsModel: {
            id: 'Id',
            fields: {
                CreatedAt: {
                    defaultValue: ''
                },
                ImageFile: {
                    defaultValue: ''
                }
            },
            PictureUrl: function () {
                return AppHelper.resolveImageUrl(this.get('ImageFile'));
            }
        },
        
        init: function () {
            var that = this,
            dataSource;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            dataSource = new kendo.data.DataSource({
                type: 'everlive',
                schema: {
                    model: that.trailsModel
                },
                transport: {
                    typeName: 'TrailsPictures'
                },
                change: function (e) {
                    if (e.items && e.items.length > 0) {
                        $('#no-images-span').hide();
                    }
                    else {
                        $('#no-images-span').show();
                    }
                },
                sort: { field: 'CreatedAt', dir: 'desc' }
            });
            
            that.set("trailsDataSource", dataSource);           
        }        
    });  
    
    app.trailsTracker = {
        viewModel: new TrailsTrackerViewModel()
    };
})(window);