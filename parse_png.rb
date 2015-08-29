require 'RMagick'
require 'json'

class ParsePng

  @const_colors = {
      '#cd0000' => "\n",
      '#cccccc' => ' ',
      '#fff000' => '"',
      '#000fff' => '"'
  }

  @colors = {
      "BEGIN" => "#000000",
      "class" => "#f0f8ff",
      "ensure" => "#008b8b",
      "nil" => "#ffffe0",
      "self" => "#ff7f50",
      "when" => "#696969",
      "END" => "#e6e6fa",
      "def" => "#008080",
      "FALSE" => "#fafad2",
      "not" => "#ff6347",
      "super" => "#808080",
      "while" => "#b0c4de",
      "alias" => "#2f4f4f",
      "defined?" => "#fffacd",
      "for" => "#ff4500",
      "or" => "#a9a9a9",
      "then" => "#778899",
      "yield" => "#006400",
      "and" => "#f5deb3",
      "do" => "#ff0000",
      "if" => "#c0c0c0",
      "redo" => "#708090",
      "TRUE" => "#008000",
      "__LINE__" => "#deb887",
      "begin" => "#dc143c",
      "else" => "#d3d3d3",
      "in" => "#4682b4",
      "rescue" => "#228b22",
      "undef" => "#d2b48c",
      "__FILE__" => "#c71585",
      "break" => "#dcdcdc",
      "elsif" => "#4169e1",
      "module" => "#2e8b57",
      "retry" => "#f0e68c",
      "unless" => "#ff1493",
      "__ENCODING__" => "#f5f5f5",
      "case" => "#191970",
      "end" => "#3cb371",
      "next" => "#ffff00",
      "return" => "#ff69b4",
      "until" => "#000080"
  }

  @alphaColors = {
      "a" => "#66cdaa",
      "b" => "#ffd700",
      "c" => "#db7093",
      "d" => "#fffafa",
      "e" => "#00008b",
      "f" => "#8fbc8f",
      "g" => "#ffa500",
      "h" => "#ffc0cb",
      "i" => "#f8f8ff",
      "j" => "#0000cd",
      "k" => "#7fffd4",
      "l" => "#f4a460",
      "m" => "#ffb6c1",
      "n" => "#fffaf0",
      "o" => "#0000ff",
      "p" => "#98fb98",
      "q" => "#ff8c00",
      "r" => "#d8bfd8",
      "s" => "#faf0e6",
      "t" => "#1e90ff",
      "u" => "#90ee90",
      "v" => "#daa520",
      "w" => "#ff00ff",
      "x" => "#faebd7",
      "y" => "#6495ed",
      "z" => "#00ff7f",
      "A" => "#cd853f",
      "B" => "#cc00cc",
      "C" => "#ffefd5",
      "D" => "#00bfff",
      "E" => "#00fa9a",
      "F" => "#b8860b",
      "G" => "#ee82ee",
      "H" => "#ffebcd",
      "I" => "#87cefa",
      "J" => "#7cfc00",
      "K" => "#d2691e",
      "L" => "#dda0dd",
      "M" => "#ffe4c4",
      "N" => "#87ceeb",
      "O" => "#7fff00",
      "P" => "#a0522d",
      "Q" => "#da70d6",
      "R" => "#ffe4b5",
      "S" => "#add8e6",
      "T" => "#adff2f",
      "U" => "#8b4513",
      "V" => "#ba55d3",
      "W" => "#ffdead",
      "X" => "#b0e0e6",
      "Y" => "#00ff00",
      "Z" => "#800000"
  }

  def self.execute(file_path)
    img = Magick::Image.read(file_path).first
    px_x = img.columns       # 横
    px_y = img.rows          # 縦

    colors = []
    (0..px_x).each do |x|
      (0..px_y).each do |y|
        next if x % 12 != 0 || y % 12 != 0
        next if img.pixel_color(x, y).opacity > 0
        red = (img.pixel_color(x, y).red / 257)
        green = (img.pixel_color(x, y).green / 257)
        blue = (img.pixel_color(x, y).blue / 257)
        colors << "#%02X%02X%02X" % [red, green, blue]
      end
    end

    JSON.generate({kind: 'code', code: self.decode(colors)})
  end

  def self.decode(test)

    colors = @colors.invert
    const_colors = @const_colors
    alpha_colors = @alphaColors.invert

    code = ""
    str_flag = false
    chars = []
    test.each do |color|
      color = color.downcase
      p color
      if colors.has_key?(color)
        code += colors[color]
      elsif const_colors.has_key?(color)
        code += const_colors[color]
      elsif color == '#ffffff' && str_flag === false
        str_flag = true
        chars = []
      elsif color == '#ffffff' && str_flag === true
        str_flag = false
        chars.map do |char|
          if alpha_colors.has_key?(char)
            code += alpha_colors[char]
          else
            code += char.gsub('#', '').hex.chr
          end
        end
      elsif str_flag === true
        chars << color
      else
        if alpha_colors.has_key?(color)
          code += alpha_colors[color]
        else
          code += color.gsub('#', '').hex.chr
        end
      end
    end

    code
  end
end
