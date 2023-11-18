function __osm_task_setup_store -d 'Create the task store'
    __osm_do mkdir -p $__osm_store || return

    test "+$(path resolve (status dirname)/../state)" = +$__osm_store ||
        __osm_do ln -sfn $__osm_store "$(status dirname)/../state" ||
        return

    for i in (functions -n | string match -re '^setup_')
        printf '
            functions --copy %s __osm_original_%s
            function %s
                __osm_task_begin || return
                __osm_original_%s || return
                __osm_task_end || return
            end
        ' "$i" "$i" "$i" "$i" | source
    end

    for i in (__osm_do ls $__osm_store)
        function $i
            __osm_task_skip || return
        end
    end
end
