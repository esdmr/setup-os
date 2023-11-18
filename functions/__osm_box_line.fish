function __osm_box_line -a message
    set message (
        string shorten --no-newline --max (
            __osm_box_chars_left "$__osm_box_line_prefix$__osm_box_line_suffix"
        ) -- (__osm_box_normalize "$message")
    )

    set repeated (
        string repeat -Nn (
            __osm_box_chars_left "$__osm_box_line_prefix$message$__osm_box_line_suffix"
        ) -- "$__osm_box_line_repeated"
    )

    printf '%s%s%s%s%s%s\n' \
        (set_color normal) \
        "$__osm_box_line_prefix" \
        "$message" \
        (set_color normal) \
        "$repeated" \
        "$__osm_box_line_suffix"
end
