/* =========================================================
   ART GIFT WEBSITE - COMPLETE SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       1. PASSWORD PROTECTION
       ========================================================= */

    const passwordScreen = document.getElementById("password-screen");
    const passwordForm = document.getElementById("password-form");
    const passwordInput = document.getElementById("password-input");
    const passwordError = document.getElementById("password-error");

    const correctPassword = "sunflower";

    if (passwordScreen && passwordForm && passwordInput) {

        // Lock the page while password screen is visible
        document.documentElement.classList.add("password-locked");
        document.body.classList.add("password-locked");

        passwordForm.addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const enteredPassword = passwordInput.value.trim();

            if (enteredPassword === correctPassword) {

                passwordScreen.classList.add("hidden");

                document.documentElement.classList.remove("password-locked");
                document.body.classList.remove("password-locked");

                passwordInput.value = "";

                // Completely remove password screen
                setTimeout(function () {
                    if (passwordScreen.parentNode) {
                        passwordScreen.remove();
                    }
                }, 400);

            } else {

                if (passwordError) {
                    passwordError.textContent =
                        "That's not the password. Try again.";
                }

                passwordInput.value = "";
                passwordInput.focus();
            }
        });
    }

    const feedbackForm = document.getElementById("feedback-form");
    const feedbackInput = document.getElementById("feedback");
    const submitButton = document.getElementById("submit-button");
    const characterCount = document.getElementById("character-count");

    /*
       Google Apps Script Web App
       */
       const GOOGLE_SCRIPT_URL =
           "https://script.google.com/macros/s/AKfycbzTMYDheR8uDZGbF4jz3JPHbyNVlIC_Zpl-2sWnh59BZ-ycVxdn4G3diDFWsyLlKuQ/exec";


           /* =========================================================
              DEVICE ID
                 Uses the SAME Device ID created by the Instructions app.
                    ========================================================= */

                    function getDeviceId() {

                        let deviceId =
                                localStorage.getItem("private_device_id");

                                    /*
                                           Safety fallback:
                                                  If this device does not have an ID yet,
                                                         generate one.
                                                             */
                                                                 if (!deviceId) {

                                                                         const randomPart =
                                                                                     crypto.randomUUID()
                                                                                                     .replace(/-/g, "")
                                                                                                                     .substring(0, 12)
                                                                                                                                     .toUpperCase();

                                                                                                                                             deviceId =
                                                                                                                                                         randomPart.substring(0, 4) + "-" +
                                                                                                                                                                     randomPart.substring(4, 8) + "-" +
                                                                                                                                                                                 randomPart.substring(8, 12);

                                                                                                                                                                                         localStorage.setItem(
                                                                                                                                                                                                     "private_device_id",
                                                                                                                                                                                                                 deviceId
                                                                                                                                                                                                                         );
                                                                                                                                                                                                                             }

                                                                                                                                                                                                                                 return deviceId;
                                                                                                                                                                                                                                 }


                                                                                                                                                                                                                                 /* =========================================================
                                                                                                                                                                                                                                    CHARACTER COUNTER
                                                                                                                                                                                                                                       ========================================================= */

                                                                                                                                                                                                                                       if (feedbackInput && characterCount) {

                                                                                                                                                                                                                                           feedbackInput.addEventListener(
                                                                                                                                                                                                                                                   "input",
                                                                                                                                                                                                                                                           function () {

                                                                                                                                                                                                                                                                       characterCount.textContent =
                                                                                                                                                                                                                                                                                       feedbackInput.value.length;

                                                                                                                                                                                                                                                                                               }
                                                                                                                                                                                                                                                                                                   );
                                                                                                                                                                                                                                                                                                   }


                                                                                                                                                                                                                                                                                                   /* =========================================================
                                                                                                                                                                                                                                                                                                      SUBMIT FEEDBACK
                                                                                                                                                                                                                                                                                                         ========================================================= */

    if (feedbackForm && feedbackInput) {

        feedbackForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const message =
                    feedbackInput.value.trim();

                if (!message) {
                    return;
                }


                /* Get the existing Device ID */
                const deviceId =
                    getDeviceId();


                /* Disable button while sending */
                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "SENDING...";

                }


                /*
                               Send message + Device ID.

                                              URLSearchParams keeps the request simple
                                                             and works well with Google Apps Script.
                                                                         */

                const formData =
                    new URLSearchParams();

                formData.append(
                    "message",
                    message
                );

                formData.append(
                    "deviceId",
                    deviceId
                );


                try {

                    /*
                                       Send to Google Apps Script.

                                                          no-cors is intentional because
                                                                             Google Apps Script does not need to
                                                                                                expose CORS headers for this use.
                                                                                                                */

                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {
                            method: "POST",
                            mode: "no-cors",
                            body: formData,
                            keepalive: true
                        }
                    );


                    /*
                                       Give the request time to leave the device
                                                          before changing the page.
                                                                          */

                    await new Promise(
                        function (resolve) {
                            setTimeout(resolve, 1000);
                        }
                    );


                    /*
                                       Show existing thank-you screen.
                                                          Nothing else in the page is changed.
                                                                          */

                    feedbackForm.style.display =
                        "none";

                    const thankYouSection =
                        document.getElementById(
                            "thank-you-section"
                        );

                    if (thankYouSection) {

                        thankYouSection.classList.remove(
                            "hidden"
                        );

                        thankYouSection.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }


                    feedbackInput.value = "";

                    if (characterCount) {

                        characterCount.textContent =
                            "0";

                    }


                } catch (error) {

                    console.error(
                        "Feedback submission failed:",
                        error
                    );


                    /*
                                       If something actually goes wrong,
                                                          don't pretend the message was received.
                                                                          */

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "TRY AGAIN";

                    }

                    return;
                }


                /*
                               Restore button state internally.
                                           */

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "SUBMIT";

                }

            }
        );
    }
    /* =========================================================
       3. ARTWORK VIDEO DOWNLOAD
       ========================================================= */

    const downloadButton =
        document.getElementById("download-video");

    if (downloadButton) {

        downloadButton.addEventListener("click", function () {

            /*
               The actual download URL should already be
               present in the HTML href.

               This handler keeps the button functional
               without changing your existing video system.
            */

            const videoURL =
                downloadButton.getAttribute("href");

            if (!videoURL) {
                return;
            }

            /*
               Allow normal browser download behavior.
            */

        });
    }


    /* =========================================================
       4. LETTER / SURPRISE SYSTEM
       ========================================================= */

    /*
       Important dates

       Letter unlock:
       15 October 2026

       Countdown:
       21 days from the first time the letter is opened.
    */

    const LETTER_UNLOCK_DATE =
        new Date("2026-10-01T00:00:00+05:30").getTime();

    const COUNTDOWN_DURATION =
        1 * 24 * 60 * 60 * 1000;


    /* ---------------------------------------------------------
       Support BOTH possible ID systems
       --------------------------------------------------------- */

    const sealedLetter =
        document.getElementById("sealed-letter") ||
        document.getElementById("letter-locked");

    const openedLetter =
        document.getElementById("opened-letter-wrap") ||
        document.getElementById("letter-ready");

    const openLetterButton =
        document.getElementById("open-letter-button");

    const countdownSection =
        document.getElementById("countdown-reveal") ||
        document.getElementById("countdown-section");

    const futureVideo =
        document.getElementById("future-video") ||
        document.getElementById("future-message");

    const letterCard =
        document.getElementById("letter-card") ||
        document.getElementById("letter-content");


    /*
       Countdown number elements
    */

    const countdownDays =
        document.getElementById("countdown-days");

    const countdownHours =
        document.getElementById("countdown-hours");

    const countdownMinutes =
        document.getElementById("countdown-minutes");

    const countdownSeconds =
        document.getElementById("countdown-seconds");


    /* ---------------------------------------------------------
       Check if letter system exists
       --------------------------------------------------------- */

    if (
        sealedLetter ||
        openedLetter ||
        openLetterButton ||
        countdownSection ||
        futureVideo ||
        letterCard
    ) {

        initializeLetterSystem();

    }


    function initializeLetterSystem() {

        const now = Date.now();

        /*
           Before 15/10/2026
        */

        if (now < LETTER_UNLOCK_DATE) {

            showSealedLetter();

            return;
        }


        /*
           After 15/10/2026
        */

        const letterOpened =
            localStorage.getItem(
                "artGiftLetterOpened"
            );


        if (letterOpened === "true") {

            /*
               Letter was already opened.
               Restore the countdown.
            */

            showOpenedLetter();

            startSavedCountdown();

        } else {

            /*
               Letter is unlocked but not opened yet.
            */

            showLetterReady();

        }
    }


    /* =========================================================
       SEALED LETTER
       ========================================================= */

    function showSealedLetter() {

        if (sealedLetter) {

            sealedLetter.style.display = "";
        }

        if (openedLetter) {

            openedLetter.style.display = "none";
        }

        if (countdownSection) {

            countdownSection.style.display = "none";
        }

        if (futureVideo) {

            futureVideo.style.display = "none";
        }

        if (letterCard) {

            letterCard.style.display = "none";
        }
    }


    /* =========================================================
       LETTER READY
       ========================================================= */

    function showLetterReady() {

        if (sealedLetter) {

            sealedLetter.style.display = "none";
        }

        if (openedLetter) {

            openedLetter.style.display = "";
        }

        if (countdownSection) {

            countdownSection.style.display = "none";
        }

        if (futureVideo) {

            futureVideo.style.display = "none";
        }

        if (letterCard) {

            letterCard.style.display = "none";
        }

        /*
           Change text if the elements exist.
        */

        const title =
            document.getElementById("letter-ready-title");

        const button =
            document.getElementById("open-letter-button");

        if (title) {

            title.textContent =
                "THE LETTER IS READY";
        }

        if (button) {

            button.textContent =
                "OPEN LETTER";
        }
    }


    /* =========================================================
       OPEN LETTER
       ========================================================= */

    if (openLetterButton) {

        openLetterButton.addEventListener(
            "click",
            function () {

                /*
                   Prevent multiple clicks
                */

                openLetterButton.disabled = true;


                /*
                   Save opening time ONLY the first time.
                */

                let countdownStart =
                    localStorage.getItem(
                        "artGiftCountdownStart"
                    );


                if (!countdownStart) {

                    countdownStart =
                        Date.now().toString();

                    localStorage.setItem(
                        "artGiftCountdownStart",
                        countdownStart
                    );
                }


                localStorage.setItem(
                    "artGiftLetterOpened",
                    "true"
                );


                /*
                   Reveal letter
                */

                showOpenedLetter();


                /*
                   Start countdown
                */

                startSavedCountdown();


                /*
                   Scroll to the top
                */

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }


    /* =========================================================
       OPENED LETTER
       ========================================================= */

    function showOpenedLetter() {

        if (sealedLetter) {

            sealedLetter.style.display = "none";
        }

        if (openedLetter) {

            openedLetter.style.display = "none";
        }

        /*
           Letter should be visible
        */

        if (letterCard) {

            letterCard.style.display = "";
        }


        /*
           Countdown should be ABOVE the letter.
           The actual visual order is controlled by CSS/HTML.
        */

        if (countdownSection) {

            countdownSection.style.display = "";
        }


        /*
           Future video remains hidden until countdown ends.
        */

        if (futureVideo) {

            futureVideo.style.display = "none";
        }
    }


    /* =========================================================
       START SAVED COUNTDOWN
       ========================================================= */

    function startSavedCountdown() {

        let countdownStart =
            localStorage.getItem(
                "artGiftCountdownStart"
            );


        /*
           Safety fallback
        */

        if (!countdownStart) {

            countdownStart =
                Date.now().toString();

            localStorage.setItem(
                "artGiftCountdownStart",
                countdownStart
            );
        }


        const startTime =
            parseInt(countdownStart, 10);

        const endTime =
            startTime + COUNTDOWN_DURATION;


        updateCountdown(endTime);


        /*
           Clear previous timer if any
        */

        if (window.artGiftCountdownTimer) {

            clearInterval(
                window.artGiftCountdownTimer
            );
        }


        window.artGiftCountdownTimer =
            setInterval(function () {

                updateCountdown(endTime);

            }, 1000);
    }


    /* =========================================================
       UPDATE COUNTDOWN
       ========================================================= */

    function updateCountdown(endTime) {

        const remaining =
            endTime - Date.now();


        /*
           Countdown finished
        */

        if (remaining <= 0) {

            if (window.artGiftCountdownTimer) {

                clearInterval(
                    window.artGiftCountdownTimer
                );
            }


            if (countdownSection) {

                countdownSection.style.display = "none";
            }


            showFutureMessage();

            return;
        }


        const days =
            Math.floor(
                remaining /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (remaining %
                    (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );


        const minutes =
            Math.floor(
                (remaining %
                    (1000 * 60 * 60)) /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (remaining %
                    (1000 * 60)) /
                1000
            );


        if (countdownDays) {

            countdownDays.textContent =
                String(days).padStart(2, "0");
        }

        if (countdownHours) {

            countdownHours.textContent =
                String(hours).padStart(2, "0");
        }

        if (countdownMinutes) {

            countdownMinutes.textContent =
                String(minutes).padStart(2, "0");
        }

        if (countdownSeconds) {

            countdownSeconds.textContent =
                String(seconds).padStart(2, "0");
        }
    }


    /* =========================================================
       FUTURE MESSAGE
       ========================================================= */

    function showFutureMessage() {

        if (countdownSection) {

            countdownSection.style.display = "none";
        }


        /*
           Future video becomes visible.
        */

        if (futureVideo) {

            futureVideo.style.display = "";
        }


        /*
           Put future message at the top visually
           by scrolling to it.
        */

        if (futureVideo) {

            setTimeout(function () {

                futureVideo.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 300);
        }
    }


    /* =========================================================
       5. VIDEO AUTOPAUSE WHEN NOT VISIBLE
       ========================================================= */

    const videos =
        document.querySelectorAll("video");

    if (videos.length > 0) {

        const videoObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        const video =
                            entry.target;

                        /*
                           Only pause videos that are
                           mostly outside the screen.
                        */

                        if (!entry.isIntersecting) {

                            if (!video.paused) {

                                video.pause();
                            }
                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );


        videos.forEach(function (video) {

            videoObserver.observe(video);
        });
    }


    /* =========================================================
       6. MOBILE SAFETY
       ========================================================= */

    /*
       Prevent accidental horizontal overflow.
    */

    document.documentElement.style.maxWidth =
        "100%";

    document.body.style.maxWidth =
        "100%";


    /* =========================================================
       END
       ========================================================= */

});
