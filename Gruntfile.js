module.exports = function(grunt) {
	grunt.file.mkdir('build');

	grunt.initConfig({
		pkg: require('./package.json'),

		concat: {
			options: {
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %> by <%= pkg.author.name %> (<%= pkg.author.email %>) - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				src: ['lib/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history.js', 'src/joconut.js'],
				dest: 'build/joconut.js'
			}
		},

		uglify: {
			dist: {
				files: {
					'build/joconut.min.js': ['build/joconut.js']
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

	grunt.registerTask('default', ['concat', 'uglify']);
};
