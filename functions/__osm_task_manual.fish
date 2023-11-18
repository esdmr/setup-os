function __osm_task_manual
    printf '%s\n' $argv

    if test "$__osm_dry_run" = 1
        printf 'Task \'%s\' needs to be done manually.\n' (__osm_task_last_name)
        return
    end

    while read input \
            -P 'The task needs to be done manually. Type ‘ok’ afterwards or ‘cancel’ to quit: '

        switch (string lower "$input")
            case ok
                return 0
            case cancel q c quit \cC
                break
        end
    end

    printf 'Task \'%s\' was cancelled. (You should run the command again to retry.)\n' (__osm_task_last_name) >&2
    return 1
end
