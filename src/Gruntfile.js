module.exports = function(grunt) {

  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';


  var buildFolder = '../build/';

  var jadedebug = {
    compileDebug: false,
    pretty: true,

    data:{
      partial: function(templatePath, dataObj){
        var template = grunt.file.read(templatePath);

        if(typeof(dataObj) === String){
          dataObj = grunt.file.readJSON(dataObj);
        }

        if(templatePath.match(/.jade/g)){
          return require('grunt-contrib-jade/node_modules/jade').compile(template, {filename: templatePath, pretty: true})(dataObj);
        }else{
          return template;
        }
      },
      data: function(path){
        return grunt.file.readJSON(path);
      },
      locals:{
        getConfigFile:function(path){
          return grunt.file.readJSON(path);
        },
        data: function(path){
          return jadedebug.data.data(path);
        },
        partial: function(templatePath, dataObj){
          return jadedebug.data.partial(templatePath, dataObj);
        }
      }
    }
  }






  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),


    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',


    clean: ['../build'],


    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      src: {
        src: ['js/*.js', 'js/**/*.js']
      }
    },



    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      build: {
        src: [
          'js/main.js'
          // 'js/libs/*.js',
          // 'js/project/*.js'
        ],
        dest: buildFolder+'js/<%= pkg.name %>.js'
      }
    },



    uglify: {
      options: {
        preserveComments: 'some'
      },
      build: {
        src: '<%= concat.monte.dest %>',
        dest: buildFolder+'js/<%= pkg.name %>.min.js'
      }
    },



    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      build: {
        options: {
          map: true
        },
        src: buildFolder+'style/style.css'
        // src: buildFolder+'style/<%= pkg.name %>.css'
      }
    },



    csslint: {
      options: {
        csslintrc: 'style/.csslintrc'
      },
      src: [buildFolder+'style/<%= pkg.name %>.css']
    },



    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      build: {
        src: [buildFolder+'style/<%= pkg.name %>.css'],
        dest: buildFolder+'style/<%= pkg.name %>.min.css'
      }
    },



    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: [
          buildFolder+'style/<%= pkg.name %>.css',
          buildFolder+'style/<%= pkg.name %>.min.css',
          buildFolder+'js/<%= pkg.name %>.js',
          buildFolder+'js/<%= pkg.name %>.min.js'
        ]
      }
    },



    csscomb: {
      options: {
        config: 'style/.csscomb.json'
      },
      build: {
        expand: true,
        cwd: buildFolder+'style/',
        src: ['*.css', '!*.min.css'],
        dest: buildFolder+'style/'
      }
    },



    // compile SASS files
    compass: {
      build: {
        options: {
          sassDir: 'style',
          cssDir: buildFolder+'style',
          outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      },
      deploy: {
        options: {
          sassDir: 'style',
          cssDir: buildFolder+'style',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      }
    },



    // copy files (font, img, js)
    copy: {
      fonts: {
        files: [{expand: true, cwd: 'style/fonts', src:['**'], dest: buildFolder+'style/fonts'}]
      },
      img: {
        files : [{expand: true, cwd: 'img', src: ['**'], dest: buildFolder+'img'}]
      },
      js: {
        files : [{expand: true, cwd: 'js', src: ['**'], dest: buildFolder+'js'}]
      }
    },



    // compile jade files
    jade: {
      index: {
        options: jadedebug,
        files: [{expand: true, cwd: './', src: ['*.jade'], dest: buildFolder, ext: '.html', flatten: true }]
      }
    },



    // watch file changes
    watch: {
      sass: {
        files: ['style/*.scss','style/**/*.scss'],
        tasks: ['compass:build', 'autoprefixer:build']
      },
      jade: {
        files: ['*.jade', 'html/*.jade'],
        tasks: ['jade:index']
      },
      img: {
        files: ['img/*.*', 'img/**/*.*'],
        tasks: ['copy:img']
      },
      js:{
        files: ['js/*.js', 'js/**/*.js'],
        tasks: ['copy:js']
      },
      fonts:
      {
        files: ['fonts/*.*'],
        tasks: ['copy:fonts']
      }
    },



    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dist/index.html': 'src/index.html',     // 'destination': 'source'
          'dist/contact.html': 'src/contact.html'
        }
      },
      dev: {                                       // Another target
        files: {
          'dist/index.html': 'src/index.html',
          'dist/contact.html': 'src/contact.html'
        }
      }
    },



    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'path/to/source/code/',
          themedir: 'path/to/custom/theme/',
          outdir: 'where/to/save/docs/'
        }
      }
    }

  });



  // Load the plugins
  // ===================================
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);




  // Default task(s)
  // ===================================
  grunt.registerTask('default', ['debug']);

  grunt.registerTask('debug', function() {
    grunt.task.run([
      'compass:build',
      'autoprefixer:build',
      'copy:img',
      'copy:js',
      'copy:fonts',
      'jade:index',
    ]);
  });

  grunt.registerTask('deploy', function() {
    grunt.task.run([
      'min',
      'cssmin'
    ]);
  });

};
