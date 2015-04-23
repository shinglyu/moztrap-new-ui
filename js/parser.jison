
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[a-zA-Z0-9]+          return 'CHARS'
":"                   return 'SEP'
["']                  return 'QUOTE'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

e   
    : e query
        {$$ = $1.concat([$2]);}
    | query
        {$$ = [$1];}
    ;
query
    : word SEP word
        {$$ = {'key': $1, 'value': $3};}
    | word
        {$$ = {'key':'', 'value':$1};}
    ;

word
    : CHARS
        {$$ = $1}
    | QUOTE wordwithspace QUOTE
        {$$ = $2}
    ;

wordwithspace
    : wordwithspace CHARS
      {$$ = $1 + " " + $2}
    | CHARS
      {$$ = $1}
    ;

