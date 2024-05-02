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

async function insertAnimal() {
  let image = document.querySelector('.image');
  let name = document.querySelector('.name');

  let arrival = document.querySelector('.arrival');
  let departure = document.querySelector('.departure');

  const formData = new FormData();
  formData.append('name', name);
  formData.append('arrival', arrival);
  formData.append('departure', departure);
  formData.append('category', category.value);
  formData.append('client', client.value);
  formData.append('box', box.value);
  formData.append('image', image.files[0]);

  // JavaScript file-like object
  const content = '<q id="a"><span id="b">hey!</span></q>';
  const blob = new Blob([content], { type: 'text/xml' });
  formData.append('webmasterfile', blob);

  const response = await fetch('http://localhost:3111/animal/insert', {
    method: 'POST',
    body: formData,
  });
  console.log(await response.json());
}
