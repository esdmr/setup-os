function __osm_task_begin
    set fn (__osm_task_last_name) || return
    printf 'Task \'%s\' has begun.\n' "$fn"
end
