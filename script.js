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
   CHARACTER COUNTER 
========================================= */ 
 
feedback.addEventListener( 
    "input", 
    function () { 
 
        characterCount.textContent = 
            feedback.value.length; 
 
    } 
); 
 
 
 
/* ========================================= 
   FORM SUBMISSION 
========================================= */ 
 
form.addEventListener("submit", function (e) { 
 
    e.preventDefault(); 
 
    const message = feedback.value.trim(); 
 
    if (!message) { 
        alert("Please write something about the artwork."); 
        return; 
    } 
 
    submitButton.disabled = true; 
    submitButton.textContent = "SENDING..."; 
 
 
    /* Create hidden iframe */ 
 
    const iframe = document.createElement("iframe"); 
 
    iframe.name = "feedback-submit-frame"; 
 
    iframe.style.display = "none"; 
 
    document.body.appendChild(iframe); 
 
 
    /* Create form for Apps Script */ 
 
    const submitForm = document.createElement("form"); 
 
    submitForm.method = "POST"; 
 
    submitForm.action = 
        
"https://script.google.com/macros/s/AKfycbxxxWgiIXMYzRotj7ouTVW7WWPYjf38EgKg-FRFd0iicM4ct3niYDAGAhSUHfVuCtqQPg/exec"; 
 
    submitForm.target = "feedback-submit-frame"; 
 
    submitForm.style.display = "none"; 
 
 
    /* Message field */ 
 
    const messageInput = 
        document.createElement("input"); 
 
    messageInput.type = "hidden"; 
 
    messageInput.name = "message"; 
 
    messageInput.value = message; 
 
 
    submitForm.appendChild(messageInput); 
 
    document.body.appendChild(submitForm); 
 
 
    /* Send */ 
 
    submitForm.submit(); 
 
 
    /* 
     * Give Apps Script time to receive 
     * and save the message. 
     */ 
 
    setTimeout(function () { 
 
        submitForm.remove(); 
 
        iframe.remove(); 
 
 
        /* Clear message */ 
 
        feedback.value = ""; 
 
        if (characterCount) { 
            characterCount.textContent = "0"; 
        } 
 
 
        /* Hide feedback form */ 
 
        form.style.display = "none"; 
 
 
        /* Show thank-you */ 
 
        thankYou.style.display = "block"; 
 
        thankYou.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
        }); 
 
    }, 2000); 
 
}); 
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