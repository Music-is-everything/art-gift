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


    /* LOCK BACKGROUND PAGE */

    if (!passwordScreen || !passwordForm || !passwordInput) {
        return;
    }

    document.body.classList.add("password-locked");
    document.documentElement.classList.add("password-locked");


    /* =========================================
       PASSWORD FORM
       ENTER KEY WORKS
    ========================================= */

    passwordForm.addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();


        const enteredPassword =
            passwordInput.value.trim();


        if (enteredPassword === correctPassword) {

            /* Hide password screen */

            passwordScreen.classList.add("hidden");


            /* Unlock background page */

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


        } else {

            /* Wrong password */

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

function getVisitorId() {

    const storageKey =
        "art_gift_visitor_id";

    let visitorId =
        localStorage.getItem(storageKey);


    /* Create a new ID if this browser
       doesn't already have one */

    if (!visitorId) {

        if (
            window.crypto &&
            typeof window.crypto.randomUUID ===
            "function"
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


/* Get this browser's Visitor ID */

let visitorId = "";

try {

    visitorId =
        getVisitorId();

} catch (error) {

    console.log(
        "Visitor ID could not be stored.",
        error
    );

    /* Fallback ID */

    visitorId =
        "V-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 12);
}


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
         * Existing working method preserved.
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


                /* Existing feedback field */

                formData.append(
                    "message",
                    message
                );


                /* NEW: Visitor ID */

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
         *
         * Existing working method preserved.
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


                /*
                 * NEW: Create Visitor ID field.
                 */

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
         * Original working behavior preserved.
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


if (downloadVideo) {

    downloadVideo.addEventListener(
        "click",
        async function () {

            try {

                downloadVideo.disabled = true;

                const originalText =
                    downloadVideo.querySelector(
                        ".download-text"
                    );

                if (originalText) {

                    originalText.textContent =
                        "DOWNLOADING...";

                }


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


                if (originalText) {

                    originalText.textContent =
                        "VIDEO DOWNLOADED";

                }


            } catch (error) {

                console.error(error);

                alert(
                    "The video could not be downloaded. Please try again."
                );


                const originalText =
                    downloadVideo.querySelector(
                        ".download-text"
                    );

                if (originalText) {

                    originalText.textContent =
                        "DOWNLOAD VIDEO";

                }


            } finally {

                downloadVideo.disabled = false;

            }

        }
    );

   }
