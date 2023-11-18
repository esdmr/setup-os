#!/usr/bin/env fish
set -l failed_files (fish_indent -c **.fish 2>&1)
set -l fish_indent_status $status
set -l failures (count $failed_files)

for filename in $failed_files
    echo "::error file=$filename,line=1,col=1::fish_indent failed in '$filename'."
end

for filename in {functions, tasks, data}/*.fish
    set -l decl 'function '(path change-extension '' $filename)

    switch (head -n 1 $filename)
        case $decl $decl' *'
            # Valid name. Do nothing.

        case 'function *'
            # Invalid name.
            echo "::error file=$filename,line=1,col=10::Function in file '$filename' is not consistent with the file name."
            set failures (math $failures + 1)

        case '*'
            # Invalid file.
            echo "::error file=$filename,line=1,col=10::File '$filename' must have one function declaration, since it is under 'functions' directory."
            set failures (math $failures + 1)
    end
end

echo "There were $failures failures."
test "$failures" -eq 0
