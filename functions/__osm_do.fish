function __osm_do
    printf '> %s\n' (string escape -- $argv | string join ' ') >&2

    if test "$__osm_dry_run" != 1
        $argv || return (__osm_trace)
    end
end
