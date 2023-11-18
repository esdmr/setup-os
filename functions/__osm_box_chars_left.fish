function __osm_box_chars_left
    math max 0, "$COLUMNS" - (string length --visible -- $argv)
end
