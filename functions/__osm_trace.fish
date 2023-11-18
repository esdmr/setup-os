function __osm_trace -d \
    'Print stack trace but keep $status. Use it like `|| return (__osm_trace)`'
    set old_status $status

    printf '%s\n' (set_color normal) >&2
    __osm_box_header 'stack trace' >&2

    set prefix "$__osm_trace_hidden"

    for i in (status stack-trace)
        if string match -rq '(?<=function \')(?<name>[\w-]+)(?=\')' -- "$i"
            if string match -rq '^_' -- $name
                set prefix "$__osm_trace_hidden"
            else
                set prefix "$__osm_trace_normal"
            end
        end

        if test "$prefix" != "$__osm_trace_hidden" -o "$__osm_trace_debug" = 1
            __osm_box_line "$prefix$i" >&2
        end
    end

    __osm_box_footer >&2

    return $old_status
end
