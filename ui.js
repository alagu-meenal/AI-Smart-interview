const UI = {
  renderHomeStage: (container, onUpload) => {
    container.innerHTML = `
      <div class="glass-panel animate-fade-in" style="margin: 0 auto; text-align: center; max-width: 600px;">
        <h1 style="font-size: 3.5rem; margin-bottom: 2rem; background: linear-gradient(135deg, var(--secondary), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Smart AI Interview
        </h1>
        <p style="margin-bottom: 3rem; font-size: 1.1rem;">
          Experience the future of hiring. Upload your resume to begin your personalized, AI-driven assessment.
        </p>

        <div class="upload-container">
          <label for="resume-upload" class="btn" style="cursor: pointer;">
            <svg style="width:24px;height:24px;margin-right:10px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13.5,16V19H10.5V16H8L12,12L16,16H13.5M13,9V3.5L18.5,9H13Z" />
            </svg>
            Upload Resume (PDF/DOCX)
          </label>
          <input type="file" id="resume-upload" accept=".pdf,.doc,.docx,.txt" style="display: none;">
        </div>
      </div>
    `;

    document.getElementById("resume-upload").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        onUpload(file);
      }
    });
  },

  renderSetupForm: (container, onSubmit) => {
    container.innerHTML = `
      <div class="glass-panel animate-fade-in" style="max-width: 600px; margin: 0 auto;">
        <h1>Interview Configuration</h1>
        <p style="text-align: center; margin-bottom: 2rem;">Please verify your details and preferences. <br><span style="color:var(--warning); font-size:0.85rem;">Camera access will be required in the next step.</span></p>
        
        <form id="setup-form">
          <div class="form-group">
            <label>Candidate Name</label>
            <input type="text" id="name" required placeholder="e.g. John Doe" value="Alice">
          </div>
          
          <div class="form-group">
            <label>Job Field</label>
            <input type="text" id="field" required placeholder="e.g. Software Engineering" value="Software Engineering">
          </div>
          
          <div class="form-group">
            <label>Experience Level</label>
            <select id="level">
              <option value="low">Low (0-2 years)</option>
              <option value="medium" selected>Medium (3-5 years)</option>
              <option value="high">High (5+ years)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Interview Type</label>
            <select id="type">
              <option value="self_intro">Self Introduction</option>
              <option value="technical">Technical</option>
              <option value="mixed" selected>Mixed</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Mode</label>
            <select id="mode">
              <option value="text" selected>Text</option>
              <option value="voice" disabled>Voice (Coming soon)</option>
            </select>
          </div>
          
          <button type="submit" class="btn">Proceed & Grant Camera Access</button>
        </form>
      </div>
    `;

    document.getElementById("setup-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("name").value,
        field: document.getElementById("field").value,
        level: document.getElementById("level").value,
        type: document.getElementById("type").value,
        mode: document.getElementById("mode").value,
        resume_text: "Parsed from file upload" // simulated
      };
      onSubmit(data);
    });
  },

  renderInterviewScreen: (container, progress, onAnswerSubmit) => {
    container.innerHTML = `
      <div class="view-wrapper animate-fade-in" style="display:flex; gap: 2rem; align-items: flex-start; justify-content: center; width:100%;">
        <div class="glass-panel" style="flex: 1; max-width: 800px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2>Live Interview</h2>
            <span style="color: var(--secondary)">Question <span id="q-curr">${progress.current_question}</span> / <span id="q-max">${progress.total_questions}</span></span>
          </div>
          
          <div class="progress-container">
            <div class="progress-bar" id="progress-bar" style="width: ${(progress.current_question / progress.total_questions) * 100}%"></div>
          </div>

          <div class="chat-container">
            <div class="chat-history" id="chat-history"></div>
            
            <div class="chat-input-area">
              <textarea id="answer-input" placeholder="Type your answer here..." onkeydown="if(event.key === 'Enter' && !event.shiftKey){ event.preventDefault(); document.getElementById('submit-ans').click(); }"></textarea>
              <button class="btn" id="submit-ans">Submit</button>
            </div>
          </div>
        </div>

        <div class="webcam-container glass-panel">
          <video id="webcam" autoplay muted playsinline class="webcam-feed"></video>
          <div class="webcam-overlay">
            <span class="recording-dot"></span> Tracking Confidence...
          </div>
        </div>
      </div>
    `;

    document.getElementById("submit-ans").addEventListener("click", () => {
      const input = document.getElementById("answer-input");
      const answer = input.value.trim();
      if (answer) {
        UI.addMessage(answer, "user");
        input.value = "";
        onAnswerSubmit(answer);
      }
    });
  },

  addMessage: (text, sender) => {
    const history = document.getElementById("chat-history");
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message chat-${sender}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    history.appendChild(msgDiv);
    history.scrollTop = history.scrollHeight;
  },

  showTyping: () => {
    const history = document.getElementById("chat-history");
    const div = document.createElement("div");
    div.className = "chat-system typing-indicator";
    div.id = "typing-indicator";
    div.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
  },

  removeTyping: () => {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
  },

  updateProgress: (progress) => {
    document.getElementById("q-curr").textContent = progress.current_question;
    document.getElementById("progress-bar").style.width = `${(progress.current_question / progress.total_questions) * 100}%`;
  },

  renderDashboard: (container, data) => {
    let verdictClass = data.final_verdict.split(' ')[0]; // E.g., 'Selected', 'Needs'
    
    container.innerHTML = `
      <div class="glass-panel animate-fade-in" style="width: 100%;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1>Interview Results</h1>
          <div class="verdict-tag verdict-${verdictClass}" style="margin-top: 1rem;">
            ${data.final_verdict}
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="stat-card">
            <div class="stat-value">${data.overall_score}%</div>
            <div>Overall Score</div>
          </div>
          <div class="stat-card" style="background: rgba(0,230,118, 0.1); border-color: rgba(0,230,118,0.2);">
            <div class="stat-value" style="background: var(--success); -webkit-background-clip: text;">Strengths</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; color: #fff;">${data.strong_areas}</div>
          </div>
          <div class="stat-card" style="background: rgba(255,23,68, 0.1); border-color: rgba(255,23,68,0.2);">
            <div class="stat-value" style="background: var(--danger); -webkit-background-clip: text;">Weaknesses</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; color: #fff;">${data.weak_areas}</div>
          </div>
        </div>

        <div class="feedback-section">
          <h3>Detailed Analysis</h3>
          <p><strong>Communication:</strong> ${data.communication_analysis}</p>
          <p><strong>Technical:</strong> ${data.technical_analysis}</p>
          <p><strong>Confidence:</strong> ${data.confidence_analysis}</p>
          <p><strong>Suggestions:</strong> ${data.improvement_suggestions}</p>
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn" style="max-width: 250px;" onclick="window.location.reload()">Start New Session</button>
        </div>
      </div>
    `;
  }
};
