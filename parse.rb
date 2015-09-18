require 'ripper'
require 'json'

class ParseCode

  @const_colors = {
      :on_nl => '#cd0000',
      :on_sp => '#CCCCCC',
      :on_tstring_beg => '#FFF000',
      :on_tstring_bend => '#000FFF',
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
      "false" => "#fafad2",
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
      "true" => "#008000",
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

  def self.execute(code)

    color_lists = []

    lexes = Ripper.lex(code)
    lexes.each do |key|
      if key[1] == :on_kw
        if @colors[key[2]].nil?
          p key[2]
        end
        color_lists << @colors[key[2]]
      elsif @const_colors.has_key?(key[1])
        color_lists << @const_colors[key[1]]
      else
        color_lists << '#ff00a8'

        key[2].unpack('U*').map do |c|
          rest = c % 3
          byte = c.to_s(16)
          if rest == 0
            color_lists << "#" + "#{byte}".ljust(6, '9')
          elsif rest == 1
            color_lists << "#" +  "#{byte}".center(6, '9')
          elsif rest == 2
            color_lists << "#" +  "#{byte}".rjust(6, '9')
          end
        end

        color_lists << '#ff9600'
      end
    end
    JSON.generate({kind: 'color', color: color_lists})
  end

end