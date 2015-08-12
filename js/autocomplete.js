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

function initAutocomplete(parentId) {

  /**
   * use ajax to pass correct info to ajax-plugin
   * 4 pages: case list, suite list, suite edit page "Add to suite", suite edit page "Remove from suite"
   */

   $("#SearchableCaseverList").find("#searchInput").textext(  // for case page
	autocompleteTextextParams("caseversion")
   );

   $("#SearchableSuiteList").find("#searchInput").textext(  // for suite list page
	autocompleteTextextParams("suite")
   );

   if(parentId === "ni_list" || "in_list") {
        $('#'+parentId).find("#searchInput").textext(  // for suite add/remove bar @suite edit page
	   autocompleteTextextParams("caseversion")
        );
   };

   $("#searchInput").bind('setFormData', function(e, data, isEmpty) {
       var textext = $(e.target).textext()[0];
       //console.log(textext.hiddenInput().val());
   });
}

function autocompleteTextextParams(searchType) {

   EVENT_TAG_ADDED = 'tagAdded'; //extend a new event for tags
	
   return {
       plugins : 'autocomplete ajax tags',
       itemManager: GroupedItemManager,
       ajax: {
	  dataType: "json",
          cacheResults: true,
	  params: {
	     url: config.baseUrl,
	     searchType: searchType,
             listLimit: config.defaultListLimit,
	     product: "",
	  }
       },
       //extension
       ext: {
	  tags: {
	     addTags: function(tags) {
		$.fn.textext.TextExtTags.prototype.addTags.apply(this, arguments);
		this.trigger(EVENT_TAG_ADDED, tags);
            }
          }
       }
      //prompt : 'Add one...'
   };
}
