#!/usr/bin/env fish
cd (status dirname)
set file graph.dot

printf 'digraph {\n' >$file
printf '\tnode [shape=oval];\n\n' >>$file

for filename in (ls tasks)
    set fn (path change-extension '' $filename)

    if cat tasks/$filename | string match -rq '\b__osm_task_todo\b'
        set style dashed
    else
        set style solid
    end

    printf '\t%s[label="%s", style="%s"];' \
        $fn \
        (string sub --start 7 -- $fn | string replace -a '_' ' ') \
        $style >>$file

    cat tasks/$filename |
        string match -ar '(?<!function )\bsetup_\w*\b' |
        string join ' ' |
        read deps

    printf '\t%s -> {%s};\n' \
        $fn \
        $deps >>$file
end

printf '}\n' >>$file
dot -Tsvg $file >(path change-extension svg $file)
open (path change-extension svg $file)
