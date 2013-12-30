module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      src: ['models/*.js', 'routes/*.js', 'app.js'],
      options: {
        vendor: 'node_modules',
        host: 'http://localhost:3000',
        outfile: '/public/test/_SpecRunner.html'
        //https://github.com/gruntjs/grunt-contrib-jasmine
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

}