# custom aliases

alias ..='cd ..'

# Highlighting text / code and show line numbers 
pyg() { # sudo apt-get install python3-pygmentize reuqired !
        pygmentize $1 | perl -e 'print ++$i." $_" for <>'
        # OR
        pygmentize $1 | nl --body-numbering=a
}
