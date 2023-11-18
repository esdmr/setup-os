function __osm_box_footer
    set repeated (
        string repeat -Nn (
            __osm_box_chars_left "$__osm_box_footer_prefix$__osm_box_footer_suffix"
        ) -- "$__osm_box_footer_repeated"
    )

    printf '%s%s%s%s\n' \
        (set_color normal) \
        "$__osm_box_footer_prefix" \
        "$repeated" \
        "$__osm_box_footer_suffix"
end
