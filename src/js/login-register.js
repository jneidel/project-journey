/* global encryptWithPubKey checkResponse */
/* eslint-disable no-empty */

const axios = require( "axios" );

async function getFormData( form ) {
  /* return data from form with encrypted passwords
   *
   * formData = { 
   *  username, 
   *  password,
   *  passwordConfirm
   * }
   */

  const data = {
    username: form.username,
    async encrypt( password, isConfirmPass = false ) {
      password = await encryptWithPubKey( password );

      if ( isConfirmPass ) {
        this.passwordConfirm = password;
      } else {
        this.password = password;
      }
    },
  };

  await data.encrypt( form.password );

  if ( form.passwordConfirm ) {
    await data.encrypt( form.passwordConfirm, true );
  }

  return data;
}

const send = {
  async login() {
    const formData = await getFormData( {
      username: document.getElementsByName( "username" )[0].value,
      password: document.getElementsByName( "password" )[0].value,
    } );

    const response = await axios.post( "api/login", {
      username: formData.username,
      password: formData.password,
    } );
    checkResponse( response.data, "login", "app" );
  },
  async register() {
    const formData = await getFormData( {
      username       : document.getElementsByName( "username" )[0].value,
      password       : document.getElementsByName( "password" )[0].value,
      passwordConfirm: document.getElementsByName( "password_confirm" )[0].value,
    } );

    const response = await axios.post( "api/register", {
      username       : formData.username,
      password       : formData.password,
      passwordConfirm: formData.passwordConfirm,
    } );
    checkResponse( response.data, "register", "app" );
  },
};

function setupListeners( func ) {
  try { // check that /login or /register
    var site = document.getElementsByName( "password_confirm" )[0] ? "register" : "login";
  } catch ( err ) {
    return null;
  }

  if ( site === "login" ) {
    document.getElementById( "login" ).addEventListener( "click", send.login );
    document.getElementsByName( "password" )[0].addEventListener( "keydown", ( event ) => {
      if ( event.which === 13 ) { send.login(); }
    } );
  } else {
    document.getElementById( "register" ).addEventListener( "click", send.register );
    document.getElementsByName( "password_confirm" )[0].addEventListener( "keydown", ( event ) => {
      if ( event.which === 13 ) { send.register(); }
    } );
  }
}
setupListeners();
