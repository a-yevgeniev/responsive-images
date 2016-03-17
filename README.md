# responsive-images
jquery.responsive-images.js is a jQuery plugin that set appopriate image URL based on device width.

Plugin sets attribute ('src' by default) for the image or 'background-image' style for other tags. 
Original image URL should be set in the 'data-src' or 'data-bg-src' attributes.
Original images should be located in 'content/files/' directory.
Responsive images should be located in 'images/{width}/' directory

There are two plugin modes:
* 'layout' mode check layout.media for document and set layout.width for images (default mode)
* 'fluid' mode set document width for images. Images with width more than fluid.edge will use there original URL

* * *
js:
    
    $(selector).resImages([options]);

default options:

    {
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
    }

html:

    <img data-src="img" [attr] />
or 

    <div data-bg-src="background/img" [attr]></div>

where:

    - data-src = "img",
      data-bg-src = "background/img" (image URL)

[attr]:

    - data-src-deny = "layout1[,layout2]" (avoid image loading for specific layout(s))
    - data-src-original = "layout1[,layout2]" (load original image size for specific layout(s))
    - data-src-original = "all" (load original image size for all layouts)
    - data-fluid-mode (empty attribute to use fluid width mode)
    - data-fluid-edge = "width" (change default maximum image width for fluid mode)
