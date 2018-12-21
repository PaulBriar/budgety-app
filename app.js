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



	let data = {
		allItems: {
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		}
	}

})();

let UIController = (() => {
  let DOMstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  }

  return {
    getInput: () => {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
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

  let ctrlAddItem = () => {
    //Get field input data
    let input = UICtrl.getInput();
    //Add item to budget controller
    //Add new item to UI
    //Calculate the budget
    //Display budget on UI

  }

  return {
    init: () => {
      console.log('Application has started.');
      setupEventListeners();
    }
  }


})(budgetController, UIController);

controller.init();