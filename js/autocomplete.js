var modifiers = [
  'tag:',
  'suite:',
  'product:',
  'ver:'
];

function initAutocomplete() {
  $("#searchInput").textext({
    plugins : 'tags prompt focus autocomplete ajax arrow',
    tagsItems : [ 'Basic', 'JavaScript', 'PHP', 'Scala'  ],
    prompt : 'Add one...',
  })
}
