let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    page.appendChild(button);
  }
}

let saveButton = document.getElementById('save')
saveButton.addEventListener('click', function() {
  let username = document.getElementById('username').value
  let password = document.getElementById('password').value

  chrome.storage.sync.set({username: username, password: password}, function() {
    console.log('password saved');
  });
});

constructOptions(kButtonColors);
