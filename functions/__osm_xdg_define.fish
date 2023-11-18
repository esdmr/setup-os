function __osm_xdg_define -a var default
    argparse -N 2 -X 2 -- $argv || return

    set -q $var &&
        test -n "$$var" ||
        set -gx $var $default

    test -e "$$var" ||
        __osm_do mkdir -p "$$var"
end
