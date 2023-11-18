#!/usr/bin/env fish

# Script to do initial OS setup. You will need to install fish shell first.
# Copyright 2023 esdmr. Licensed under MIT.

argparse \
    (fish_opt -s h -l help) \
    (fish_opt -s t -l trace) \
    (fish_opt -s d -l dry-run) \
    (fish_opt -s z -l pass-todo --long-only) \
    -- $argv || return

if test -n "$_flag_help"
    echo 'setup-os.fish: run the setup script.'
    echo 'Usage: ./setup-os.fish [--help|--trace|--dry-run|--pass-todo]'
    return
end

if test -n "$_flag_trace"
    set __osm_trace_debug 1
end

if test -n "$_flag_dry_run"
    set __osm_dry_run 1

    if test -n "$_flag_pass_todo"
        set __osm_todo_pass 1
    end
end

set -a fish_function_path (status dirname)/{functions, tasks}

set __osm_box_header_prefix '  ┌'
set __osm_box_header_suffix '┐  '
set __osm_box_header_repeated '─'
set __osm_box_header_wrap_left '╴ '
set __osm_box_header_wrap_right ' ╶'
set __osm_box_line_prefix '  │ '
set __osm_box_line_suffix ' │  '
set __osm_box_line_repeated ' '
set __osm_box_footer_prefix '  └'
set __osm_box_footer_suffix '┘  '
set __osm_box_footer_repeated '─'

set __osm_trace_normal ''
set __osm_trace_hidden (set_color -d)

__osm_xdg_define XDG_CACHE_HOME ~/.cache
__osm_xdg_define XDG_CONFIG_HOME ~/.config
__osm_xdg_define XDG_DATA_HOME ~/.local/share
__osm_xdg_define XDG_STATE_HOME ~/.local/state

set __osm_store $XDG_STATE_HOME/os-setup
__osm_task_setup_store

setup_init
