module.exports = function(grunt) {

  grunt.initConfig({
    gitpush: {
      target: {
        options: {
          remote: 'ssh://root@159.203.231.235/var/repo/site.git',
          branch: 'master'
        }
      }
    },

    pkg: grunt.file.readJSON(

      'package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/dist/*.js'],
        dest: 'public/client.min.cat.js',
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        files: [{
          expand: true,
          src: ['public/client/*.js', 'app/**/*.js', 'lib/*.js'],
          dest: 'public/dist',
          flatten: true,
          ext: '.min.js'
        }]
      }
    },

    eslint: {
      files: {
        src: ['app/**/*.js', 'public/client/*.js', 'lib/*.js']
      },
      options: {
        config: 'node_modules/eslint-config-hackreactor/package.json',
        rulesDir: 'node_modules/eslint-config-hackreactor/'
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    }
  }),

  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('eslint-grunt');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  grunt.registerTask('upload', [ 
    'server-dev' 
  ]);

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'test', 'ugly', 'concatenate', 'ugly_css', 'lint'
  ]);

  grunt.registerTask('push', [
    'gitpush'
  ]);

  // grunt.registerTask('upload', function(n) {
  //   if (grunt.option('prod')) {
  //     // add your production server task here
  //   } else {
  //     grunt.task.run([ 'server-dev' ]);
  //   }
  // });

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'build']);
    }
      grunt.task.run([ 'push' ]);
  });

  grunt.registerTask('concatenate', [
    'concat'
  ]);

  grunt.registerTask('ugly', [
    'uglify'
  ]);

  grunt.registerTask('ugly_css', [
    'cssmin'
  ]);

  grunt.registerTask('lint', [
    'eslint'
  ]);
};
