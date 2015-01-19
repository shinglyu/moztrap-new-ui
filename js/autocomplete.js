var modifiers = [
  'tag:',
  'suite:',
  'product:',
  'ver:'
];

var fakeItems = [
  'tag:gaia',
  'tag:test',
  'tag:search',
  'tag:system',
  'suite:[Smoke] Clock',
  'suite:[RAT] Clock',
  'suite:[Non-Smoke] Clock',
  'product:Firefox OS',
  'product:Firefox',
  'product:Firefox TV',
  'product:MozTrap',
  'ver:Firefox OS 1.1',
  'ver:Firefox OS 1.2',
  'ver:Firefox OS 1.3',
  'ver:Firefox OS 2.1',
  'ver:Firefox OS 2.2',
  'ver:Firefox OS 3.1',

];

/*
groupedItemManager = {
  init: function(core){
    console.log('hi')
  },
  compareItems: null,
  filter: null,
  itemContains: null,
  itemToString: null,
  stringToItem: null,
};
*/

function GroupedItemManager() {}
var p = GroupedItemManager.prototype; //item manager

p.init = function(core) {};

p.filter = function(list, query)
{
  var result = [],
    i, item
    ;

  for(i = 0; i < list.length; i++)
  {
    item = list[i];
    if(this.itemContains(item, query))
      result.push(item);
  }

  return result;
};

p.itemContains = function(item, needle)
{
  return this.itemToString(item).toLowerCase().indexOf(needle.toLowerCase()) >= 0;
};

p.stringToItem = function(str)
{
  return str;
};

p.itemToString = function(item)
{
  return item;
};

p.compareItems = function(item1, item2)
{
  return item1 == item2;
};

function initAutocomplete() {
  $("#searchInput").textext({
    plugins : 'autocomplete suggestions tags',
    suggestions: modifiers.concat(fakeItems),//[ 'tag:', 'product:', 'suite:'],
    itemManager: GroupedItemManager,
    //prompt : 'Add one...'
  });
}

