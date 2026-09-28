/* =========================================
   PASSWORD PROTECTION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const passwordScreen =
        document.getElementById("password-screen");

    const passwordForm =
        document.getElementById("password-form");

    const passwordInput =
        document.getElementById("password-input");

    const passwordError =
        document.getElementById("password-error");

    const correctPassword = "sunflower";


    /* Make sure password elements exist */
    if (!passwordScreen || !passwordForm || !passwordInput) {
        return;
    }


    /* LOCK BACKGROUND PAGE */
    document.body.classList.add("password-locked");
    document.documentElement.classList.add("password-locked");


    /* =========================================
       PASSWORD FORM
       Works with ENTER key
    ========================================= */

    passwordForm.addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();


        const enteredPassword =
            passwordInput.value.trim();


        /* =====================================
           CORRECT PASSWORD
        ===================================== */

        if (enteredPassword === correctPassword) {

            /* Hide password screen */
            passwordScreen.classList.add("hidden");


            /* Unlock website */
            document.body.classList.remove(
                "password-locked"
            );

            document.documentElement.classList.remove(
                "password-locked"
            );


            /* Remove password screen completely */
            setTimeout(function () {

                if (passwordScreen.parentNode) {
                    passwordScreen.remove();
                }

            }, 100);


            /* Clear password */
            passwordInput.value = "";


        }


        /* =====================================
           WRONG PASSWORD
        ===================================== */

        else {

            if (passwordError) {

                passwordError.textContent =
                    "That's not the password. Try again.";

            }


            passwordInput.value = "";

            passwordInput.focus();

        }

    });

});


/* =========================================
   FEEDBACK SYSTEM
========================================= */

const form =
    document.getElementById("feedback-form");

const feedback =
    document.getElementById("feedback");

const characterCount =
    document.getElementById("character-count");

const thankYou =
    document.getElementById("thank-you");

const submitButton =
    document.getElementById("submit-button");


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const FEEDBACK_URL =
    "https://script.google.com/macros/s/AKfycbxxxWgiIXMYzRotj7ouTVW7WWPYjf38EgKg-FRFd0iicM4ct3niYDAGAhSUHfVuCtqQPg/exec";


/* =========================================
   ANONYMOUS VISITOR ID
========================================= */

/*
 * Creates one anonymous ID for this browser.
 *
 * Example:
 *
 * V-550e8400-e29b-41d4-a716-446655440000
 *
 *
 * This is NOT:
 *
 * - IMEI
 * - Phone number
 * - Device serial number
 * - Name
 * - Email
 *
 *
 * The same browser normally keeps the same
 * Visitor ID unless its site data is cleared.
 */

function getVisitorId() {

    const storageKey =
        "art_gift_visitor_id";


    let visitorId =
        localStorage.getItem(storageKey);


    /* Create ID if one doesn't exist */

    if (!visitorId) {

        /*
         * Preferred method
         */

        if (
            window.crypto &&
            typeof window.crypto.randomUUID ===
            "function"
        ) {

            visitorId =
                "V-" +
                window.crypto.randomUUID();

        }


        /*
         * Fallback for older browsers
         */

        else {

            visitorId =
                "V-" +
                Date.now().toString(36) +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 12);

        }


        /* Save ID in browser */
        localStorage.setItem(
            storageKey,
            visitorId
        );

    }


    return visitorId;
}


/* =========================================
   GET VISITOR ID
========================================= */

let visitorId = "";

try {

    visitorId =
        getVisitorId();

} catch (error) {

    /*
     * If localStorage is unavailable,
     * still allow feedback to work.
     */

    console.log(
        "Visitor ID could not be stored.",
        error
    );

    visitorId =
        "V-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .
