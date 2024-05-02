// Sample data (replace with actual API response)
//obtener coockie
function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for(var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

const filesData = [
    
];


// Function to generate HTML for each file/folder item
function generateFileHTML(file) {
    if (file.type === 'folder') {
        return `
            <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2">
                <div class="file-man-box">
                    <div class="dropdown file-close dropdown">
                        <button data-mdb-button-init data-mdb-ripple-init data-mdb-dropdown-init class="btn btn-secondary dropdown-toggle hidden-arrow dropdown-menu-dark" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="">•••</i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" data-bs-theme="dark">
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalEditar">Editar</a></li>
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalCompartir">Compartir</a></li>
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalMover">Mover</a></li>
                            <li><a class="dropdown-item bg-danger" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete">Delete</a></li>
                        </ul>
                    </div>
                    <div class="file-img-box"><img src="${file.icon}" alt="icon"></div>
                    <a href="#" class="file-download"></a>
                    <div class="file-man-title">
                        <a href="#"><h5 class="mb-2text-overflow">${file.name}</h5></a>
                    </div>
                </div>
            </div>
        `;
    } else if (file.type === 'file') {
        return `
            <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2">
                <div class="file-man-box">
                    <div class="dropdown file-close dropdown">
                        <button data-mdb-button-init data-mdb-ripple-init data-mdb-dropdown-init class="btn btn-secondary dropdown-toggle hidden-arrow dropdown-menu-dark" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="">•••</i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" data-bs-theme="dark">
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalEditar">Editar</a></li>
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalCompartir">Compartir</a></li>
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalMover">Mover</a></li>
                            <li><a class="dropdown-item bg-danger" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete">Delete</a></li>
                        </ul>
                    </div>
                    <div class="file-img-box"><img src="${file.icon}" alt="icon"></div>
                    <a href="#" class="file-download"><i class="fa fa-download"></i></a>
                    <div class="file-man-title">
                        <h5 class="mb-2 text-overflow">${file.name}</h5>
                    </div>
                </div>
            </div>
        `;
    }
}


// Function to generate HTML for all files/folders
function generateFilesHTML(files) {
    var tokenValue = getCookie("token");

    fetch('http://127.0.0.1:8000/api/carpetas/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${tokenValue}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hubo un problema con la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            
            data.data.forEach( e => {
                filesData.push(e);
                console.log(e)
            });

            const filesHTML = filesData.map(file => generateFileHTML(file)).join('');
            const filesContainer = document.getElementById('files-container');
            filesContainer.innerHTML = filesHTML;
            
    })
    .catch(error => {
        console.error('Error:', error);
    });

    return files.map(file => generateFileHTML(file)).join('');
}

generateFilesHTML(filesData);

// Function to handle modal form submission
function handleModalTextSubmit(modalId) {
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Get the input value
        const input = form.querySelector('input[type="text"]');
        const inputValue = input.value;
        
        // Show the input value in the console
        console.log('Input value:', inputValue);

        // Close the modal
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
}

// Handle modal form submission for each modal
handleModalTextSubmit('modalEditar');
handleModalTextSubmit('modalCarpeta');

// Function to handle modal form submission
function handleModalOptionSubmit(modalId) {
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Get the input value
        const select = form.querySelector('select');
        const inputValue = select.value;
        
        // Show the input value in the console
        console.log('Input value:', inputValue);

        // Close the modal
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
}

// Handle modal form submission for each modal
handleModalOptionSubmit('modalCompartir');
handleModalOptionSubmit('modalMover');

// Function to handle file input change
function handleFileInput(modalId) {
    const modal = document.getElementById(modalId);
    const fileInput = modal.querySelector('input[type="file"]');

    if (!fileInput) {
        console.error('File input not found in modal:', modalId);
        return;
    }

    fileInput.addEventListener('change', function(event) {
        // Do nothing here
    });
    
    // Add event listener for form submit
    const form = fileInput.closest('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Print "Hello" when the file is submitted
        console.log('Hello');
    });
}

handleFileInput('modalArchivo');
