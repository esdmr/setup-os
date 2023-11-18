function __osm_task_skip
    set fn (__osm_task_last_name) || return
    printf 'Task \'%s\' is skipped.\n' "$fn"

    function $fn
    end
end
