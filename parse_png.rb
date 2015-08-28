require 'RMagick'

IMG_FILE = "demo2.png"
img = Magick::Image.read(IMG_FILE).first
px_x = img.columns       # 横
px_y = img.rows          # 縦

(0..px_y).each do |y|
  (0..px_x).each do |x|
    next if x % 4 != 0 || y % 4 != 0
    red = (img.pixel_color(x, y).red / 257)
    green = (img.pixel_color(x, y).green / 257)
    blue = (img.pixel_color(x, y).blue / 257)
    puts "#%02X%02X%02X" % [red, green, blue]
  end
end