/* =========================================
   ART GIFT WEBSITE - COMPLETE SCRIPT
========================================= */


/* =========================================
   WAIT UNTIL HTML IS READY
========================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       PASSWORD PROTECTION
    ========================================= */

    const passwordScreen =
        document.getElementById("password-screen");

    const passwordForm =
        document.getElementById("password-form");

    const passwordInput =
        document.getElementById("password-input");

    const passwordError =
        document.getElementById("password-error");

    const correctPassword =
        "sunflower";


    /*
     * Password elements must exist.
     * If they don't, don't stop the rest
     * of the website.
     */

    if (
        passwordScreen &&
        passwordForm &&
        passwordInput
    ) {

        /* Lock website */
        document.body.classList.add(
            "password-locked"
        );

        document.documentElement.classList.add(
            "password-locked"
        );


        /* =====================================
           PASSWORD SUBMIT
           Button + ENTER KEY
        ===================================== */

        passwordForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                const enteredPassword =
                    passwordInput.value.trim();


                if (
                    enteredPassword ===
                    correctPassword
                ) {

                    /* Unlock website */

                    document.body.classList.remove(
                        "password-locked"
                    );

                    document.documentElement.classList.remove(
                        "password-locked"
                    );


                    /* Hide password screen */

                    passwordScreen.classList.add(
                        "hidden"
                    );


                    /* Remove password screen */

                    setTimeout(
                        function () {

                            if (
                                passwordScreen.parentNode
                            ) {

                                passwordScreen.remove();

                            }

                        },
                        100
                    );


                    passwordInput.value = "";


                } else {

                    if (passwordError) {

                        passwordError.textContent =
                            "That's not the password. Try again.";

                    }

                    passwordInput.value = "";

                    passwordInput.focus();

                }

            }
        );

    }


    /* =========================================
       ANONYMOUS VISITOR ID
       
       IMPORTANT:
       This is ONLY a function.
       It does NOT run when the website opens.
    ========================================= */

    function getVisitorId() {

        const storageKey =
            "art_gift_visitor_id";


        try {

            let visitorId = null;


            /* Try to read existing ID */

            try {

                visitorId =
                    localStorage.getItem(
                        storageKey
                    );

            } catch (storageError) {

                console.log(
                    "Local storage read unavailable.",
                    storageError
                );

            }


            /* Existing visitor */

            if (visitorId) {

                return visitorId;

            }


            /* =================================
               CREATE NEW VISITOR ID
            ================================= */

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


            /* =================================
               SAVE ID
            ================================= */

            try {

                localStorage.setItem(
                    storageKey,
                    visitorId
                );

            } catch (storageError) {

                /*
                 * Some browsers/webviews can
                 * block localStorage.
                 *
                 * This must NEVER stop the
                 * website.
                 */

                console.log(
                    "Local storage write unavailable.",
                    storageError
                );

            }


            return visitorId;


        } catch (error) {

            /*
             * FINAL FALLBACK
             *
             * Visitor ID errors must never
             * stop the website.
             */

            console.log(
                "Visitor ID error:",
                error
            );


            return (
                "V-" +
                Date.now().toString(36) +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 12)
            );

        }

    }


    /* =========================================
       FEEDBACK ELEMENTS
    ========================================= */

    const form =
        document.getElementById(
            "feedback-form"
        );

    const feedback =
        document.getElementById(
            "feedback"
        );

    const characterCount =
        document.getElementById(
            "character-count"
        );

    const thankYou =
        document.getElementById(
            "thank-you"
        );

    const submitButton =
        document.getElementById(
            "submit-button"
        );


    /* =========================================
       GOOGLE APPS SCRIPT URL
       
       KEEP YOUR CURRENT URL
    ========================================= */

    const FEEDBACK_URL =
        "https://script.google.com/macros/s/AKfycbxxxWgiIXMYzRotj7ouTVW7WWPYjf38EgKg-FRFd0iicM4ct3niYDAGAhSUHfVuCtqQPg/exec";


    /* =========================================
       CHARACTER COUNTER
    ========================================= */

    if (
        feedback &&
        characterCount
    ) {

        feedback.addEventListener(
            "input",
            function () {

                characterCount.textContent =
                    feedback.value.length;

            }
        );

    }


    /* =========================================
       FEEDBACK FORM SUBMISSION
    ========================================= */

    if (
        form &&
        feedback &&
        submitButton
    ) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                /* =================================
                   GET MESSAGE
                ================================= */

                const message =
                    feedback.value.trim();


                /* =================================
                   EMPTY MESSAGE CHECK
                ================================= */

                if (!message) {

                    alert(
                        "Please write something about the artwork."
                    );

                    feedback.focus();

                    return;

                }


                /* =================================
                   PREVENT DOUBLE SUBMISSION
                ================================= */

                if (
                    submitButton.disabled
                ) {

                    return;

                }


                /* =================================
                   GET VISITOR ID
                   
                   IMPORTANT:
                   Visitor ID is generated HERE,
                   NOT when the website opens.
                ================================= */

                const visitorId =
                    getVisitorId();


                /* Disable button */

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "SENDING...";


                /* =================================
                   METHOD 1
                   
                   navigator.sendBeacon
                ================================= */

                let beaconSent =
                    false;


                try {

                    if (
                        navigator.sendBeacon &&
                        typeof Blob !==
                            "undefined"
                    ) {


                        const formData =
                            new URLSearchParams();


                        /* Message */

                        formData.append(
                            "message",
                            message
                        );


                        /* Visitor ID */

                        formData.append(
                            "visitorId",
                            visitorId
                        );


                        /* Create request */

                        const blob =
                            new Blob(
                                [
                                    formData.toString()
                                ],
                                {
                                    type:
                                        "application/x-www-form-urlencoded"
                                }
                            );


                        /* Send */

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

                    beaconSent =
                        false;

                }


                /* =================================
                   METHOD 2
                   
                   NATIVE HTML FORM FALLBACK
                   
                   Used when sendBeacon fails.
                ================================= */

                if (!beaconSent) {

                    try {


                        /* =================================
                           CREATE HIDDEN IFRAME
                        ================================= */

                        const iframe =
                            document.createElement(
                                "iframe"
                            );


                        /*
                         * Unique iframe name prevents
                         * conflicts with another submission.
                         */

                        iframe.name =
                            "feedback-submit-frame-" +
                            Date.now();


                        iframe.style.display =
                            "none";


                        iframe.setAttribute(
                            "aria-hidden",
                            "true"
                        );


                        document.body.appendChild(
                            iframe
                        );


                        /* =================================
                           CREATE NATIVE FORM
                        ================================= */

                        const submitForm =
                            document.createElement(
                                "form"
                            );


                        submitForm.method =
                            "POST";


                        submitForm.action =
                            FEEDBACK_URL;


                        submitForm.target =
                            iframe.name;


                        submitForm.style.display =
                            "none";


                        /* =================================
                           MESSAGE FIELD
                        ================================= */

                        const messageInput =
                            document.createElement(
                                "input"
                            );


                        messageInput.type =
                            "hidden";


                        messageInput.name =
                            "message";


                        messageInput.value =
                            message;


                        submitForm.appendChild(
                            messageInput
                        );


                        /* =================================
                           VISITOR ID FIELD
                        ================================= */

                        const visitorInput =
                            document.createElement(
                                "input"
                            );


                        visitorInput.type =
                            "hidden";


                        visitorInput.name =
                            "visitorId";


                        visitorInput.value =
                            visitorId;


                        submitForm.appendChild(
                            visitorInput
                        );


                        /* Add form to page */

                        document.body.appendChild(
                            submitForm
                        );


                        /* =================================
                           NATIVE SUBMISSION
                        ================================= */

                        submitForm.submit();


                        /* =================================
                           CLEANUP
                        ================================= */

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


                        /* Re-enable button */

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


                /* =================================
                   SHOW THANK YOU
                ================================= */

                setTimeout(
                    function () {


                        /* Clear message */

                        feedback.value =
                            "";


                        /* Reset counter */

                        if (
                            characterCount
                        ) {

                            characterCount.textContent =
                                "0";

                        }


                        /* Hide feedback form */

                        form.style.display =
                            "none";


                        /* Show thank you */

                        if (
                            thankYou
                        ) {

                            thankYou.style.display =
                                "block";


                            /* Scroll to thank you */

                            try {

                                thankYou.scrollIntoView(
                                    {
                                        behavior:
                                            "smooth",

                                        block:
                                            "center"
                                    }
                                );

                            } catch (error) {

                                thankYou.scrollIntoView();

                            }

                        }

                    },
                    1500
                );

            }
        );

    }


    /* =========================================
       VIDEO DOWNLOAD
    ========================================= */

    const downloadVideo =
        document.getElementById(
            "download-video"
        );


    if (downloadVideo) {

        downloadVideo.addEventListener(
            "click",
            async function () {


                try {


                    /* Disable button */

                    downloadVideo.disabled =
                        true;


                    /* Button text */

                    const originalText =
                        downloadVideo.querySelector(
                            ".download-text"
                        );


                    if (originalText) {

                        originalText.textContent =
                            "DOWNLOADING...";

                    }


                    /* =================================
                       GET VIDEO
                    ================================= */

                    const response =
                        await fetch(
                            "assets/artwork.mp4"
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Video could not be found."
                        );

                    }


                    /* Convert to Blob */

                    const blob =
                        await response.blob();


                    /* Create temporary URL */

                    const url =
                        URL.createObjectURL(
                            blob
                        );


                    /* Create download link */

                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        url;


                    link.download =
                        "artwork.mp4";


                    document.body.appendChild(
                        link
                    );


                    /* Start download */

      
