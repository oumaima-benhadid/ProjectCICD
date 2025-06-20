import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoachService } from 'src/app/services/coach.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-coach-chat',
  templateUrl: './coach-chat.component.html',
  styleUrls: ['./coach-chat.component.css']
})
export class CoachChatComponent implements OnInit {
  message = '';
  chatHistory: { question: string; response: string }[] = [];
  typedResponse = '';
  isLoading = false;

  @ViewChild('chatBox') chatBox!: ElementRef;

  speechEnabled = true;
  isListening = false;
  recognition: any = null;

  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;

  constructor(private coachService: CoachService,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initVoices();
    this.setupSpeechRecognition();
    this.loadHistory();
  }

  initVoices(): void {
    this.voices = window.speechSynthesis.getVoices();
    this.selectedVoice = this.voices.find(v => v.lang === 'fr-FR') || null;
    window.speechSynthesis.onvoiceschanged = () => this.initVoices();
  }

  setupSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('⚠️ SpeechRecognition non supporté');
      return;
    }
  
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = false;
  
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎤 Transcription :", transcript);
      this.askCoach(transcript);
    };
  
    this.recognition.onspeechstart = () => console.log('🎙️ Détection de parole...');
    this.recognition.onspeechend = () => {
      console.log('🛑 Fin de parole.');
      this.recognition.stop();
    };
  
    this.recognition.onerror = (e: any) => {
      this.isListening = false;
      if (e.error === 'no-speech') {
        alert("⚠️ Aucune voix détectée. Veuillez parler plus fort.");
      } else {
        alert("❌ Erreur vocale : " + e.error);
      }
    };
  
    this.recognition.onend = () => this.isListening = false;
  }
  downloadPdf(): void {
    this.coachService.downloadPdfHistory().then(() => {
      this.toastr.success('PDF téléchargé avec succès ✅');
    });
  }
  isDarkMode = false;

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }
  
  
  

  toggleListening(): void {
    if (!this.recognition) return;
    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
    this.isListening = !this.isListening;
  }

  toggleSpeech(): void {
    this.speechEnabled = !this.speechEnabled;
    if (!this.speechEnabled) window.speechSynthesis.cancel();
  }

  askCoach(text?: string): void {
    const question = (text ?? this.message).trim();
    if (!question) return;

    this.message = '';
    this.isLoading = true;
    this.typedResponse = '';
    this.chatHistory.push({ question, response: '⏳ Réponse en cours...' });
    this.scrollToBottom();

    this.coachService.askQuestion(question).subscribe({
      next: (response) => this.animateTyping(question, response),
      error: () => {
        const fallback = 'Erreur du serveur 😢';
        this.chatHistory.push({ question, response: fallback });
        if (this.speechEnabled) this.speak(fallback);
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }
  analyzeEmotions(): void {
    this.coachService.getEmotions().subscribe({
      next: (stats) => {
        this.toastr.info(`Motivation: ${stats.motivation}% | Stress: ${stats.stress}% | Tristesse: ${stats.sadness}%`, 'Score Émotionnel 🧠');
      },
      error: () => {
        this.toastr.error("Erreur lors de l'analyse émotionnelle.");
      }
    });
  }
  
  animateTyping(question: string, response: string) {
    let index = 0;
    this.typedResponse = '';
    const typingSpeed = 20;

    const interval = setInterval(() => {
      if (index < response.length) {
        this.typedResponse += response.charAt(index++);
      } else {
        clearInterval(interval);
        this.chatHistory[this.chatHistory.length - 1].response = this.typedResponse;
        if (this.speechEnabled) this.speak(this.typedResponse);
        this.typedResponse = '';
        this.isLoading = false;
        this.scrollToBottom();
      }
    }, typingSpeed);
  }

  speak(text: string): void {
    if (!this.speechEnabled || !text) {
      window.speechSynthesis.cancel();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    window.speechSynthesis.speak(utterance);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const el = this.chatBox?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  loadHistory(): void {
    this.coachService.getHistory().subscribe(history => {
      this.chatHistory = history.reverse();
      this.scrollToBottom();
    });
  }


}
