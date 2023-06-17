const form = document.getElementById('form');
const contraseña = document.getElementById('contraseña');
const email = document.getElementById('email');


form.addEventListener('submit', e => {
	e.preventDefault();
	
	checkInputs();
});

function checkInputs() {
	let username = $('#email').val();
    let password = $('#contraseña').val();
	
	if(username == '' && password == '') {
		setErrorFor(email, 'Complete este campo');
		setErrorFor(contraseña, 'Complete este campo');
	}else{
		if(username == '') {
			setErrorFor(email, 'Complete este campo');
		} else if (!isEmail(username)) {
			setErrorFor(email, 'Ingrese un mail valido');
		} else {
			setSuccessFor(email);
		}
		if(password == '') {
			setErrorFor(contraseña, 'Complete este campo');
		} else {
			setSuccessFor(contraseña);
		}
        let url = "roberto.json";
        $.getJSON( url , function( data ) {
            console.log(data);
            sha256(password).then( function(respuestaHash){
                checkUser(data, username, respuestaHash);
               
            }); 
                
        }) 
        .fail(function() {
            alert( "error página en mantenimiento " );
        })
    }
}

function checkUser(data, username, password){
        var user = false;
        $.each( data.users, function( key, val ) {
      
            val = JSON.stringify(val);
            val = JSON.parse(val);
    
            if (username === val.user){
                user = true;
               
                if (password == val.password){
                    console.log( "contraseña Correcta");
                    $('#userId').val(val.idUser);
                    $('#login_form').submit();
                    return false;
                }else{
					setErrorFor(contraseña, 'Contraseña Incorrecta');
                    return false;
                }
            }
        })
        
        if (user == false){
			alert("Usuario no registrado");
            console.log("Usuario no registrado");
        }
       
   
}

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);
  
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
  
    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    //console.log(hashHex);
    return hashHex;
} 

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}

function isEmail(email) {
	return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
}
