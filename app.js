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
    },
    budget: 0,
    percent: -1
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

      // update totals as we add new items
      data.totals[type] += val;

      // return the item
      return newItem;
    },

    deleteItem: function (type, ID) {
      // delete the item from array and update totals
      data.allItems[type] = data.allItems[type].filter(function (item) {
        if (item.id === ID) {
          data.totals[type] -= item.value;
        }
        return item.id !== ID
      });

    },

    calculateBudget: function () {

      // calc budget: income - expenses

      data.budget = data.totals.inc - data.totals.exp;

      // calc percentage of income spent
      if (data.totals.inc >= data.totals.exp) {
        data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percent = -1;
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percent: data.percent
      }
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
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentLabel: '.budget__expenses--percentage',
    container: '.container'
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function (obj, type) {
      var html, newHTML, element;
      // create html string with placeholder text

      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMstrings.expenseContainer
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

    deleteListItem: function (ID) {
      document.getElementById(ID).remove();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = '+ ' + obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent = '- ' + obj.totalExp;

      if (obj.percent > 0) {
        document.querySelector(DOMstrings.percentLabel).textContent = obj.percent + '%';
      } else {
        document.querySelector(DOMstrings.percentLabel).textContent = '---';
      }
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function () {
    // 1. calculate the budget
    budgetCtrl.calculateBudget();

    // 2. return budget
    var budget = budgetCtrl.getBudget();

    // 3. display the budget
    console.log(budget);

    UICtrl.displayBudget(budget);
  }

  var ctrlAddItem = function () {
    var input, newItem;

    // 1. get input data
    input = UICtrl.getInput();

    if (input.desc !== '' && !isNaN(input.value) && input.value > 0) {
      console.log(input);
      // 2. add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

      // 3. add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. clear fields
      UICtrl.clearFields();

      // 5. calculate and update budget
      updateBudget();
    }
  };

  // delete item (income or expense) from dom
  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = Number(splitID[1]);

      // 1. delete item from data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. delete item from ui
      UICtrl.deleteListItem(itemID);

      // 3. update and show the new budget
      updateBudget();
    }
  };

  return {
    init: function () {
      console.log('App has started');
      UICtrl.displayBudget(budgetCtrl.getBudget());
      setupEventListeners();
    }
  }

})(budgetController, UIController);


// initialize app
controller.init();