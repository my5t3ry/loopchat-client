"use strict";

export class UIauthInitController {

    UIauthInit() {
        DOM.logout.onclick = this.UIauthLogout;
        DOM.userlink.onclick = this.UIauthLogin;
    }

    UIauthLoading(b) {
        DOM.userlink.export.classList.toggle("loading", b);
    }

    UIauthLogout() {
        UIauthLoading(true);
        gsapiClient.logout()
            .finally(() => UIauthLoading(false))
            .then(UIauthLogoutThen);
    }

    UIauthGetMe() {
        UIauthInitController.UIauthLoading(true);
        return gsapiClient.getMe()
            .finally(() => UIauthInitController.UIauthLoading(false))
            .then(
                UIauthLoginThen,
                res => {
                    if (res.code !== 401) {
                        throw(res);
                    }
                }
            );
    }

    UIauthLogin() {
        if (!gsapiClient.user.id) {
            gsuiPopup.custom({
                ok: "Sign in",
                title: "Authentication",
                submit: UIauthInitController.UIauthLoginSubmit,
                element: DOM.authPopupContent,
            }).then(() => {
                DOM.authPopupContent.querySelectorAll("input")
                    .forEach(inp => inp.value = "");
            });
            return false;
        }
    }

    UIauthLoginSubmit(obj) {
        UIauthInitController.UIauthLoading(true);
        DOM.authPopupError.textContent = "";
        return gsapiClient.login(obj.email, obj.password)
            .finally(() => UIauthInitController.UIauthLoading(false))
            .then(
                UIauthInitController.UIauthLoginThen,
                res => {
                    DOM.authPopupError.textContent = res.msg;
                    throw(res);
                });
    }

    UIauthLoginThen(me) {
        const opt = {localSaving: false};

        DOM.app.export.classList.add("logged");
        DOM.userlink.href = `https://gridsound.github.io/#/u/${me.user.username}`;
        DOM.userlink.style.backgroundImage = `url("${me.user.avatar}")`;
        me.compositions.forEach(cmp => DAW.addCompositionByJSON(cmp.data, opt));
        return me;
    }

    UIauthLogoutThen() {
        DOM.app.export.classList.remove("logged");
        DOM.userlink.removeAttribute("href");
        DOM.userlink.style.backgroundImage = "";
        Array.from(DOM.cloudCmps.children)
            .forEach(el => DAW.deleteComposition(el.dataset.id));
        if (!DAW.get.id()) {
            UIauthInitController.UIcompositionClickNewLocal();
        }
    }

    UIauthSaveComposition(cmp) {
        return gsapiClient.saveComposition(cmp)
            .catch(err => {
                gsuiPopup.alert(`Error ${err.code}`,
                    "An error happened while saving " +
                    "your composition&nbsp;:<br/>" +
                    `<code>${err.msg || err}</code>`
                );
            });
    }

}