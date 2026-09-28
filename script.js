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
   ANONYMOUS VISITOR ID
   ========================================= */

function getVisitorId() {

    const storageKey = "art_gift_visitor_id";

    try {

        let visitorId =
            localStorage.getItem(storageKey);

        if (!visitorId) {

            if (
                window.crypto &&
                typeof crypto.randomUUID === "function"
            ) {
                visitorId =
                    "V-" + crypto.randomUUID();

            } else {

                visitorId =
                    "V-" +
                    Date.now().toString(36) +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 10);
            }

            localStorage.setItem(
                storageKey,
                visitorId
            );
        }

        return visitorId;

    } catch (error) {

        /*
         * If localStorage is unavailable,
         * still create a temporary anonymous ID.
         */
        return (
            "V-" +
            Date.now().toString(36) +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );
    }
}

const visitorId = getVisitorId();


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const FEEDBACK_URL =
    "https://script.google.com/macros/s/AKfycbxxxWgiIXMYzRotj7ouTVW7WWPYjf38EgKg-FRFd0iicM4ct3niYDAGAhSUHfVuCtqQPg/exec";


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
         *
         * This is very reliable on modern
         * Android, iPhone, Safari and Chrome.
         * =====================================
         */

        let beaconSent = false;


        try {

            if (
                navigator.sendBeacon &&
                typeof Blob !== "undefined"
            ) {
                const formData =
                    new FormData();
                formData.append(
                    "message",
                    message
                );
                formData.append(
                    "visitorId",
                    visitorId
                );
                const blob =
                    new Blob(
                        [new URLSearchParams(formData).toString()],
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
         *
         * This works on browsers where
         * sendBeacon is unavailable.
         * =====================================
         */

        if (!beaconSent) {

            try {

                /*
                 * Create hidden iframe.
                 * The browser handles the POST
                 * natively instead of JavaScript
                 * fetch/XHR.
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
                    FEEDBACK_URL;

                submitForm.target =
                    "feedback-submit-frame";

                submitForm.style.display =
                    "none";


                /*
                 * Create message field.
                 */

                const messageInput =
                    document.createElement("input");

                messageInput.type =
                    "hidden";

                messageInput.name =
                    "message";

                messageInput.value =
                    message;


                submitForm.appendChild(
                    messageInput
                );
                const visitorInput =
                    document.createElement("input");
                visitorInput.type =
                    "hidden";
                visitorInput.name =
                    "visitorId";
                visitorInput.value =
                    visitorId;
                submitForm.appendChild(
                    visitorInput
                    
                );

                document.body.appendChild(
                    submitForm
                );


                /*
                 * Native browser submission.
                 */

                submitForm.submit();


                /*
                 * Clean up after enough time
                 * for slow mobile networks.
                 */

                setTimeout(
                    function () {

                        if (
                            submitForm &&
                            submitForm.parentNode
                        ) {

                            submitForm.remove();

                        }


                        if (
                            iframe &&
                            iframe.parentNode
                        ) {

                            iframe.remove();

                        }

                    },
                    10000
                );


            } catch (error) {

                console.error(
                    "Feedback fallback failed:",
                    error
                );

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "SUBMIT";

                alert(
                    "The message could not be sent. Please check your internet connection and try again."
                );

                return;
            }

        }


        /*
         * =====================================
         * SHOW THANK YOU
         *
         * Do NOT wait only 2 seconds for
         * the Apps Script page to load.
         *
         * The browser has already handed the
         * request to the network using Beacon,
         * or submitted the native form.
         * =====================================
         */

        setTimeout(
            function () {

                /*
                 * Clear message
                 */

                feedback.value = "";


                if (characterCount) {

                    characterCount.textContent =
                        "0";

                }


                /*
                 * Hide form
                 */

                form.style.display =
                    "none";


                /*
                 * Show thank-you
                 */

                if (thankYou) {

                    thankYou.style.display =
                        "block";


                    /*
                     * Scroll only if supported.
                     * Older browsers won't break.
                     */

                    try {

                        thankYou.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    } catch (error) {

                        thankYou.scrollIntoView();

                    }

                }

            },
            1500
        );

    });

}


/* =========================================
   VIDEO DOWNLOAD
========================================= */

const downloadVideo =
    document.getElementById("download-video");


downloadVideo.addEventListener(
    "click",
    async function () {

        try {

            downloadVideo.disabled = true;

            const originalText =
                downloadVideo.querySelector(
                    ".download-text"
                );

            originalText.textContent =
                "DOWNLOADING...";


            const response =
                await fetch(
                    "assets/artwork.mp4"
                );


            if (!response.ok) {

                throw new Error(
                    "Video could not be found."
                );

            }


            const blob =
                await response.blob();


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "artwork.mp4";


            document.body.appendChild(link);

            link.click();

            link.remove();


            URL.revokeObjectURL(url);


            originalText.textContent =
                "VIDEO DOWNLOADED";


        } catch (error) {

            console.error(error);

            alert(
                "The video could not be downloaded. Please try again."
            );


            const originalText =
                downloadVideo.querySelector(
                    ".download-text"
                );

            originalText.textContent =
                "DOWNLOAD VIDEO";


        } finally {

            downloadVideo.disabled = false;

        }

    }
);
