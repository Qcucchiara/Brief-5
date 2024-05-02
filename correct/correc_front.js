let category = document.querySelector('.category');
let box = document.querySelector('.box');
let client = document.querySelector('.client');

async function fetchDatas() {
  client.innerHTML = '';
  let clients = await fetch('http://localhost:3111/user/all');
  let clientsList = await clients.json();

  if (clientsList.result) {
    clientsList.result.forEach((element) => {
      client.innerHTML += `<option value=${element.id_client}>${element.name_client}</option>`;
    });
  }

  let categories = await fetch('http://localhost:3111/category/all');
  let categoriesList = await categories.json();

  if (categoriesList.result) {
    categoriesList.result.forEach((element) => {
      category.innerHTML += `<option value=${element.id_category}>${element.name_category}</option>`;
    });
  }

  let boxs = await fetch('http://localhost:3111/box/all');
  let boxesList = await boxs.json();

  if (boxesList.result) {
    boxesList.result.forEach((element) => {
      box.innerHTML += `<option value=${element.id_box}>${element.name_box}</option>`;
    });
  }
}

// let boxs = await fetch('http://localhost:3111/box/all')
// let categories = await fetch('http://localhost:3111/categories/all')

fetchDatas();
