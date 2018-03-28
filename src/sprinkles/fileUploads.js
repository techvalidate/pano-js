import * as Dropzone from 'dropzone'

Dropzone.autoDiscover = false;

UI.load(function() {
  if (Dropzone.isBrowserSupported()) {
    // dropzone callbacks
    const dropSuccess = function(responseText) {
      $(document).trigger('inline-spinner:hide', '.dropzone');
      return eval(responseText); // Just redirects to the current page via Turbolinks
    };

    const dropError = function(file, message, dropzone) {
      dropzone.removeFile(file);
      alert(message);
    };

    const onProgress = function(file, progress, bytesSent) {
      if (progress >= 100) {
        // reset the progressbar and show the spinner while the image is processing
        $('[data-dz-uploadprogress]').css('width', 0);
        $('.dz-progress').css('transition', 'none');
        $('.dz-progress').css('opacity', 0);
        $('.dz-filename').addClass('processing');
        $(document).trigger('inline-spinner:show', '.dropzone');
      }
    };

    // override Dropzone's default image sizer for thumbnail previews
    const onResize = function(file) {
      let thmbHeight = 0;
      let thmbWidth = 0;
      const previewHeight = parseInt($('.dropzone.dropzone-image-form').css('height'), 10);
      const previewWidth = parseInt($('.dropzone.dropzone-image-form').css('width'), 10);

      if (file.height >= file.width) {
        if (file.height > previewHeight) {
          thmbHeight = previewHeight;
          thmbWidth = (previewHeight * file.width) / file.height;
        } else {
          thmbHeight = this.options.thumbnailHeight;
          thmbWidth = parseInt((this.options.thumbnailHeight * file.width) / file.height);
        }
      } else {
        if (file.width > previewWidth) {
          thmbHeight = (previewWidth * file.height) / file.width;
          thmbWidth = previewWidth;
        } else {
          thmbHeight = parseInt((this.options.thumbnailWidth * file.height) / file.width);
          thmbWidth = this.options.thumbnailWidth;
        }
      }

      return {
        srcX:0,
        srcY:0,
        srcWidth: file.width,
        srcHeight: file.height,
        trgX:0,
        trgY:0,
        trgWidth: thmbWidth,
        trgHeight: thmbHeight
      };
    };

    // find image form elements that need dropzones
    $('.dropzone-image-form').each(function() {
      const dzForm = $(this);
      const param = dzForm.data('dropzone-param');
      // instantiate image uploaders
      const dropzone = new Dropzone('.dropzone-image-form', {
        headers: {"Accept": "text/javascript"},
        paramName: param,
        acceptedFiles: "image/*",
        uploadMultiple: false,
        clickable: true,
        maxFiles: 1,
        maxFilesize: 5,
        resize: onResize
      });

      // event handlers
      dropzone.on('success', (file, responseText) => dropSuccess(responseText));

      dropzone.on('error', function(file, message, test) {
        dropError(file, message, this);
      });

      return dropzone.on('uploadprogress', (file, progress, byesSent) => onProgress(file, progress, byesSent));
    });

    // find csv form elements that need dropzones
    $('.dropzone-csv-form').each(function() {
      const dzForm = $(this);
      const param = dzForm.data('dropzone-param');
      // instantiate csv uploaders
      const dropzone = new Dropzone('.dropzone-csv-form', {
        headers: {"Accept": "text/javascript"},
        paramName: param,
        acceptedFiles: "text/csv,.csv",
        uploadMultiple: false,
        clickable: true,
        maxFiles: 1
      });

      // event handlers
      dropzone.on('success', (file, responseText) => dropSuccess(responseText));

      dropzone.on('uploadprogress', (file, progress, byesSent) => onProgress(file, progress, byesSent));

      dropzone.on('error', function(file, message) {
        dropError(file, message, this);
      });
    });

    // find PO file form elements that need dropzones
    $('.dropzone-po-form').each(function() {
      const dzForm = $(this);
      const param = dzForm.data('dropzone-param');
      // instantiate csv uploaders
      const dropzone = new Dropzone('.dropzone-po-form', {
        headers: {"Accept": "text/javascript"},
        paramName: param,
        acceptedFiles: "text/x-gettext-translation, application/x-po, text/x-po, application/octet-stream, .po",
        uploadMultiple: false,
        clickable: true,
        maxFiles: 1
      });

      // event handlers
      dropzone.on('success', (file, responseText) => dropSuccess(responseText));

      dropzone.on('uploadprogress', (file, progress, byesSent) => onProgress(file, progress, byesSent));

      dropzone.on('error', function(file, message) {
        dropError(file, message, this);
      });
    });
  }
});
