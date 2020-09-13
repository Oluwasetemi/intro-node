// Confirmation for Update Button
function getUpdate() {
  const con = confirm('Did you want to update?');
  if (con) {
    return true;
  } else {
    event.preventDefault();
  }
}
// Confirmation for Delete Button
function deleteProduct() {
  const con = confirm('Did you want to delete this product');
  if (con) {
    return true;
  } else {
    event.preventDefault();
  }
}

// JavaScript for client pagination
window.onload = function() {
  const page2 = document.getElementById('page').textContent;
  const nextPage = document.getElementById('pages').textContent;

  if (page2 <= 1) {
    document.getElementById('previous').removeAttribute('href');
    // document.getElementById('previous').style.textDecoration = 'none';
  }

  if (page2 >= nextPage) {
    document.getElementById('next').removeAttribute('href');
    // document.getElementById('next').style.textDecoration = 'none';
  }
};

// JavaScript for enable of Input field for editing
function editUpdate() {
  document.getElementById('getUpdated').style.display = 'block';
  document.getElementById('productName').disabled = false;
  document.getElementById('location').disabled = false;
  document.getElementById('categories').disabled = false;
  document.getElementById('price').disabled = false;
  document.getElementById('discount').disabled = false;
  document.getElementById('description').disabled = false;
  document.getElementById('image').disabled = false;
}

// Confirmation for Delete User
function deleteUser() {
    const con = confirm('Did you want to delete this User');
    if (con) {
        return true;
    } else {
        event.preventDefault();
    }
}

function editUser() {
  document.getElementById('getUpdated').style.display = 'block';
  document.getElementById('firstName').disabled = false;
  document.getElementById('lastName').disabled = false;
  document.getElementById('phone').disabled = false;
  document.getElementById('image').disabled = false;
}
