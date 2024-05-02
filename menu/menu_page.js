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
var tokenValue = getCookie("token");

var filesData = [
    
];

var folderId = 0;
var FileIdTemp = 0;
//#region Function to generate HTML for each file/folder item
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
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalEditar" onclick="handleFolderClick(${file.id})">Editar</a></li>
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalCompartir">Compartir</a></li>
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalMover">Mover</a></li>
                            <li><a class="dropdown-item bg-danger" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete" onclick="handleFolderClick(${file.id})">Delete</a></li>
                        </ul>
                    </div>
                    <div class="file-img-box"><img src="https://th.bing.com/th/id/R.e43105275f60093be5532690e1fef430?rik=KIi5yjZmINd03g&pid=ImgRaw&r=0" alt="icon"></div>
                    <a href="#" class="file-download"></a>
                    <div class="file-man-title">
                        <a href="" style="display: none;" class="fileFolderId">${ file.id }</a>
                        <a href="#" onclick="changeFolderId(${file.id})"><h5 class="mb-2text-overflow">${file.folderName}</h5></a>
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
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalEditarArchivo" onclick="handleFileClick(${file.id})">Editar</a></li>
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalCompartir">Compartir</a></li>
                            <li><a class="dropdown-item" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalMover">Mover</a></li>
                            <li><a class="dropdown-item bg-danger" href="#" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete">Delete</a></li>
                        </ul>
                    </div>
                    <div class="file-img-box"><img src="https://th.bing.com/th/id/R.54eb6ec9a704d6b00def42331813f4ac?rik=mstC0zf4B5MGPQ&pid=ImgRaw&r=0" alt="icon"></div>
                    <a href="#" class="file-download"><i class="fa fa-download"></i></a>
                    <div class="file-man-title">
                        <a href="" style="display: none;" class="fileFolderId">${ file.id }</a>
                        <h5 class="mb-2 text-overflow">${file.fileName}</h5>
                    </div>
                </div>
            </div>
        `;
    }
}

// Function to generate HTML for all files/folders
function generateFilesHTML(files) {
    const currentPageUrl = window.location.href;
    console.log(currentPageUrl)
    fetch(`http://127.0.0.1:8000/api/carpetas/${folderId}`, {
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

function changeFolderId(fileId){
    folderId = fileId;
    filesData = [];
    generateFilesHTML(filesData);
}
//#endregion

//#region Function to handle modal form submission
var CarpetaTemp = 0;

function handleFolderClick(folderId) {
    console.log('ID de la carpeta:', folderId);
    CarpetaTemp = folderId;
}

function handleFileClick(fileIdTemp) {
    console.log('ID de la carpeta:', folderId);
    FileIdTemp = fileIdTemp;
}

function handleModalTextSubmitEDITAR(modalId) {
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Get the input value
        const input = form.querySelector('input[type="text"]');
        const folderName = input.value;

        var data = {
            folderName: folderName,
            folderParent: folderId,
            folderId: CarpetaTemp
        };
    
        var requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${tokenValue}`
            },
            body: JSON.stringify(data)
        };
    
        fetch('http://127.0.0.1:8000/api/carpetas/', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema con la solicitud.');
                }
                return response.json();
            })
            .then(data => {  
                console.log(data)
                window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Close the modal
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
}

function handleModalTextSubmitCREAR(modalId) {
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Get the input value
        const input = form.querySelector('input[type="text"]');
        const folderName = input.value;

        var data = {
            folderName: folderName,
            folderParent: folderId,
        };
    
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${tokenValue}`
            },
            body: JSON.stringify(data)
        };
    
        fetch('http://127.0.0.1:8000/api/carpetas/', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema con la solicitud.');
                }
                return response.json();
            })
            .then(data => {  
                console.log(data)
                window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Close the modal
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
}

// Handle modal form submission for each modal
handleModalTextSubmitEDITAR('modalEditar');
handleModalTextSubmitCREAR('modalCarpeta');

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

    listFile=[]

    fileInput.addEventListener('change', function(event) {
        const selectedFile = fileInput.files[0];
        listFile.push(selectedFile)
        console.log('Archivo seleccionado:', selectedFile);
    });
    
    // Add event listener for form submit
    const form = fileInput.closest('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData();
        const fileInput = document.getElementById('formFile');
        formData.append('folder_id', folderId);
        for (const file of fileInput.files) {
            formData.append('files', file);
        }
        console.log(formData)
    
        var requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `${tokenValue}`
            },
            body: formData
        };
    
        fetch('http://127.0.0.1:8000/api/archivos/', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema con la solicitud.');
                }
                return response.json();
            })
            .then(data => {  
                console.log(data)
                window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });

        console.log('Hello');
    });
}

function handleModalTextSubmitEDITARARCHIVO(modalId) {
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Get the input value
        const input = form.querySelector('input[type="text"]');
        const fileName = input.value;

        var data = {
            fileName: fileName,
            folderParent: folderId,
            fileId: FileIdTemp
        };
        console.log(data)
        var requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${tokenValue}`
            },
            body: JSON.stringify(data)
        };
    
        fetch('http://127.0.0.1:8000/api/archivos2/', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema con la solicitud.');
                }
                return response.json();
            })
            .then(data => {  
                console.log(data)
                window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Close the modal
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
}

handleModalTextSubmitEDITARARCHIVO('modalEditarArchivo')

handleFileInput('modalArchivo');
//#endregion

function handleModalDelete(modalId) {
    const modal = document.getElementById(modalId);
    const deleteButton = modal.querySelector('.btn-danger');

    deleteButton.addEventListener('click', function(event) {
        // Prevent the default button action
        event.preventDefault();

        // Print "hello" to the console
        console.log("hello");
        var requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${tokenValue}`
            }
        };
        
        fetch(`http://127.0.0.1:8000/api/carpetas/${CarpetaTemp}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema con la solicitud.');
                }
                return response.json();
            })
            .then(data => {  
                console.log(data)
                window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });

        
        // Close the modal
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
}

// Handle delete action for the specified modal
handleModalDelete('modalDelete');
