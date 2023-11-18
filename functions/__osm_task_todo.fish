function __osm_task_todo
    printf 'Task \'%s\' is not implemented yet.\n' (__osm_task_last_name) >&2

    if test "$__osm_todo_pass" = 1
        return 0
    end

    __osm_trace
    return 1
end
