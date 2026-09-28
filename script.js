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

            passwordScreen.classList.add("hidden");

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
 * It does NOT collect:
 * - name
 * - phone number
 * - IMEI
 * - phone serial number
 *
 * The same browser normally keeps the same ID
 * unless its site data is cleared.
 */

function getVisitorId() {

    const storageKey = "art_gift_visitor_id";

    let visitorId =
        localStorage.getItem(storageKey);


    if (!visitorId) {

        if (
            window.crypto &&
            crypto.randomUUID
        ) {

            visitorId =
                "V-" +
                crypto.randomUUID();

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
}


const visitorId = getVisitorId();


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
   RELIABLE FEEDBACK SUBMISSION
========================================= */

let feedbackWaiting = false;

let feedbackTimeout = null;

let feedbackIframe = null;

let feedbackSubmitForm = null;


/* =========================================
   LISTEN FOR GOOGLE SHEETS CONFIRMATION
========================================= */

window.addEventListener("message", function (event) {

    if (!feedbackWaiting) {
        return;
    }


    if (
        event.data &&
        event.data.type === "ART_FEEDBACK_SAVED"
    ) {

        finishFeedbackSubmission(true);

    }

});


/* =========================================
   FINISH FEEDBACK
========================================= */

function finishFeedbackSubmission(success) {

    if (!feedbackWaiting) {
        return;
    }

    feedbackWaiting = false;


    if (feedbackTimeout) {

        clearTimeout(feedbackTimeout);

        feedbackTimeout = null;

    }


    if (feedbackSubmitForm) {

        feedbackSubmitForm.remove();

        feedbackSubmitForm = null;

    }


    if (feedbackIframe) {

        feedbackIframe.remove();

        feedbackIframe = null;

    }


    submitButton.disabled = false;

    submitButton.textContent = "SUBMIT";


    if (success) {

        feedback.value = "";


        if (characterCount) {

            characterCount.textContent = "0";

        }


        form.style.display = "none";


        thankYou.style.display = "block";


        thankYou.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });


    } else {

        alert(
            "We couldn't confirm that your message was received. Please try submitting again."
        );

    }

}


/* =========================================
   SUBMIT FEEDBACK
========================================= */

if (form && feedback && submitButton) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();


        if (feedbackWaiting) {
            return;
        }


        const message =
            feedback.value.trim();


        if (!message) {

            alert(
                "Please write something about the artwork."
            );

            feedback.focus();

            return;

        }


        submitButton.disabled = true;

        submitButton.textContent =
            "SENDING...";


        feedbackWaiting = true;


        /* =====================================
           CREATE HIDDEN IFRAME
        ===================================== */

        feedbackIframe =
            document.createElement("iframe");


        feedbackIframe.name =
            "feedback-submit-" +
            Date.now();


        feedbackIframe.title =
            "Feedback submission";


        feedbackIframe.style.position =
            "fixed";

        feedbackIframe.style.width =
            "1px";

        feedbackIframe.style.height =
            "1px";

        feedbackIframe.style.left =
            "-10000px";

        feedbackIframe.style.top =
            "-10000px";

        feedbackIframe.style.border =
            "0";

        feedbackIframe.style.opacity =
            "0";

        feedbackIframe.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.appendChild(
            feedbackIframe
        );


        /* =====================================
           CREATE NATIVE HTML FORM
        ===================================== */

        feedbackSubmitForm =
            document.createElement("form");


        feedbackSubmitForm.method =
            "POST";


        feedbackSubmitForm.action =
            FEEDBACK_URL;


        feedbackSubmitForm.target =
            feedbackIframe.name;


        feedbackSubmitForm.style.position =
            "fixed";

        feedbackSubmitForm.style.width =
            "1px";

        feedbackSubmitForm.style.height =
            "1px";

        feedbackSubmitForm.style.left =
            "-10000px";

        feedbackSubmitForm.style.top =
            "-10000px";

        feedbackSubmitForm.style.opacity =
            "0";


        /* =====================================
           MESSAGE FIELD
        ===================================== */

        const messageInput =
            document.createElement("input");


        messageInput.type =
            "hidden";


        messageInput.name =
            "message";


        messageInput.value =
            message;


        feedbackSubmitForm.appendChild(
            messageInput
        );


        /* =====================================
           VISITOR ID FIELD
        ===================================== */

        const visitorInput =
            document.createElement("input");


        visitorInput.type =
            "hidden";


        visitorInput.name =
            "visitorId";


        visitorInput.value =
            visitorId;


        feedbackSubmitForm.appendChild(
            visitorInput
        );


        document.body.appendChild(
            feedbackSubmitForm
        );


        /* =====================================
           NATIVE SUBMISSION
        ===================================== */

        HTMLFormElement.prototype.submit.call(
            feedbackSubmitForm
        );


        /* =====================================
           SAFETY TIMEOUT
        ===================================== */

        feedbackTimeout =
            setTimeout(function () {

                finishFeedbackSubmission(false);

            }, 15000);

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

}
