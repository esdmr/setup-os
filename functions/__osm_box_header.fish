function __osm_box_header -a message
    if test -n "$message"
        set message (
            string upper -- \
                "$__osm_box_header_wrap_left$message$__osm_box_header_wrap_right"
        )
    end

    set repeated (
        string repeat -Nn (
            __osm_box_chars_left "$__osm_box_header_prefix$message$__osm_box_header_suffix"
        ) -- "$__osm_box_header_repeated"
    )

    printf '%s%s%s%s\n' \
        "$__osm_box_header_prefix" \
        "$message" \
        "$repeated" \
        "$__osm_box_header_suffix"
end
