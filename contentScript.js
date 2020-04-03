console.log("github plugin started");
xlfiles = [];

files = document.getElementsByClassName('file-header');

branch = 'master'
console.log(document.getElementsByClassName('head-ref'));
if (document.getElementsByClassName('head-ref')[0]) {
  branch = document.getElementsByClassName('head-ref')[0].textContent;
}

for (let i = 0; i < files.length; i++) {
  console.log(files[i].dataset.path)

  path = files[i].dataset.path
  console.log(typeof(path))

  if (files[i].dataset.path.endsWith(".xlsx")) {
    xlfiles.push(files[i].dataset.path);
  }
}

console.log(xlfiles);
chrome.storage.sync.get(['username', 'password'], function (account) {
  xlfiles.forEach((file) => {
    getFileDataFromGithub(file, branch, account.username, account.password).then((response) => {
        response.json().then((body) => {
            console.log(body);
            content = body.content

            xl = XLSX.read(content, {"type": "base64"})
            sheet = xl.Sheets[xl.SheetNames[0]]
            html = XLSX.utils.sheet_to_html(sheet)

            target = document.querySelector("[data-path='" + file + "']").parentElement.children[1];
            target.style.overflow = 'scroll';
            target.innerHTML = html
        });
    });
  });
});

//https://api.github.com/repos/appfolio/apm_bundle/apps/property/engines/hoa/test/data/mfr/invalid_cat_policy.xlsx?ref=budAddPetPolicyAndLeaseDates
function getFileDataFromGithub(file, branch, username, password) {
    let url = "https://api.github.com/repos/appfolio/apm_bundle/contents/" + file + "?ref=" + branch
    return fetch(url, {
        headers: new Headers({
            'Authorization': 'Basic '+btoa(username + ':' + password),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/vnd.github.v3+json'
        })

    })
}
