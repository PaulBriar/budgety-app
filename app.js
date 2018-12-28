let budgetController = ( () => {

	let Expense = function(id, desc, value) {
		this.id = id;
		this.desc = desc;
		this.value = value;
	};

	let Income = function(id, desc, value) {
		this.id = id;
		this.desc = desc;
		this.value = value;
	};

	let calculateTotal = (type) => {
		let sum = 0;
		data.allItems[type].forEach((item) => {
			sum += item.value;
		});

		data.totals[type] = sum;
	};


	let data = {
		allItems: {
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		},
		budget: 0,
		percentage: -1,
	};

	return {
		addItem: (type, desc, val) => {
			let newItem, ID;

			//Create new ID
			data.allItems[type].length > 0 ? ID = data.allItems[type][data.allItems[type].length -1].ID + 1 : ID = 0;

			//Create new item based on 'inc' or 'exp' type
			if(type === 'exp') {
				newItem = new Expense(ID, desc, val);
			}	else if(type === 'inc') {
				newItem = new Income(ID, desc, val);
			}
			//Push new item into data structure
			data.allItems[type].push(newItem);
			//Return new element
			return newItem;
		},

		calculateBudget: () => {
			//Calculate total income & expenses
			calculateTotal('exp');
			calculateTotal('inc');
			//Calculate budget: Income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			//Calculate % of income spent

			if(data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: () => {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage,
			}
		},

		testing: () => {
			console.log(data);

		}
	}

})();

let UIController = (() => {
  let DOMstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incLabel: '.budget__income--value',
		expLabel: '.budget__expenses--value',
		percLabel: '.budget__expenses--percentage',
  }

  return {
    getInput: () => {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
		},

		addListItem: (obj, type) => {
			let html, newHtml, element;
			//Create html string with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//Replace placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.desc);
			newHtml = newHtml.replace('%value%', obj.value);
			//Insert the html into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		clearFields: () => {
			let fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDesc + ',' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fields.forEach((input) => {
				input.value = "";
			});

			fieldsArr[0].focus();
		},

		displayBudget: (obj) => {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expLabel).textContent = obj.totalExp;

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percLabel).textContent = '---';
			}
		},

    getDomStrings: () => {
      return DOMstrings;
    }
  }
})();

let controller = ((budgetCtrl, UICtrl) => {
  let setupEventListeners = () => {
    let DOM = UICtrl.getDomStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', (event) => {
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
    }
  });
	};

	let updateBudget = () => {
		//Calculate the budget
		budgetCtrl.calculateBudget();
		//Return the budget
		let budget = budgetCtrl.getBudget();
		//Display budget on UI
		UICtrl.displayBudget(budget);

	}

  let ctrlAddItem = () => {
		let input, newItem;
    //Get field input data
		input = UICtrl.getInput();

		if(input.desc !== '' && !isNaN(input.value) && input.value > 0) {
		//Add item to budget controller
		newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
		//Add new item to UI
		UICtrl.addListItem(newItem, input.type);
		//Clear the fields.
		UICtrl.clearFields();
		//Calculate and update budget
		updateBudget();
		}
  }

  return {
    init: () => {
			console.log('Application has started.');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1,
			});
      setupEventListeners();
    }
  }


})(budgetController, UIController);

controller.init();