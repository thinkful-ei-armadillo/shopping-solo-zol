'use strict';


const STORE = {
  items: [{name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideCompleted: false,
};

// generate HTML element of item
function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <span class="js-shopping-item-edit hidden"><input type="text" value=${item.name}></input><button class="js-edit-button">OK</button></span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}


function renderShoppingList(items = STORE.items) {
  const shoppingListItemsString = STORE.hideCompleted ? generateShoppingItemsString(items.filter(item => !item.checked)) : generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

// ===== hide checked items =====

function toggleHideCheckedState(){
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleToggleCheckedItems(){
  $('.js-hide-checked-items').click(event =>{
    toggleHideCheckedState();
    renderShoppingList(); 
  });
}

// ===== search maching item(s) =====

function checkMatchingItem(item){
  const matchingItems = STORE.items.filter(obj => obj.name === item);
  return matchingItems;
}
 
function handleSearchItemSubmit(){
  $('#js-search-item-form').submit(event => {
    event.preventDefault();
    const searchItem = $('.js-search-item-entry').val();
    $('.js-search-item-entry').val('');
    renderShoppingList(checkMatchingItem(searchItem));
  });
}

// ===== add item to list =====

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(event => {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}


//  ===== check/uncheck item =====

function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// ===== delete item from list =====

function deleteItemFromList(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItemFromList(itemIndex);
    renderShoppingList();
  });
}

// ===== edit item from list data=====

function updateItemName(currentName, newName){
  // this function updates item name in STORE
  console.log('Edited version item name:' + newName);
  STORE.items.forEach(obj => {
    if(obj.name === currentName) obj.name = newName;
  });
}

function handleEditItemSubmit(){
  $('.js-edit-button').click(event => {
    let editedItemName = $(event.currentTarget).siblings('input').val();
    let currentItemName = $(event.currentTarget).closest('li').find('.shopping-item').text();
    console.log(editedItemName);
    console.log(currentItemName, editedItemName);
    
    updateItemName(currentItemName, editedItemName);
    renderShoppingList();
  });
  console.log('handleEditItemSubmit ran');
}

function handleEditItemClicked() {
  // this function toggles CSS class 'hidden' to open input for editing item 
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {
    $(event.currentTarget).closest('li').find('.js-shopping-item-edit').toggleClass('hidden');
 
    $(event.currentTarget).closest('li').find('.js-shopping-item').toggleClass('hidden');
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleCheckedItems();
  handleSearchItemSubmit();
  handleEditItemClicked();
  handleEditItemSubmit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);