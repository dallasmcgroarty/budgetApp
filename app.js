// using module pattern
// utilizing iife

// controls Budget
var budgetController = (function () {

  var Expense = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  var Income = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  var allExpenses = [];
  var allIncomes = [];
  var totalExpenses = 0;
  
})();

// controls UI
var UIController = (function () {
  // object to hold selectors
  var DOMstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    }
  }

})();

// controller connects budgetController and UIController
// global app controller
var controller = (function (budgetCtrl, UICtrl) {

  var setupEventListeners =  function () {

    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e) {
      if (e.code === 'Enter') {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function () {
    // 1. get input data
    var input = UICtrl.getInput();
    console.log(input);
    // 2. add item to budget controller

    // 3. add the item to the UI

    // 4. calculate the budget

    // 5. display the budget
  };

  return {
    init: function () {
      console.log('App has started');
      setupEventListeners();
    }
  }

})(budgetController, UIController);


// initialize app
controller.init();