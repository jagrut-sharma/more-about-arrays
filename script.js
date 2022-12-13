'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  // checking whether to sort or not
  // We have used slice as slice will create a shallow copy as sort will alter original movements array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.innerText = '';
  movs.forEach((mov, index) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((account, curr) => account + curr, 0);
  labelBalance.innerText = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incoming = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incoming}€`;

  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outgoing)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(amt => amt * (acc.interestRate / 100))
    .filter(int => int > 1)
    .reduce((acc, int, i, arr) => acc + int, 0);

  labelSumInterest.textContent = interest.toFixed(2);
};

const updateUI = function (acc) {
  // Display balance
  displayMovements(acc.movements);
  // Display movements of funds
  calcDisplayBalance(acc);
  // Display total movement and interests
  calcDisplaySummary(acc);
};

const createUserNames = function (accts) {
  accts.forEach(acct => {
    acct.userName = acct.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUserNames(accounts);

// Event Handlers

let currAccount;

btnLogin.addEventListener('click', function (e) {
  // To prevent default nature of form, i.e. reloading everytime form is submitted.
  // Note: prevent default and all events are attached to button
  e.preventDefault();

  currAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  console.log(currAccount);

  if (currAccount?.pin === Number(inputLoginPin.value)) {
    // adding an optional chaining so it does not give an error and will check only if it exists otherwise if condition is not executed
    inputLoginPin.value = inputLoginUsername.value = ''; // Assignment operator works RTL

    // Lose focus from pin
    inputLoginPin.blur();
    // Welcome Message
    labelWelcome.innerText = `Welcome back ${currAccount.owner.split(' ')[0]}`;

    // To display balance data
    containerApp.style.opacity = 1;

    // To update the balance, movement and summary
    updateUI(currAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(receiverAcc, amount);

  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc.userName !== currAccount.userName &&
    currAccount.balance >= amount
  ) {
    console.log('inside if condition');
    // Emptying the input
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    inputTransferAmount.blur();

    // Making the movement
    currAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // To update the balance, movement and summary
    updateUI(currAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currAccount.movements.some(mov => mov >= amount * 0.1)) {
    currAccount.movements.push(amount);
    updateUI(currAccount);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currAccount.userName &&
    Number(inputClosePin.value) === currAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => currAccount.userName === acc.userName
    );

    // Delete account
    accounts.splice(index, 1);
    // Reset values
    inputClosePin.value = inputCloseUsername.value = '';

    // log out
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
// Coding Challenge-4:

// Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little. Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.

dogs.forEach(function (dog, i) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

console.log(dogs);

// 2.

const currentDiet = function (dog) {
  if (dog.curFood > 1.1 * dog.recommendedFood) {
    dog.currentDiet = 'Too much';
  } else if (dog.curFood < 0.9 * dog.recommendedFood) {
    dog.currentDiet = 'Too less';
  } else dog.currentDiet = 'Okay';
};

dogs.forEach(dog => {
  currentDiet(dog);
  dog.owners.includes('Sarah')
    ? console.log(`Sarah's dog eats: ${dog.currentDiet}`)
    : '';
});

// 3.

const ownersEatTooMuch = [];
const ownersEatTooLittle = [];

dogs.forEach(dog => {
  if (dog.currentDiet === 'Too much') ownersEatTooMuch.push(...dog.owners);
  else if (dog.currentDiet === 'Too less')
    ownersEatTooLittle.push(...dog.owners);
});

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4.

let strTooMuch = '';
let strTooLess = '';

ownersEatTooMuch.map((owner, i) =>
  i + 1 === ownersEatTooMuch.length
    ? (strTooMuch += owner)
    : (strTooMuch += `${owner} and `)
);
console.log(`${strTooMuch} have dogs who eat too much`);

ownersEatTooLittle.map((owner, i) =>
  i + 1 === ownersEatTooLittle.length
    ? (strTooLess += owner)
    : (strTooLess += `${owner} and `)
);
console.log(`${strTooLess} have dogs who eat too little`);

// 5.

dogs.forEach(dog => console.log(dog.recommendedFood === dog.curFood));

// 6.
const okay = [];
dogs.forEach(dog =>
  dog.currentDiet === 'Okay' ? okay.push(...dog.owners) : ''
);
console.log(okay);

// 7.
const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsCopy);

/*
// Some more exercise:

// 1.  Getting sum of all positive deposits
// const totalDeposits = accounts.map(acc => acc.movements).flat(); can also be written as 👇

const totalDeposits = accounts
  .flatMap(acc => acc.movements)
  .filter(value => value > 0)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDeposits);

// 2. Count no. of deposits above 1000:

const totalDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;

console.log(totalDeposits1000);

// 2.5 Another way

const totalDeposits1000Second = accounts
  .flatMap(acc => acc.movements)
  .filter(val => val >= 1000)
  .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);

console.log(totalDeposits1000Second);

// 3. Advance use-case of reduce method

// const sampleObject = accounts
// Can also use destructuring

const { deposit: deposits, withdrawal: withdrawals } = accounts // renaming deposit and withdrawal
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      curr > 0 ? (sums.deposit += curr) : (sums.withdrawal += curr);
      return sums;
    },
    { deposit: 0, withdrawal: 0 }
  );

console.log(deposits, withdrawals);

// 4. Convert to a tile case: this is a title case => This Is a Title Case.

const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'with', 'but', 'or', 'on', 'and', 'in'];

  const capitalize = str => str[0].toUpperCase() + str.slice(1); // to handle cases that do not capitalize first word

  const titleHeading = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  console.log(capitalize(titleHeading));
};

convertTitleCase('hi, how are you?');
convertTitleCase('this is a title case');
convertTitleCase('this is a LONG title but not too long');
convertTitleCase('and here is another title with an example');

/*
// Different ways of creating Array:

console.log([1, 2, 3, 4, 5, 6, 7, 8, 9]); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8, 9)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// For one argument, creates that much empty elements array. Also map function does not work in this aray
const x = new Array(7);
console.log(x); // [empty × 5]
// console.log(x.map(curr => 5)); // [empty × 5] --> no change
// console.log(x.fill(5)); // fill() can be used for filling values. // [5, 5, 5, 5, 5]
// console.log(x); // [5, 5, 5, 5, 5]
// console.log(x.map(curr => curr + 1)); // Now we can map this. Empty array is not avaialable for map function
// x.fill(1, 2);
// console.log(x); // Fills from index 2 to end
x.fill(1, 3, 5);
console.log(x); // Fills from index 3 to 4

// from method
const y = Array.from({ length: 7 }, () => 1);
const z = Array.from({ length: 7 }, (_, i) => i + 1); // underscore is used as throw-away variable as its value was never used
console.log(y);
console.log(z);

// An array with 100 random dice rolls

// const movementUI = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementUI);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    ele => Number(ele.textContent.replace('€', ''))
  );
  // Note: Here in length, document.querySelectorAll('.movements__value') was passed instead of object with length property. The goal is to pass either an iterable that has length property which all array like objects do or else define length as a property as in above example of const y, z

  // if map was not included in from
  // console.log(movementUI.map(ele => Number(ele.textContent.replace('€', ''))));
  console.log(movementUI);

  // Using spread operator to convert into an array
  const movementUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementUI2);
  // Now we just need to do mapping differently.
});

/*
// SORT:

const owners = ['Jagrut', 'Rahul', 'Sanjay', 'Vikram', 'Avinash'];
owners.sort(); // mutates original array
console.log(owners); // ['Avinash', 'Jagrut', 'Rahul', 'Sanjay', 'Vikram']
// console.log(movements.sort()); // [-130, -400, -650, 1300, 200, 3000, 450, 70]
console.log(movements);

// movements.sort((a, b) => {
//   if (a < b) return -1;
//   if (b < a) return 1;
// });

// all of this can also be done as follows:
movements.sort((a, b) => a - b);
console.log(movements);

// movements.sort((a, b) => {
//   if (a < b) return 1;
//   if (b < a) return -1;
// });

// all of this can also be done as follows:
movements.sort((a, b) => b - a);
console.log(movements);

/*
// flat and flatMap:

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat()); // [1, 2, 3, 4, 5, 6, 7, 8]
const arr2 = [[1, 2, [3, 4]], [5, 6], [7, [8, 9, 10]], 11];
console.log(arr2.flat()); //one level deep // [1, 2, [3, 4], 5, 6, 7, [8, 9, 10], 11]
console.log(arr2.flat(2)); //one level deep // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

const accountMovements = accounts.map(acc => acc.movements);
const allMovements = accountMovements.flat();
const totalMovement = allMovements.reduce((acc, curr) => acc + curr, 0);
console.log(totalMovement); // 17840

// by chaning methods:

const totalMovement2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, curr) => acc + curr, 0);
console.log(totalMovement2); // 17840

const totalMovement3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, curr) => acc + curr, 0);

console.log(totalMovement3); // 17840

// using map and then flat is pretty common therefore flatMap => maps then flats.
/*
// Some and Every:

//some

console.log(movements);
console.log(movements.includes(-130)); // true
console.log(movements.some(mov => mov === -130)); // same as includes in above

const anyDeposit = movements.some(mov => mov > 0);
console.log(anyDeposit); // true

// every

console.log(movements.every(mov => mov > 0)); // false
console.log(account4.movements.every(mov => mov > 0)); // true

// condition can be passed as callback as well.
const condition = mov => mov > 0;
console.log(movements.some(condition)); // true
console.log(movements.every(condition)); // false
console.log(movements.filter(condition)); // [200, 450, 3000, 70, 1300]

/*
// find

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// Same thing will be done in for of as shown below:
let accountFor = '';
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    accountFor = acc;
    break;
  }
}

console.log(accountFor);

/*

// Chaining methods
const conversionEurToUsd = 1.1;
console.log(movements);
const totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    console.log(arr); // While chaining, finding error can be difficult, so in that case we can use to console the array passed to determine the error
    return mov * conversionEurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositUSD);

/*
// Coding Challenge-3:

const calcAvgHumanAge = function (ages) {
  const avgAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0); // (2+3)/2 ===> 2/2 + 3/2
  console.log(avgAge);
};

calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);

/*
// Coding Challenge-2:

const calcAvgHumanAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(humanAge);

  const adultDogs = humanAge.filter(age => age >= 18);
  console.log(adultDogs);

  const totalAge = adultDogs.reduce((acc, age) => acc + age, 0);
  const avgAge = totalAge / adultDogs.length;
  console.log(avgAge);
};

calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);

/*
// REDUCE Method:

console.log(movements);
const balance = movements.reduce(function (acc, curr, i, arr) {
  // In reduce, accumulator is first then comes current element, index and then array
  // console.log(`Iteration-${i}: ${acc}`);
  return acc + curr;
}, 100); // Given a initial value of 100
console.log(balance);

const balance1 = movements.reduce((acc, curr) => acc + curr, 0);
console.log(balance1);

const maxEntry = movements.reduce((acc, mov) => (acc < mov ? mov : acc), movements[0]); // Always use first element as initial value for acc in max/min because first value can be negative.
console.log(maxEntry);
/*
// Filter Method:

const deposits = movements.filter(mov => mov > 0);
console.log(deposits);

const withdrawal = movements.filter(mov => mov < 0);
console.log(withdrawal);

// Filter already has value of element, what the callback function needs is whether the condition is saisfied or not i.e. (true or false for condition)?
// If condition is satisfied, i.e. true ==> It takes value of mov and then pushes it. If false, it does not pushes it.
// The .filter callback (the arrow) function does not return the actual values to to push to the new array, it just tells .filter whether a line should be moved. And so it returns true or false, and then if true .filter will read and move the actual element.

/*
// Map Method

const conversionEurToUsd = 1.1;

const movementsUsd = movements.map(mov => mov * conversionEurToUsd);
console.log(movements);
console.log(movementsUsd);

const movementsUsdFor = [];

for (const mov of movements) movementsUsdFor.push(mov * conversionEurToUsd);
console.log(movements);
console.log(movementsUsdFor);

const movDescriptions = movements.map(
  (mov, i) =>
    `mov ${i}: You ${mov > 0 ? 'deposit' : 'withdrew'} ${Math.abs(mov)}`
);

console.log(movDescriptions);

/////////////////////////////////////////////////

/*
// CODING CHALLENGE-1

const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const checkDogs = function (juliaDogs, kateDogs) {
  const actualJuliaDogs = juliaDogs.slice(1, -2);
  const totalDogsData = [...actualJuliaDogs, ...kateDogs];
  totalDogsData.forEach((age, index) => {
    const dogsAge =
      age <= 3
        ? `Dog number ${index + 1} is still a pup`
        : `Dog number ${index + 1} is an adult, and is ${age} years old`;

    console.log(dogsAge);

    // if (age <= 3) console.log(`Dog number ${index + 1} is still a pup`);
    // else
    //   console.log(
    //     `Dog number ${index + 1} is an adult, and is ${age} years old`
    //   );
  });
};

checkDogs(dogsJulia, dogsKate);

/*
// forEach

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [index, movement] of movements.entries()) {
  if (movement > 0)
    console.log(`Movement ${index}: You deposited ${Math.abs(movement)}`);
  else console.log(`Movement ${index}: You withdrew ${Math.abs(movement)}`);
}

console.log(`---------------FOR EACH------------------`);

movements.forEach(function (movement, i, arr) {
  if (movement > 0)
    console.log(`Movement ${i}: You deposited ${Math.abs(movement)}`);
  else console.log(`Movement ${i}: You withdrew ${Math.abs(movement)}`);
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
  // USD: United States dollar
  // EUR: Euro
  // GBP: Pound sterling
  // console.log(map); // {'USD' => 'United States dollar', 'EUR' => 'Euro', 'GBP' => 'Pound sterling'}
});

const currencyUnique = new Set([
  'USD',
  'EUR',
  'USD',
  'GBP',
  'INR',
  'INR',
  'GBP',
  'EUR',
  'EUR',
  'INR',
  'USD',
  'INR',
]);
console.log(currencyUnique);
currencyUnique.forEach(function (value, key, set) {
  console.log(`${value}: ${key}`); // both value and key are same as order is irrelevant in sets
  // USD: USD
  // EUR: EUR
  // GBP: GBP
  // INR: INR
  // console.log(set); // {'USD', 'EUR', 'GBP', 'INR'}
});

/*
// AT method

const arr = [12, 21, 13, 31];

console.log(arr[0]); // 12
console.log(arr.at(0)); // 12

console.log(arr[arr.length - 1]); // 31
console.log(arr.slice(-1)[0]); // 31
console.log(arr.at(-1)); // 31 Does same work.

/*
// SLICE

let arr = ['a', 'b', 'c', 'd', 'e'];
arr.slice(1);
console.log(arr); // does not mutate original
console.log(arr.slice(2)); // ['c', 'd', 'e']
console.log(arr.slice(2, 4)); // Last one not included  ['c', 'd']
console.log(arr.slice(-1)); // ['e']
console.log(arr.slice(1, -1)); // ['b', 'c', 'd']
console.log(arr.slice()); // shallow copy --> Can be used when chain of methods are to be used
console.log([...arr]); // also creates a shallow copy

// SPLICE

// console.log(arr.splice(2)); // return spliced array --> ['c', 'd', 'e']
// console.log(arr); // arr is mutated --> ['a', 'b']
arr.splice(-1); // ['e']
console.log(arr); // ['a', 'b', 'c', 'd']
console.log(arr.splice(1, 3)); // ['b', 'c', 'd']
console.log(arr); // ['a']

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.reverse()); // ['e', 'd', 'c', 'b', 'a']
console.log(arr); // ['e', 'd', 'c', 'b', 'a']

// CONCAT
arr.reverse();
let arr2 = ['f', 'g', 'h', 'i', 'j'];
const letter = arr.concat(arr2);
console.log(letter); // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
console.log([...arr, ...arr2]); //  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

// JOIN
console.log(letter.join(' / ')); // even the space is included
// a / b / c / d / e / f / g / h / i / j
*/
