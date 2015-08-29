require './parse.rb'
require './parse_png.rb'

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

  post '/parse' do
    if params[:files][0][:type] == 'image/png'
      puts params[:files][0][:tempfile].path
      ParsePng.execute(params[:files][0][:tempfile].path)
    else
      ParseCode.execute(File.read(params[:files][0][:tempfile]))
    end
  end

end