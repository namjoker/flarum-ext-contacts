var gulp = require('flarum-gulp');

gulp({
  files: [
    'bower_components/html.sortable/dist/html.sortable.js'
  ],
  modules: {
    'avatar4eg/contacts': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
