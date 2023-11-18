#!/usr/bin/env fish
argparse \
    (fish_opt -s 'h' -l 'help') \
    (fish_opt -s 'u' -l 'uninstall') \
    -- $argv || return

if test -n "$_flag_help"
    echo 'dev.fish: set the development environment up.'
    echo 'Usage: ./dev.fish [--help|--uninstall]'
    return
end

set file $__fish_config_dir/conf.d/os-migration-dev.fish

if test -f $file
    if test -n "$_flag_uninstall"
        command rm -v $file
    else
        echo 'already setup or conflicting with a different script.' >&2
        return 1
    end
else
    if test -n "$_flag_uninstall"
        echo 'already uninstalled.' >&2
        return 1
    else
        echo "#!/usr/bin/env fish
set -a fish_complete_path $(pwd)/completions
set -a fish_function_path $(pwd)/{functions, tasks}" >$file
        echo created "'$file'"
    end
end
