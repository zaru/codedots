class WebApp < Sinatra::Base

  register Sinatra::AssetPack

  assets do
    serve '/js', from: 'bower_components/'
    serve '/css', from: 'bower_components/'
    serve '/jso', from: 'assets/js/'
    serve '/scss', from: 'assets/scss/'

    js :application, [
                     '/**/*.js'
                   ]

    js_compression :jsmin

    css :application, [
                      '/**/*.css',
                      '/**/*.scss',
                    ]
    css_compression :scss
  end

  configure do
    set :public_folder, File.dirname(__FILE__) + '/public'
  end

  before do
  end

  get '/' do
    slim :index
  end

end