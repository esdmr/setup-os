function __osm_task_all_names
    status stack-trace |
        string match -r '(?<=function \')[\w-]+(?=\')' |
        string match -rv '^_'
end
