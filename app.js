let budgetController = ( () => {
  let x = 23;
  let add = (a) => {
    return x + a;
  }

  return {
    publicTest: (b) => {
      return add(b);
    }
  }
})();

let UIController = (() => {

})();

let controller = ((budgetCtrl, UICtrl) => {
  let z = budgetCtrl.publicTest(5);

  return {
    anotherPublic: () => {
      console.log(z);
    }
  }

})(budgetController, UIController);
