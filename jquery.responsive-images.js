/*
 *   jquery.sc.responsive-images.js is a jQuery plugin that set appopriate image URL based on device width
 *   Plugin sets attribute ('src' by default) for the image or 'background-image' style for other tags. 
 *   Original image URL should be set in the 'data-src' or 'data-bg-src' attributes.
 *   Original images should be located in 'content/files/' directory.
 *   Responsive images should be located in 'images/{width}/' directory
 *   There are two plugin modes:
 *   - 'layout' mode check layout.media for document and set layout.width for images (default mode)
 *   - 'fluid' mode set document width for images. Images with width more than fluid.edge will use there original URL
 *
 *   js:
 *       $(selector).resImages([options]);
 *
 *   default options:
 *       {
 *           attribute: 'src',
 *           layout: [
 *               { name: 'MOBILE', media: 'only screen and (max-width: 639px)', width: '640' },
 *               { name: 'TABLET', media: 'only screen and (min-width: 640px) and (max-width: 1023px)', width: '1024' },
 *               { name: 'DESKTOP', media: 'only screen and (min-width: 1024px)', width: '-1' }
 *           ],
 *           fluid: {
 *               mode: false,
 *               edge: 1024
 *           }
 *       }
 *
 *   html:
 *       <img data-src="img" [attr] />
 *   or 
 *       <div data-bg-src="background/img" [attr]></div>
 *
 *   where:
 *       - data-src = "img",
 *         data-bg-src = "background/img" (image URL)
 *
 *   [attr]:
 *       - data-src-deny = "layout1[,layout2]" (avoid image loading for specific layout(s))
 *       - data-src-original = "layout1[,layout2]" (load original image size for specific layout(s))
 *       - data-src-original = "all" (load original image size for all layouts)
 *       - data-fluid-mode (empty attribute to use fluid width mode)
 *       - data-fluid-edge = "width" (change default maximum image width for fluid mode)
 */

(function ($) {

    var getCurrentLayout = function (list) {
        return $.grep(list, function (n, i) {
            return window.matchMedia(n.media).matches;
        })[0];
    };

    var hasAttribute = function (_attr, _data) {
        var res = false;
        var layouts = [];

        var attrValue = _data.target.data(_attr);
        if (attrValue) {
            if (attrValue.toUpperCase() == 'ALL')
                return true;
            layouts = attrValue.replace(/^\s+|\s+$/g, "").toUpperCase().split(/\s*,\s*/);
        };

        if (layouts.length) {
            for (var i = 0; i < layouts.length; i++) {
                if (getCurrentLayout(_data.settings.layout).name == layouts[i]) {
                    res = true;
                };
            };
        };

        return res;
    };

    var getWidth = function (_data) {
        var fluidMode = _data.settings.fluid.mode || _data.target.data('fluid-mode') != undefined;

        if (fluidMode) {
            var fluidWidth = _data.target.data('fluid-edge') || _data.settings.fluid.edge;
            var _width = $(document).width();
            if (_width >= fluidWidth) {
                _width = -1;
            };

            return _width;
        };

        return getCurrentLayout(_data.settings.layout).width;
    };

    var setImageSrc = function (_data) {
        var $img = _data.target;
        var src = $img.data('src') || $img.data('bg-src');

        if (!src || hasAttribute('src-deny', _data)) {
            return;
        };

        if (!hasAttribute('src-original', _data)) {
            var imgWidth = getWidth(_data);
            if (imgWidth != -1) {
                src = src.replace(/\/content\/files\//i, "/images/" + imgWidth + "/");
            };
        }

        if ($img.is('img')) {
            $img.attr(_data.settings.attribute, src);
        } else {
            $img.attr('style', 'background-image:url("' + src + '");');
        };
    };


    var methods = {
        init: function (options) {

            var settings = $.extend({
                attribute: 'src',
                layout: [
                    { name: 'MOBILE', media: 'only screen and (max-width: 639px)', width: '640' },
                    { name: 'TABLET', media: 'only screen and (min-width: 640px) and (max-width: 1023px)', width: '1024' },
                    { name: 'DESKTOP', media: 'only screen and (min-width: 1024px)', width: '-1' }
                ],
                fluid: {
                    mode: false,
                    edge: 1024
                }
            }, options);

            return this.each(function () {

                var $this = $(this),
                    data = $this.data('resImage');

                if (!data) {
                    var newData = {
                        target: $this,
                        settings: settings
                    };

                    setImageSrc(newData);

                    $(this).data('resImage', newData);
                }
            });
        },
        refresh: function (options) {
            return this.each(function () {

                var $this = $(this),
                    data = $this.data('resImage');

                if (!data) {
                    return;
                };

                setImageSrc(data);
            });
        }
    };

    $.fn.resImages = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
    };

})(jQuery);