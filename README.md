# OS Setup Scripting Framework

A set of functions to help with the process of setting up a UNIX OS via fish
shell. Obviously, you will need to install fish shell on that system first.

Currently, no task is provided by default. You will need to write your own setup
tasks.

## Creating tasks

1. Install fish shell[^1].
2. Run `./dev.fish` once to set the development environment up. Run with `-u` to
   revert this.
3. If you are using VS Code, optionally install [Fish completion
   extension](https://github.com/esdmr/fish-completion). Its development is
   currently suspended, but it should still work (mostly).
4. Create files under `tasks` directory. There may *not* be any subdirectories.
   The name of every file should start with `setup_` and end with `.fish`.
   Inside the file should be a function with the same name as the file.[^2]
5. Run `./lint.fish` to check indentation and consistency.
6. Use `web/` to figure out what sort of tasks you will need.
7. Run `./graph.fish` to generate an SVG of tasks and their dependencies via
   GraphViz `dot`.
8. You can test what will happen if you run the setup script via
   `./setup-os.fish --dry-run`. You can also pass `--skip-todo` if you have not
   implemented everything yet.

[^1]: I recommend using `>3.6.2` as `3.6.1` is missing
   [`fish-shell/fish-shell#9542`](https://togithub.com/fish-shell/fish-shell/pull/9542).
   If you do not have a rust compiler, you can use [`LastC++11`
   tag](https://togithub.com/fish-shell/fish-shell/releases/tag/LastC%2B%2B11)
   instead of `master`.
[^2]: The file `tasks/setup_apt_update.fish` would consist of a function called
   `setup_apt_update.fish` only.

## Running the setup script

1. Install fish shell[^1].
2. Run `./setup-os.fish`.
3. You may be prompted to enter the root password, or to do some action
   manually.
4. If any action fails, you may rerun the same command. It should pick up where
   it left off.

## Task structure

Example task:

```fish
function setup_apt_upgrade
    setup_apt_update || return
    __osm_sudo apt upgrade -y || return
end
```

Tasks are units of script which are only ever ran once. Even through reruns,
completed tasks will not be run again. The list of completed tasks is available
under `state/`.

A special task called `setup_init` is the entry point.

Note that almost every command should end with `|| return` to end the task early
if something has gone wrong.

- Actions: You can run commands and other functions with the `__osm_do`. This
  will show a stack trace if the command fails.
- Superuser actions: If the command must run as root, run the command with
  `__osm_sudo`. It is equivalent to `__osm_do sudo`.
- Manual action: If the user must do something manually, use
  `__osm_task_manual`. You may provide a message as argument(s).
- Not implemented actions: For placeholder actions, use `__osm_task_todo`.
- Dependency: If this task depends on another task to be done, you need to
  simply call that task function.[^3]&zwnj;[^4]
- Skipped actions: If a task is not applicable or already done, use
  `__osm_task_skip`.

[^3]: Tasks should not be called with `__osm_do`.
[^4]: I highly recommend putting these at the *top* of the task.
