// using module pattern
// utilizing iife

// controls Budget
var budgetController = (function () {

  var Expense = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
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

    calculatePercentages: function () {
      data.allItems.exp.forEach(cur => {
        cur.calcPercentage(data.totals.inc);
      })
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(cur => {
        return cur.getPercentage();
      })

      return allPerc;
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
    container: '.container',
    monthLabel: '.budget__title--month',
    expensePercents: '.item__percentage'
  }

  var formatNumber = function (num, type) {
    var numSplit, int, dec, sign;
    /*
    + or - before number
    exactly 2 decimal points
    comma seperating thousands
    */

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) {
      int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    type === 'exp' ? sign = '-' : sign = '+'

    return sign + ' ' + int + '.' + dec;

  };

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
      newHTML = newHTML.replace('%value%', formatNumber(obj.value));

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
      var type;
      if (obj.budget >= 0) { type = 'inc' } else { type = 'exp' }
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percent > 0) {
        document.querySelector(DOMstrings.percentLabel).textContent = obj.percent + '%';
      } else {
        document.querySelector(DOMstrings.percentLabel).textContent = '---';
      }
    },

    displayPercentages: function (percentages) {
      var percents = document.querySelectorAll(DOMstrings.expensePercents);
      for (var i = 0; i < percents.length; i++) {
        if(percentages[i] > 0) {
          percents[i].textContent = percentages[i] + '%';
        } else {
          percents[i].textContent = '---';
        }
      }
    },

    changedType: function () {

      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDesc + ',' +
        DOMstrings.inputValue + ',' +
        DOMstrings.inputBtn
      );

      for(var i = 0; i < fields.length; i++) {
        if(i === fields.length-1) {
          fields[i].classList.toggle('red');
        } else {
          fields[i].classList.toggle('red-focus');
        }
      }
    },

    getDOMstrings: function () {
      return DOMstrings;
    },

    getMonth: function () {
      var month = ['January','February','March','April','May','June',
      'July','August','September','October','November','December'];

      var date = new Date();
      var year = date.getFullYear();
      document.querySelector(DOMstrings.monthLabel).textContent = month[date.getMonth()] + ', ' + year;
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

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };

  var updateBudget = function () {
    // 1. calculate the budget
    budgetCtrl.calculateBudget();

    // 2. return budget
    var budget = budgetCtrl.getBudget();

    // 3. display the budget
    UICtrl.displayBudget(budget);
  }

  var updatePercentages = function () {

    // 1. calc percentages
    budgetCtrl.calculatePercentages();

    // 2. read percentages from budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. udpate ui with new percentages
    UICtrl.displayPercentages(percentages);
  };

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

      // 6. update percentages
      updatePercentages();
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

      // 4. update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log('App has started');
      UICtrl.displayBudget(budgetCtrl.getBudget());
      setupEventListeners();
      UICtrl.getMonth();
    }
  }

})(budgetController, UIController);


// initialize app
controller.init();