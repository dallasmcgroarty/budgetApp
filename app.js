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

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }

  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      // ID = last ID + 1
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // create new item
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else {
        newItem = new Income(ID, des, val)
      }

      // push item into data
      data.allItems[type].push(newItem);

      // return the item
      return newItem;
    },
    testing: function () {
      console.log(data);
    }
  };

})();

// controls UI
var UIController = (function () {
  // object to hold selectors
  var DOMstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    addListItem: function (obj, type) {
      var html, newHTML, element;
      // create html string with placeholder text

      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMstrings.expenseContainer
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace place holder text with some actual data
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%desc%', obj.desc);
      newHTML = newHTML.replace('%value%', obj.value);

      // insert html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

    },
    clearFields: function () {
      var fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);
      for (const i of fields) {
        i.value = '';
      };
      fields[0].focus();
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
    var input, newItem;

    // 1. get input data
    input = UICtrl.getInput();
    console.log(input);

    // 2. add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

    // 3. add the item to the UI
    UICtrl.addListItem(newItem, input.type);

    // clear fields
    UICtrl.clearFields();
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