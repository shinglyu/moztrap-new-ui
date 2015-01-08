var modifiers = [
  'tag:',
  'suite:',
  'product:',
  'ver:'
];

function initAutocomplete() {
  $("#searchInput").textext({
    plugins : 'autocomplete suggestions tags',
    suggestions: modifiers,//[ 'tag:', 'product:', 'suite:'],
    //prompt : 'Add one...'
  });
}
