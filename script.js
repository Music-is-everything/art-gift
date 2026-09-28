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


    /* LOCK BACKGROUND PAGE */
    document.body.classList.add("password-locked");
    document.documentElement.classList.add("password-locked");


    passwordForm.addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const enteredPassword =
            passwordInput.value.trim();

        if (enteredPassword === correctPassword) {

            passwordScreen.classList.add("hidden");

            document.body.classList.remove("password-locked");
            document.documentElement.classList.remove("password-locked");

            setTimeout(function () {
                passwordScreen.remove();
            }, 100);

            passwordInput.value = "";

        } else {

            passwordError.textContent =
                "That's not the password. Try again.";

            passwordInput.value = "";
            passwordInput.focus();
        }

    });

});


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


    if (!passwordScreen || !passwordForm) {
        return;
    }


    passwordForm.addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const enteredPassword =
            passwordInput.value.trim();


        if (enteredPassword === correctPassword) {

            /* Hide password screen completely */
            passwordScreen.classList.add("hidden");

            /* Remove it from the page */
            setTimeout(function () {
                passwordScreen.remove();
            }, 100);

            /* Clear password */
            passwordInput.value = "";

        } else {

            passwordError.textContent =
                "That's not the password. Try again.";

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
 * Creates one random ID for this browser.
 *
 * Example:
 * V-550e8400-e29b-41d4-a716-446655440000
 *
 * This is NOT:
 * - IMEI
 * - phone number
 * - device serial number
 * - name
 *
 * The same browser normally keeps the same ID
 * unless its site data/localStorage is cleared.
 */

function getVisitorId() {

    const storageKey =
        "art_gift_visitor_id";

    let visitorId =
        localStorage.getItem(storageKey);


    if (!visitorId) {

        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {

            visitorId =
                "V-" +
                window.crypto.randomUUID();

        } else {

            visitorId =
                "V-" +
                Date.now().toString(36) +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 12);

        }


        localStorage.setItem(
            storageKey,
            visitorId
        );
    }


    return visitorId;
}


/*
 * Get this browser's Visitor ID once.
 */

const visitorId =
    getVisitorId();


/* =========================================
   CHARACTER COUNTER
========================================= */

if (feedback && characterCount) {

    feedback.addEventListener(
        "input",
        function () {

            characterCount.textContent =
                feedback.value.length;

        }
    );

}


/* =========================================
   FORM SUBMISSION
   CROSS-BROWSER VERSION
========================================= */

if (form && feedback && submitButton) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();
        e.stopPropagation();


        /* Get message */
        const message =
            feedback.value.trim();


        /* Do not submit empty messages */
        if (!message) {

            alert(
                "Please write something about the artwork."
            );

            feedback.focus();

            return;
        }


        /* Prevent double tapping */
        if (submitButton.disabled) {
            return;
        }


        submitButton.disabled = true;
        submitButton.textContent = "SENDING...";


        /*
         * =====================================
         * METHOD 1
         * navigator.sendBeacon
         * =====================================
         */

        let beaconSent = false;


        try {

            if (
                navigator.sendBeacon &&
                typeof Blob !== "undefined"
            ) {

                const formData =
                    new URLSearchParams();


                /* Feedback message */
                formData.append(
                    "message",
                    message
                );


                /* Anonymous Visitor ID */
                formData.append(
                    "visitorId",
                    visitorId
                );


                const blob =
                    new Blob(
                        [formData.toString()],
                        {
                            type:
                                "application/x-www-form-urlencoded"
                        }
                    );


                beaconSent =
                    navigator.sendBeacon(
                        FEEDBACK_URL,
                        blob
                    );

            }

        } catch (error) {

            console.log(
                "Beacon failed. Using form fallback.",
                error
            );

            beaconSent = false;
        }


        /*
         * =====================================
         * METHOD 2
         * NORMAL HTML FORM FALLBACK
         * =====================================
         */

        if (!beaconSent) {

            try {

                /*
                 * Create hidden iframe.
                 */

                const iframe =
                    document.createElement("iframe");

                iframe.name =
                    "feedback-submit-frame";

                iframe.style.display =
                    "none";

                iframe.setAttribute(
                    "aria-hidden",
                    "true"
                );

                document.body.appendChild(
                    iframe
                );


                /*
                 * Create native HTML form.
                 */

                const submitForm =
                    document.createElement("form");

                submitForm.method =
                    "POST";

                submitForm.action =
                    FEEDBACK
