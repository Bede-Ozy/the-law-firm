import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { soundManager } from "../utils/audioManager";

const EXHIBIT_DATA = {
  A: {
    id: "A",
    title: "Exhibit A — Item Classification",
    correctAnswers: ["BOOK", "A BOOK"],
    openingMsg: "Exhibit A is hereby admitted. Counsel is required to establish the classification of the item before this Court.",
    hintMsg: "The Court reminds Counsel that evidence may take many forms, not all of them physical. It has pages, yet is not a calendar.",
    successMsg: "Classification confirmed. The Court records this as a Literary Artifact. Proceed to the next exhibit.",
  },
  B: {
    id: "B",
    title: "Exhibit B — Author Identification",
    correctAnswers: ["CHELUCHI ONYEMELUKWE-ONUOBIA", "CHELUCHI ONYEMELUKWE ONUOBIA"],
    openingMsg: "The Court now turns to matters of authorship. Counsel must identify the creator of the submitted work.",
    hintMsg: "The Court notes: authorship is often reflected in profession, origin, and thematic intent. Look for a Nigerian author with initials C.O.O.",
    successMsg: "Author identity established beyond reasonable doubt. Record updated: Cheluchi Onyemelukwe-Onuobia.",
  },
  C: {
    id: "C",
    title: "Exhibit C — Title Reconstruction",
    correctAnswers: ["THE SON OF THE HOUSE"],
    openingMsg: "The Court now examines the structure of the title. Counsel is to reconstruct the full title from the evidence provided.",
    hintMsg: "Titles, like testimony, often reveal their meaning through structure. Five words. Starts with 'THE', ends with 'HOUSE'.",
    successMsg: "The literary title has been conclusively identified. Entry recorded: THE SON OF THE HOUSE.",
  },
  D: {
    id: "D",
    title: "Exhibit D — False Accusation Analysis",
    correctAnswers: ["NO", "INNOCENT", "NOT GUILTY"],
    openingMsg: "The Court now examines the accusation against the suspect. Counsel must determine whether reasonable doubt exists.",
    hintMsg: "In criminal matters, certainty is not required. Proof is. Review the suspect's habits, their connection to Harry Potter, and fantasy recall.",
    successMsg: "Reasonable doubt has been established. The accused is hereby discharged from suspicion.",
  },
  E: {
    id: "E",
    title: "Exhibit E — Sender Identification",
    correctAnswers: ["BEDE"],
    openingMsg: "A matter of origin now comes before the Court. Counsel must identify the source of the transmission.",
    hintMsg: "The Court notes patterns of proximity, association, and prior conduct. He supports Chelsea FC, works in Abuja, and knows Abigail.",
    successMsg: "Identity of the sender has been established. The Court records this name into the case file.",
  },
  F: {
    id: "F",
    title: "Exhibit F — Custodian Identification",
    correctAnswers: ["JAYKEN"],
    openingMsg: "The Court now addresses custody of the evidence. Counsel must determine who holds the artifact.",
    hintMsg: "Custody is not ownership. Custody is responsibility. The custodian is younger than the defendant and lives in the same household.",
    successMsg: "Custodial authority confirmed. Retrieval is hereby authorized.",
  }
};

const OBJECTIONS = [
  "Objection sustained.",
  "The Court finds this submission insufficient.",
  "Counsel is advised to reconsider the evidence presented.",
  "Invalid petition. This evidence does not match our records.",
  "Submission rejected. Re-evaluate the clues, Counsel."
];

export const useGameStore = create(
  persist(
    (set, get) => ({
      currentExhibitId: "A",
      completedExhibits: [],
      answers: { A: "", B: "", C: "", D: "", E: "", F: "" },
      errorCount: 0,
      caseStatus: "OPEN",
      judgeMessage: EXHIBIT_DATA.A.openingMsg,
      isMuted: false,
      volumeAmbience: 0.25,
      volumeSFX: 0.5,
      isAmbiencePlaying: true,
      playerName: "",
      playerGender: "",

      setPlayerInfo: (name, gender) => {
        set({ playerName: name, playerGender: gender });
      },

      // Initialize Sound Settings from stored state
      initAudio: () => {
        const state = get();
        soundManager.setMuted(state.isMuted);
        soundManager.setAmbienceVolume(state.volumeAmbience);
        soundManager.setSFXVolume(state.volumeSFX);
        if (state.isAmbiencePlaying) {
          soundManager.startAmbience();
        }
      },

      toggleMute: () => {
        const nextMuted = !get().isMuted;
        soundManager.setMuted(nextMuted);
        set({ isMuted: nextMuted });
      },

      setVolumeAmbience: (vol) => {
        soundManager.setAmbienceVolume(vol);
        set({ volumeAmbience: vol });
      },

      setVolumeSFX: (vol) => {
        soundManager.setSFXVolume(vol);
        set({ volumeSFX: vol });
      },

      toggleAmbience: () => {
        const playing = get().isAmbiencePlaying;
        if (playing) {
          soundManager.stopAmbience();
        } else {
          soundManager.startAmbience();
        }
        set({ isAmbiencePlaying: !playing });
      },

      setJudgeMessage: (msg) => {
        set({ judgeMessage: msg });
      },

      submitAnswer: (exhibitId, answerText) => {
        const normalizedInput = answerText.trim().toUpperCase();
        const data = EXHIBIT_DATA[exhibitId];
        
        if (!data) return { success: false };

        const isCorrect = data.correctAnswers.some(ans => normalizedInput === ans);

        if (isCorrect) {
          // Play success chime
          soundManager.playSuccess();

          // Mark exhibit as completed
          const updatedCompleted = get().completedExhibits.includes(exhibitId)
            ? get().completedExhibits
            : [...get().completedExhibits, exhibitId];

          // Store answer
          const updatedAnswers = { ...get().answers, [exhibitId]: answerText.trim() };

          // Determine next step
          const exhibitKeys = Object.keys(EXHIBIT_DATA);
          const currentIndex = exhibitKeys.indexOf(exhibitId);
          const nextIndex = currentIndex + 1;
          const nextExhibitId = exhibitKeys[nextIndex] || null;

          if (nextExhibitId) {
            // Unlocking next stage
            set({
              completedExhibits: updatedCompleted,
              answers: updatedAnswers,
              judgeMessage: data.successMsg,
            });

            // Delay transitioning to next tab to let success message sink in
            setTimeout(() => {
              const nextData = EXHIBIT_DATA[nextExhibitId];
              set({
                currentExhibitId: nextExhibitId,
                judgeMessage: nextData.openingMsg
              });
              soundManager.playRustle();
            }, 3200);
          } else {
            // Case solved!
            set({
              completedExhibits: updatedCompleted,
              answers: updatedAnswers,
              judgeMessage: data.successMsg,
              caseStatus: "CLOSED"
            });
          }

          return { success: true };
        } else {
          // Play error buzzer and visual shake
          soundManager.playError();

          // Select random objection message
          const randomObjection = OBJECTIONS[Math.floor(Math.random() * OBJECTIONS.length)];
          set((state) => ({
            errorCount: state.errorCount + 1,
            judgeMessage: randomObjection
          }));

          // Revert back to opening or hint message after a brief display of the objection
          setTimeout(() => {
            if (get().currentExhibitId === exhibitId) {
              set({ judgeMessage: EXHIBIT_DATA[exhibitId].hintMsg });
            }
          }, 3500);

          return { success: false };
        }
      },

      setCurrentExhibit: (exhibitId) => {
        // Only allow switching to completed or first unlocked exhibit
        const completed = get().completedExhibits;
        const currentIdx = Object.keys(EXHIBIT_DATA).indexOf(exhibitId);
        
        // Allowed if it's completed, or it's the current active locked one
        const isFirstUnlocked = completed.length === currentIdx;
        const isCompleted = completed.includes(exhibitId);

        if (isCompleted || isFirstUnlocked) {
          set({
            currentExhibitId: exhibitId,
            judgeMessage: EXHIBIT_DATA[exhibitId].openingMsg
          });
          soundManager.playRustle();
        }
      },

      resetGame: () => {
        set({
          currentExhibitId: "A",
          completedExhibits: [],
          answers: { A: "", B: "", C: "", D: "", E: "", F: "" },
          errorCount: 0,
          caseStatus: "OPEN",
          judgeMessage: EXHIBIT_DATA.A.openingMsg
        });
        soundManager.playRustle();
      }
    }),
    {
      name: "law-firm-game-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist game progression data, not playing states to avoid autoplay blocks
      partialize: (state) => ({
        currentExhibitId: state.currentExhibitId,
        completedExhibits: state.completedExhibits,
        answers: state.answers,
        errorCount: state.errorCount,
        caseStatus: state.caseStatus,
        isMuted: state.isMuted,
        volumeAmbience: state.volumeAmbience,
        volumeSFX: state.volumeSFX,
        playerName: state.playerName,
        playerGender: state.playerGender,
      }),
    }
  )
);

export { EXHIBIT_DATA };
