class SmartInterviewSystem {
  constructor() {
    this.candidate = null;
    this.currentScore = 0;
    this.totalAttempts = 0;
    this.maxQuestions = 5;
    this.currentQuestion = 0;
    
    // Question banks based on field/type
    this.questions = [
      "Could you start by explaining one of your most challenging technical projects?",
      "How do you handle disagreements within a team setting?",
      "Can you describe a time you had to learn a completely new technology under a tight deadline?",
      "Design a scalable web architecture for a high-traffic e-commerce platform. What are the key components?",
      "What is your approach to code reviewing, and what do you specifically look for?"
    ];
  }

  // Parses Candidate Input and returns the initial JSON
  initialize(candidateData) {
    this.candidate = candidateData;
    this.currentQuestion = 1;
    this.currentScore = 0;
    
    return {
      "stage": "start",
      "question": `Hello ${this.candidate.name}, welcome to your interview. Based on your resume, I see you have ${this.candidate.level} experience in ${this.candidate.field}. Could you start by giving me a brief self-introduction and highlighting your key projects?`,
      "question_type": "self_intro",
      "difficulty": "medium",
      "user_input_mode": this.candidate.mode,
      "analysis": null,
      "feedback": {
        "strengths": "",
        "weaknesses": "",
        "improvements": ""
      },
      "score": {
        "current_score": 0,
        "total_score": 0
      },
      "progress": {
        "current_question": this.currentQuestion,
        "total_questions": this.maxQuestions
      },
      "next_action": "ask_next",
      "final_dashboard": null
    };
  }

  // Evaluates answer and returns next JSON
  processAnswer(answer) {
    // Mock Evaluation Logic
    const lengthScore = Math.min(answer.length / 50, 10);
    const confidence = Math.max(70, Math.floor(Math.random() * 30 + 70)); // Random 70-100
    const techScore = Math.floor(Math.random() * 40 + 60);

    const answerQuality = Math.floor((lengthScore * 3 + confidence + techScore) / 3);
    
    this.currentScore += answerQuality;
    this.currentQuestion += 1;

    let stage = this.currentQuestion > this.maxQuestions ? "final" : "questioning";
    let next_action = stage === "final" ? "finish" : "ask_next";

    let response = {
      "stage": stage,
      "question": stage === "final" ? "" : this.questions[(this.currentQuestion - 2) % this.questions.length],
      "question_type": stage === "final" ? "" : "technical",
      "difficulty": answerQuality > 80 ? "high" : "medium",
      "user_input_mode": this.candidate.mode,
      
      "analysis": {
        "answer_quality": answerQuality,
        "confidence_level": confidence,
        "communication_score": confidence,
        "technical_score": techScore,
        "emotion_detected": confidence > 85 ? "confident" : "neutral"
      },
      
      "feedback": {
        "strengths": answerQuality > 75 ? "Clear communication, solid technical details." : "Good attempt at explaining.",
        "weaknesses": answerQuality < 75 ? "Lacked deeper technical depth." : "None major.",
        "improvements": "Make sure to frame your answers using the STAR format."
      },
      
      "score": {
        "current_score": answerQuality,
        "total_score": Math.floor(this.currentScore / (this.currentQuestion - 1))
      },
      
      "progress": {
        "current_question": Math.min(this.currentQuestion, this.maxQuestions),
        "total_questions": this.maxQuestions
      },
      
      "next_action": next_action,
      "final_dashboard": null
    };

    if (stage === "final") {
      const finalScore = Math.floor(this.currentScore / this.maxQuestions);
      let verdict = "Not Ready";
      if (finalScore >= 80) verdict = "Selected";
      else if (finalScore >= 65) verdict = "Needs Improvement";

      response.final_dashboard = {
        "overall_score": finalScore,
        "confidence_analysis": finalScore > 75 ? "The candidate showed high confidence." : "Candidate appeared a bit nervous.",
        "technical_analysis": "Demonstrated a good understanding of core concepts but struggled slightly with edge cases.",
        "communication_analysis": "Clear and structured responses overall.",
        "strong_areas": "Project explanation, System Design basics",
        "weak_areas": "Deep dives into algorithms",
        "improvement_suggestions": "Practice Mock Interviews, focus on detailing 'Impact' in projects.",
        "final_verdict": verdict
      };
    }

    return response;
  }
}
