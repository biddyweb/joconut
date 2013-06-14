/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.title %> - v<%= pkg.version %> by <%= pkg.author.name %> (<%= pkg.author.email %>) - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: ['lib/history.js', 'src/joconut.js'],
        dest: 'dist/joconut.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/joconut.min.js': ['dist/joconut.js']
        }
      }
    },
    watch: {
      files: ['src/joconut.js'],
      tasks: ['concat', 'uglify']
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Default task.
  grunt.registerTask('default', ['concat', 'uglify']);

};
