'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-material/angular-material.min.css',
        'public/lib/bootstarp-treeview/dist/bootstrap-treeview.min.css',
        'public/lib/flickity/dist/flickity.min.css',
      ],
      js: [
        'public/lib/jquery/dist/jquery.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/bootstarp-treeview/dist/bootstrap-treeview.min.js',
        'public/lib/flickity/dist/flickity.pkgd.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.js'
  }
};
