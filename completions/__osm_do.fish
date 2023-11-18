for i in (path filter -f $fish_complete_path/sudo.fish)
    source $i
end

complete -c __osm_do -e
complete -c __osm_do -a '(__fish_complete_sudo_subcommand)'
