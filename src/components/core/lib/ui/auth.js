"use strict";

export function UIauthInit() {
	DOM.logout.onclick = UIauthLogout;
	DOM.userlink.onclick = UIauthLogin;
}

export function UIauthLoading( b ) {
	DOM.userlink.classList.toggle( "loading", b );
}

export function UIauthLogout() {
	UIauthLoading( true );
	gsapiClient.logout()
		.finally( () => UIauthLoading( false ) )
		.then( UIauthLogoutThen );
}

export function UIauthGetMe() {
	UIauthLoading( true );
	return gsapiClient.getMe()
		.finally( () => UIauthLoading( false ) )
		.then(
			UIauthLoginThen,
			res => {
				if ( res.code !== 401 ) {
					throw( res );
				}
			}
		);
}


const gsapiClient = {
	url: "https://api.gridsound.com/",
	headers: Object.freeze( {
		"Content-Type": "application/json; charset=utf-8",
	} ),

	user: {},
	compositions: [],

	getMe() {
		return this._fetch( "GET", "getMe" )
			.then( res => this._assignMe( res ) );
	},
	login( email, pass ) {
		return this._fetch( "POST", "login", { email, pass } )
			.then( res => this._assignMe( res ) );
	},
	signup( username, email, pass ) {
		return this._fetch( "POST", "createUser", { username, email, pass } )
			.then( res => this._assignMe( res ) );
	},
	resendConfirmationEmail() {
		return this._fetch( "POST", "resendConfirmationEmail", { email: this.user.email } );
	},
	getUser( username ) {
		return this._fetch( "GET", `getUser?username=${ username }` )
			.then( ( { data } ) => {
				data.user.usernameLow = data.user.username.toLowerCase();
				return data;
			} );
	},
	logout() {
		return this._fetch( "POST", "logout", { confirm: true } )
			.then( res => this._deleteMe( res ) );
	},
	logoutRefresh() {
		return this.logout()
			.then( () => {
				setTimeout( () => location.href =
					location.origin + location.pathname, 500 );
			} );
	},
	updateMyInfo( obj ) {
		return this._fetch( "POST", "updateMyInfo", obj )
			.then( res => this._assignMe( res ) );
	},
	saveComposition( cmp ) {
		return this._fetch( "POST", "saveComposition",
			{ composition: JSON.stringify( cmp ) } );
	},
	deleteComposition( id ) {
		return this._fetch( "POST", "deleteComposition", { id } );
	},

	// private:
	_assignMe( { data } ) {
		const { user, compositions } = data;

		if ( compositions ) {
			Object.assign( this.compositions, compositions );
		}
		if ( user ) {
			user.usernameLow = user.username.toLowerCase();
			user.emailpublic = user.emailpublic === "1";
			user.emailchecked = user.emailchecked === "1";
			Object.assign( this.user, user );
		}
		return data;
	},
	_deleteMe( res ) {
		Object.keys( this.user ).forEach( k => delete this.user[ k ] );
		return res;
	},
	_fetch( method, url, body ) {
		const obj = {
			method,
			headers: this.headers,
			credentials: "include",
		};

		if ( body ) {
			obj.body = JSON.stringify( body );
		}
		return fetch( this.url + url, obj )
			.then( res => res.json() )
			.then( res => this._fetchThen( res ) );
	},
	_fetchThen( res ) {
		if ( !res.ok ) {
			res.msg = this.errorCode[ res.msg ] || res.msg;
			throw( res );
		}
		return res;
	},

	errorCode: {
		"login:fail": "The email/password don't match",
		"pass:too-short": "The password is too short",
		"email:too-long": "The email is too long",
		"email:duplicate": "This email is already used",
		"email:bad-format": "The email is not correct",
		"username:too-long": "The username is too long",
		"username:too-short": "The username is too short",
		"username:duplicate": "This username is already taken",
		"username:bad-format": "The username can only contains letters, digits and _",
	},
};

export function UIauthLogin() {
	if ( !gsapiClient.user.id ) {
		gsuiPopup.custom( {
			ok: "Sign in",
			title: "Authentication",
			submit: UIauthLoginSubmit,
			element: DOM.authPopupContent,
		} ).then( () => {
			DOM.authPopupContent.querySelectorAll( "input" )
				.forEach( inp => inp.value = "" );
		} );
		return false;
	}
}

export function UIauthLoginSubmit( obj ) {
	UIauthLoading( true );
	DOM.authPopupError.textContent = "";
	return gsapiClient.login( obj.email, obj.password )
		.finally( () => UIauthLoading( false ) )
		.then(
			UIauthLoginThen,
			res => {
				DOM.authPopupError.textContent = res.msg;
				throw( res );
			} );
}

export function UIauthLoginThen( me ) {
	const opt = { localSaving: false };

	DOM.app.classList.add( "logged" );
	DOM.userlink.href = `https://gridsound.github.io/#/u/${ me.user.username }`;
	DOM.userlink.style.backgroundImage = `url("${ me.user.avatar }")`;
	me.compositions.forEach( cmp => DAW.addCompositionByJSON( cmp.data, opt ) );
	return me;
}

export function UIauthLogoutThen() {
	DOM.app.classList.remove( "logged" );
	DOM.userlink.removeAttribute( "href" );
	DOM.userlink.style.backgroundImage = "";
	Array.from( DOM.cloudCmps.children )
		.forEach( el => DAW.deleteComposition( el.dataset.id ) );
	if ( !DAW.get.id() ) {
		UIcompositionClickNewLocal();
	}
}

export function UIauthSaveComposition( cmp ) {
	return gsapiClient.saveComposition( cmp )
		.catch( err => {
			gsuiPopup.alert( `Error ${ err.code }`,
				"An error happened while saving " +
				"your composition&nbsp;:<br/>" +
				`<code>${ err.msg || err }</code>`
			);
		} );
}
