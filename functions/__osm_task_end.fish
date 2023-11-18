function __osm_task_end
    set fn (__osm_task_last_name) || return
    __osm_do touch $__osm_store/$fn || return
    printf 'Task \'%s\' is done.\n' "$fn"

    function $fn
    end
end
