const container = document.getElementById("app-container");
const ai = new SmartInterviewSystem();

let activeStream = null;

// Start Stage - Render Home Stage
UI.renderHomeStage(container, (file) => {
  console.log("File uploaded:", file.name);
  
  // Transition to Setup Stage
  UI.renderSetupForm(container, (candidateData) => {
    
    // Request Mandatory Camera Access
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        activeStream = stream;
        
        // Transition to Interview State
        const response = ai.initialize(candidateData);
        console.log("AI Response:", response);
        
        UI.renderInterviewScreen(container, response.progress, handleAnswer);
        
        // Attach Stream to Webcam element
        const videoElement = document.getElementById('webcam');
        if(videoElement) {
          videoElement.srcObject = stream;
        }
        
        // Simulate thinking delay then ask first question
        setTimeout(() => {
          UI.addMessage(response.question, "system");
        }, 500);

      })
      .catch((err) => {
        console.error("Camera access denied:", err);
        alert("Camera access is MANDATORY for the AI Smart Interview to analyze confidence levels. Please allow camera access and try again.");
      });
  });
});

// Handle Answer Submissions
function handleAnswer(answerText) {
  const inputArea = document.querySelector(".chat-input-area");
  inputArea.style.opacity = "0.5";
  inputArea.style.pointerEvents = "none";
  
  // Simulate AI thinking
  UI.showTyping();
  
  setTimeout(() => {
    UI.removeTyping();
    const response = ai.processAnswer(answerText);
    console.log("AI Response:", response);
    
    // Check stage
    if (response.stage === "questioning") {
      UI.addMessage(response.question, "system");
      UI.updateProgress(response.progress);
      
      inputArea.style.opacity = "1";
      inputArea.style.pointerEvents = "auto";
      document.getElementById("answer-input").focus();
    } 
    else if (response.stage === "final") {
      UI.addMessage("Thank you for your responses. Generating your final dashboard...", "system");
      
      // Stop webcam stream when moving to dashboard
      if(activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }

      setTimeout(() => {
        UI.renderDashboard(container, response.final_dashboard);
      }, 1500);
    }
    
  }, 1500); // 1.5s thinking delay for realism
}
