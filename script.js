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
   SEALED LETTER + 21 DAY SURPRISE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const letterSection =
        document.getElementById(
            "letter-section"
        );

    const letterLocked =
        document.getElementById(
            "letter-locked"
        );

    const letterReady =
        document.getElementById(
            "letter-ready"
        );

    const openLetterButton =
        document.getElementById(
            "open-letter-button"
        );

    const letterContent =
        document.getElementById(
            "letter-content"
        );

    const countdownSection =
        document.getElementById(
            "countdown-section"
        );

    const futureMessage =
        document.getElementById(
            "future-message"
        );

    const countdownDays =
        document.getElementById(
            "countdown-days"
        );

    const countdownHours =
        document.getElementById(
            "countdown-hours"
        );

    const countdownMinutes =
        document.getElementById(
            "countdown-minutes"
        );

    const countdownSeconds =
        document.getElementById(
            "countdown-seconds"
        );


    /*
     * If the new HTML has not been added,
     * leave the original website alone.
     */

    if (
        !letterSection ||
        !letterLocked ||
        !letterReady ||
        !openLetterButton
    ) {
        return;
    }


    /* =========================================
       LETTER UNLOCK DATE
    ========================================= */

    const LETTER_UNLOCK_DATE =
        new Date(
            "2026-10-15T00:00:00"
        );


    /* =========================================
       21 DAY COUNTDOWN
    ========================================= */

    const COUNTDOWN_DURATION =
        21 *
        24 *
        60 *
        60 *
        1000;


    /* =========================================
       LOCAL STORAGE
    ========================================= */

    const LETTER_OPENED_KEY =
        "artGiftLetterOpened";

    const COUNTDOWN_START_KEY =
        "artGiftCountdownStart";


    /* =========================================
       CHECK LETTER DATE
    ========================================= */

    function checkLetterDate() {

        const now =
            new Date();


        if (
            now >=
            LETTER_UNLOCK_DATE
        ) {

            letterLocked.style.display =
                "none";

            letterReady.style.display =
                "block";

        } else {

            letterLocked.style.display =
                "block";

            letterReady.style.display =
                "none";

        }

    }


    checkLetterDate();


    /*
     * Automatically check again.
     */

    setInterval(
        checkLetterDate,
        60000
    );


    /* =========================================
       GET SAVED COUNTDOWN TIME
    ========================================= */

    function getCountdownStart() {

        const saved =
            localStorage.getItem(
                COUNTDOWN_START_KEY
            );


        if (!saved) {
            return null;
        }


        const time =
            Number(saved);


        if (
            Number.isNaN(time)
        ) {
            return null;
        }


        return time;

    }


    /* =========================================
       HAS LETTER BEEN OPENED?
    ========================================= */

    function hasOpenedLetter() {

        return (
            localStorage.getItem(
                LETTER_OPENED_KEY
            ) === "true"
        );

    }


    /* =========================================
       OPEN LETTER
    ========================================= */

    function revealLetter() {

        /*
         * Hide sealed / ready state.
         */

        letterLocked.style.display =
            "none";

        letterReady.style.display =
            "none";


        /*
         * Show actual letter.
         */

        if (letterContent) {

            letterContent.style.display =
                "block";

        }


        /*
         * Remember that the letter
         * has been opened.
         */

        localStorage.setItem(
            LETTER_OPENED_KEY,
            "true"
        );


        /*
         * Start time is saved only once.
         */

        let countdownStart =
            getCountdownStart();


        if (!countdownStart) {

            countdownStart =
                Date.now();


            localStorage.setItem(
                COUNTDOWN_START_KEY,
                String(countdownStart)
            );

        }


        /*
         * Countdown is completely hidden
         * before the letter is opened.
         */

        if (countdownSection) {

            countdownSection.style.display =
                "block";

        }


        startCountdown(
            countdownStart
        );

    }


    openLetterButton.addEventListener(
        "click",
        revealLetter
    );


    /* =========================================
       COUNTDOWN
    ========================================= */

    let countdownTimer =
        null;


    function startCountdown(
        startTime
    ) {

        if (!countdownSection) {
            return;
        }


        countdownSection.style.display =
            "block";


        function updateCountdown() {

            const now =
                Date.now();


            const elapsed =
                now - startTime;


            const remaining =
                COUNTDOWN_DURATION -
                elapsed;


            /*
             * Countdown finished.
             */

            if (
                remaining <= 0
            ) {

                if (countdownTimer) {

                    clearInterval(
                        countdownTimer
                    );

                    countdownTimer =
                        null;

                }


                showFutureMessage();

                return;

            }


            const totalSeconds =
                Math.floor(
                    remaining / 1000
                );


            const days =
                Math.floor(
                    totalSeconds /
                    86400
                );


            const hours =
                Math.floor(
                    (
                        totalSeconds %
                        86400
                    ) / 3600
                );


            const minutes =
                Math.floor(
                    (
                        totalSeconds %
                        3600
                    ) / 60
                );


            const seconds =
                totalSeconds % 60;


            if (countdownDays) {

                countdownDays.textContent =
                    String(days).padStart(
                        2,
                        "0"
                    );

            }


            if (countdownHours) {

                countdownHours.textContent =
                    String(hours).padStart(
                        2,
                        "0"
                    );

            }


            if (countdownMinutes) {

                countdownMinutes.textContent =
                    String(minutes).padStart(
                        2,
                        "0"
                    );

            }


            if (countdownSeconds) {

                countdownSeconds.textContent =
                    String(seconds).padStart(
                        2,
                        "0"
                    );

            }

        }


        updateCountdown();


        if (countdownTimer) {

            clearInterval(
                countdownTimer
            );

        }


        countdownTimer =
            setInterval(
                updateCountdown,
                1000
            );

    }


    /* =========================================
       FUTURE MESSAGE
    ========================================= */

    function showFutureMessage() {

        /*
         * Hide countdown.
         */

        if (countdownSection) {

            countdownSection.style.display =
                "none";

        }


        /*
         * Show cinematic video section.
         */

        if (futureMessage) {

            futureMessage.style.display =
                "block";

        }

    }


    /* =========================================
       RESTORE AFTER REOPENING
    ========================================= */

    if (
        hasOpenedLetter()
    ) {

        /*
         * Letter has already been opened.
         */

        letterLocked.style.display =
            "none";

        letterReady.style.display =
            "none";


        if (letterContent) {

            letterContent.style.display =
                "block";

        }


        const savedStart =
            getCountdownStart();


        if (savedStart) {

            const elapsed =
                Date.now() -
                savedStart;


            if (
                elapsed >=
                COUNTDOWN_DURATION
            ) {

                showFutureMessage();

            } else {

                startCountdown(
                    savedStart
                );

            }

        }

    }

});


/* =========================================
   FEEDBACK SYSTEM
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
   FEEDBACK SUBMISSION
   CROSS-BROWSER VERSION
========================================= */

if (
    form &&
    feedback &&
    submitButton
) {

    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();
            e.stopPropagation();


            const message =
                feedback.value.trim();


            /*
             * Do not submit empty messages.
             */

            if (!message) {

                alert(
                    "Please write something about the artwork."
                );

                feedback.focus();

                return;

            }


            /*
             * Prevent double tapping.
             */

            if (
                submitButton.disabled
            ) {

                return;

            }


            submitButton.disabled =
                true;

            submitButton.textContent =
                "SENDING...";


            /* =====================================
               METHOD 1
               navigator.sendBeacon
            ===================================== */

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


                    formData.append(
                        "message",
                        message
                    );


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


            /* =====================================
               METHOD 2
               NORMAL HTML FORM FALLBACK
            ===================================== */

            if (!beaconSent) {

                try {

                    const iframe =
                        document.createElement(
                            "iframe"
                        );


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


                    const submitForm =
                        document.createElement(
                            "form"
                        );


                    submitForm.method =
                        "POST";


                    submitForm.action =
                        FEEDBACK_URL;


                    submitForm.target =
                        "feedback-submit-frame";


                    submitForm.style.display =
                        "none";


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


                    document.body.appendChild(
                        submitForm
                    );


                    /*
                     * Native browser submission.
                     */

                    submitForm.submit();


                    /*
                     * Clean up later.
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


            /* =====================================
               SHOW THANK YOU
            ===================================== */

            setTimeout(
                function () {

                    /*
                     * Clear message.
                     */

                    feedback.value =
                        "";


                    if (
                        characterCount
                    ) {

                        characterCount.textContent =
                            "0";

                    }


                    /*
                     * Hide form.
                     */

                    form.style.display =
                        "none";


                    /*
                     * Show thank-you.
                     */

                    if (
                        thankYou
                    ) {

                        thankYou.style.display =
                            "block";


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


                    submitButton.di
