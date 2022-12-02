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

const displayMovements = function (movements) {
  containerMovements.innerText = '';
  movements.forEach((mov, index) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

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
