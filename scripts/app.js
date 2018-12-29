let budgetController = ( () => {

	let Expense = function(id, desc, value) {
		this.id = id;
		this.desc = desc;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	}

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
			data.allItems[type].length > 0 ? ID = data.allItems[type][data.allItems[type].length -1].id + 1 : ID = 0;

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

		deleteItem: (type, id) => {
			let ids, index;

			ids = data.allItems[type].map((current) => {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
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

		calculatePercentages: () => {
			data.allItems.exp.forEach((item) => {
				item.calcPercentage(data.totals.inc);
			});
		},

		getPercentage: () => {
			let allPerc = data.allItems.exp.map((item) => {
				return item.getPercentage();
			});
			return allPerc;
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
		container: '.container',
		expPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month',
  };

  let formatNum = function(num, type) {
	let numSplit, int, dec;

	num = Math.abs(num);
	num = num.toFixed(2);

	numSplit = num.split('.');

	int = numSplit[0];
	if (int.length > 3) {
		int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
	}

	dec = numSplit[1];

	return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
};

let nodeListForEach = (nodeList, callback) => {
	for(let i = 0; i < nodeList.length; i++) {
		callback(nodeList[i], i);
	}
};

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
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//Replace placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.desc);
			newHtml = newHtml.replace('%value%', formatNum(obj.value, type));
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

		deleteListItem: (selectorID) => {
			let element = document.getElementById(selectorID);

			element.parentNode.removeChild(element);
		},

		displayBudget: (obj) => {
			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNum(obj.budget, type);
			document.querySelector(DOMstrings.incLabel).textContent = formatNum(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expLabel).textContent = formatNum(obj.totalExp, 'exp');

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percLabel).textContent = '---';
			}
		},

		displayPercentages: (percentages) => {
			let fields = document.querySelectorAll(DOMstrings.expPercLabel)

			nodeListForEach(fields, (item, index) => {
				if (percentages[index] > 0) {
					item.textContent = percentages[index]+ '%';
				} else {
					item.textContent = '---';
				}
			});
		},

		changedType: () => {
			let fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDesc + ',' +
				DOMstrings.inputValue);

				nodeListForEach(fields, (item) => {
					item.classList.toggle('red-focus');
				}) ;

				document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
		},

		//Get dates for UI
		displayMonth: () => {
			let now, year, month, months;

			now = new Date();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			month = now.getMonth();

			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] +' ' + year;

		},

    getDomStrings: () => {
      return DOMstrings;
    }
  }
})();
//Global app controller
let controller = ((budgetCtrl, UICtrl) => {
  let setupEventListeners = () => {
    let DOM = UICtrl.getDomStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', (event) => {
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
    }
	});

	document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

	document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};

	let updateBudget = () => {
		//Calculate the budget
		budgetCtrl.calculateBudget();
		//Return the budget
		let budget = budgetCtrl.getBudget();
		//Display budget on UI
		UICtrl.displayBudget(budget);

	};

	let updatePercentages = () => {
		//Calculate percentages
		budgetCtrl.calculatePercentages();
		//Read % from biudget controller
		let percentages = budgetCtrl.getPercentage();
		//Update ui
		UICtrl.displayPercentages(percentages);

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
		//Calculate and update percentages
		updatePercentages();
		};
	};

	let ctrlDeleteItem = (event) => {
		let itemID, splitID, type, id;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			id = parseInt(splitID[1]);
			//Delete item from data structure
			budgetCtrl.deleteItem(type, id);
			//Delete the item from UI
			UICtrl.deleteListItem(itemID);
			//Update UI
			updateBudget();
			//Calculate and update percentages
			updatePercentages();
		};


	};

  return {
    init: () => {
			console.log('Application has started.');
			UICtrl.displayMonth();
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