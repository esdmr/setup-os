function __osm_task_last_name -d 'Get task name from stack trace'
    set fn (__osm_task_all_names)[1]

    test -n "$fn" || return (__osm_trace)
    printf '%s\n' "$fn"
end
