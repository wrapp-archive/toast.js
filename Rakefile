require 'rubygems'

desc "build the toast-min.js files for distribution"
task :default => :clean do

  build_directory = 'build'
  FileUtils.mkdir_p(build_directory)

  compile_js(build_directory)
  compile_css(build_directory)
end

def compile_js(build_directory)
  require 'coffee-script'
  require 'closure-compiler'

  source1 = File.read(File.join('src', 'vendor', 'transition-callbacks.js',
                                'src', 'coffeescripts', 'transition-callbacks.js.coffee'))
  source2 = File.read(File.join('src', 'coffeescripts', 'toast.js.coffee'))


  build_directory = File.join(build_directory, 'javascripts')
  FileUtils.mkdir_p(build_directory)
  output = File.join(build_directory, 'toast.js')
  minified_output = File.join(build_directory, 'toast-min.js')
  compiled = ''

  print_action("Compiling CoffeeScript to '#{output}'") do
    File.open(output, 'w+') do |file|
      compiled << CoffeeScript.compile(source1)
      compiled << CoffeeScript.compile(source2)
      file.write(compiled)
    end
  end

  print_action("Minifying Javascript to '#{minified_output}'") do
    File.open(minified_output, 'w+') do |file|
      file.write(Closure::Compiler.new.compress(compiled))
    end
  end
end

def print_action(action, &block)
  print "#{action}... "
  STDOUT.flush

  if block.call()
    puts 'done'
  else
    puts 'failed'
  end
end

def compile_css(build_directory)
  require 'compass'

  build_directory = File.join(build_directory, 'stylesheets')
  FileUtils.mkdir_p(build_directory)
  output = File.join(build_directory, 'toast.css')
  minified_output = File.join(build_directory, 'toast-min.css')

  print_action("Compiling SCSS to '#{output}'") do
    system("compass compile src/scss/toast.scss -q && mv #{output} #{output}.tmp")
  end

  print_action("Minifying CSS to '#{minified_output}'") do
    system("compass compile src/scss/toast.scss -q -e production -s compressed && mv #{output} #{minified_output}")
  end

  system("mv #{output}.tmp #{output}")
end

desc "build the toast-min.js files for distribution"
task :build => :default

desc "removes the build directory"
task :clean do
  print_action('Removing existing build directory') do
    FileUtils.rm_rf('build')
  end
end

desc "release a new version of toast.js"
task :release, [:version] => :clean do |t, args|
  raise 'Please specify a version' unless args.version
  version = args.version

  commands = [
    "sed -E -i '' \"s/@VERSION: '[0-9.]+'/@VERSION: '#{version}'/g\" src/coffeescripts/toast.js.coffee",
    "git commit -a -m 'Bump the version to #{version}'",
    "rake clean",
    "git checkout master",
    "git merge develop --no-ff",
    "rake build",
    "git add build -f",
    "git commit -m 'Release version #{version}'",
    "git tag #{version}"
  ].join(' && ')

  system(commands)
end
