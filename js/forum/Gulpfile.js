var gulp = require('flarum-gulp');

gulp({
  modules: {
    'avatar4eg/contacts': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
