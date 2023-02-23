let API = "http://localhost:8000/contactbook";

let name = document.querySelector("#inp-name");
let surname = document.querySelector("#inp-surname");
let post = document.querySelector("#inp-post");
let num = document.querySelector("#inp-num");
let photo = document.querySelector("#inp-url");
let btnAdd = document.querySelector("#btn-add");
let list = document.querySelector("#contact-list");

btnAdd.addEventListener("click", async () => {
  let obj = {
    name: name.value,
    surname: surname.value,
    post: post.value,
    num: num.value,
    photo: photo.value,
  };
  if (
    !obj.name.trim() ||
    !obj.surname.trim() ||
    !obj.photo.trim() ||
    !obj.post.trim() ||
    !obj.num.trim()
  ) {
    alert("заполните поля!");
    return;
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  surname.value = "";
  post.value = "";
  num.value = "";
  photo.value = "";
  getContact();
});

async function getContact() {
  try {
    let res = await fetch(API);
    let contact = await res.json();
    render(contact);
  } catch (error) {
    console.log(error);
  }
}

function render(contact) {
  list.innerHTML = "";
  contact.forEach((item) => {
    list.innerHTML += `<div class="block"><li class="mt-5">
    <img class="w-1 img" src=${item.photo}>
    <div class="block-content"><h4>${item.name}</h4> 
    <h4>${item.surname}</h4> 
    <p>${item.post}</p> 
    <p>${item.num}</p> </div>
    
    <div class="block-buttons">
    <button onclick="editContact(${item.id})" class="btn btn-dark"data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
    <button onclick="deleteContact(${item.id})" class="btn btn-dark">Delete</button>
    </div>
    </li>
    </div>`;
  });
}

getContact();

async function deleteContact(id) {
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
  } catch (error) {
    console.log(error);
  }
  getContact();
}

let editName = document.querySelector("#edit-name");
let editSurname = document.querySelector("#edit-surname");
let editEmail = document.querySelector("#edit-email");
let editNumber = document.querySelector("#edit-number");
let editPhoto = document.querySelector("#edit-photo");
let saveBtn = document.querySelector("#save-btn");
let editModal = document.querySelector("#exampleModal");

let editedObj = {};

function inpEdits() {
  editedObj = {
    name: editName.value,
    surname: editSurname.value,
    post: editEmail.value,
    num: editNumber.value,
    photo: editPhoto.value,
  };
}
inpEdits();

async function editContact(id) {
  try {
    let res = await fetch(`${API}/${id}`);
    let objToEdit = await res.json();
    editName.value = objToEdit.name;
    editSurname.value = objToEdit.surname;
    editEmail.value = objToEdit.post;
    editNumber.value = objToEdit.num;
    editPhoto.value = objToEdit.photo;

    saveBtn.setAttribute("id", `${id}`);
  } catch (error) {
    console.log(error);
  }
}
saveBtn.addEventListener("click", async (e) => {
  let id = e.target.id;
  inpEdits();

  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedObj),
    });
  } catch (error) {
    console.error(error);
  }
  getContact();
  let modal = bootstrap.Modal.getInstance(editModal);
  modal.hide();
});
