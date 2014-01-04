module.exports = function(grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project Configuration
  var yeomanConfig = {
    app: 'app',
    pub: 'public',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      dev: {
        files: ['server.js', 'app/**/*.js'],
        tasks: ['jshint'],
      },
      test: {
        options: {
          spawn: false
        },
        files: ['test/**/*.js', 'app/**/*.js'],
        tasks: ['mochaTest']
      }
    },
    jshint: {
      all: ['gruntfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/controllers/**/*.js', 'app/views/**/*.js']
    },
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['app', 'config'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000,
          },
          cwd: __dirname
        }
      }
    },

    shell: {
      mongodb: {
        command: 'mongod'
      },
      test: {
        command: 'echo "foo"'
      }
    },

    concurrent: {
      dev: {
        tasks: ['shell:mongodb', 'nodemon', 'watch'],
      },
      test: {
        tasks: ['shell:mongodb', 'mochaTest', 'watch:test'],
      },
      options: {
        logConcurrentOutput: true
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['./test/**/*.js']
      }
    }
  });

grunt.event.on('watch', function(action, filepath, target) {
  grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
});

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell-spawn');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['jshint',  'concurrent']);

  //Test task.
  grunt.registerTask('test', ['concurrent:test']);
};
