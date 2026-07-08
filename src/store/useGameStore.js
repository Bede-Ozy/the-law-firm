import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { soundManager } from "../utils/audioManager";

const CASE_DATA = {
  "001": {
    id: "001",
    number: "No. 001",
    title: "The Anonymous Transmission",
    description: "An encrypted packet of pages has been intercepted at the partner's desk. You are assigned to audit the files and establish identity.",
    clientName: "Shola",
    briefing: [
      {
        speaker: "client",
        text: "Counsel, thank goodness you've agreed to hear this matter.\n\nA close associate of mine has become entangled in an investigation, and I fear the authorities may be pursuing the wrong person.\n\nThe case has been moving quickly, and from everything I've heard so far, the conclusions seem to be arriving much faster than the facts."
      },
      {
        speaker: "lawyer",
        text: "Take a moment and start from the beginning. What exactly is under investigation, and why has it attracted the Court's attention?"
      },
      {
        speaker: "client",
        text: "The authorities are calling it \"The Anonymous Transmission.\" That's all anyone seems willing to say with certainty.\n\nFragments of information have been recovered, but the records are incomplete. Nobody appears able to agree on where the transmission originated, who created it, or even what it actually is."
      },
      {
        speaker: "lawyer",
        text: "And despite all of that uncertainty, someone has already been accused?"
      },
      {
        speaker: "client",
        text: "That's what troubles me. Investigators believe the recovered fragments point toward a particular individual, and that assumption appears to have driven the entire case.\n\nBut every time I hear a new detail, I become less convinced they truly understand what they're dealing with."
      },
      {
        speaker: "lawyer",
        text: "Then the accusation may be built upon conclusions rather than evidence. What materials has the Court provided for examination?"
      },
      {
        speaker: "client",
        text: "A docket of exhibits. Each exhibit contains information recovered during the investigation.\n\nThe Court believes the truth can be reconstructed from those records, but no one has yet managed to piece everything together."
      },
      {
        speaker: "lawyer",
        text: "Then our task is straightforward, even if it is not simple. Before responsibility can be assigned, the facts themselves must be established.\n\nWe must determine the nature of the transmission, identify its creator, reconstruct its proper title, and examine the accusation against the suspect.\n\nOnly after those matters have been resolved can questions of origin and custody be addressed with any confidence."
      },
      {
        speaker: "client",
        text: "That's precisely why I came to you.\n\nIf anyone can make sense of this case, it will be the person willing to follow the evidence wherever it leads rather than where assumptions would prefer it to go."
      },
      {
        speaker: "lawyer",
        text: "Very well.\n\nLet us see whether the evidence supports the accusation—or whether the accusation has been standing on borrowed ground from the very beginning."
      },
      {
        speaker: "client",
        text: "The exhibits are ready, Counsel. Proceedings are about to begin."
      },
      {
        speaker: "lawyer",
        text: "Then let's begin."
      }
    ],
    verdict: {
      bookCoverKey: "001",
      certificateTitle: "Admitted to the Bar of Cases",
      certificateDescription: "This document certifies that the named Counsel has successfully resolved the encrypted case files of the Anonymous Transmission, recovered the literary work THE SON OF THE HOUSE, and identified the transmission source.",
      judgeName: "L.J. BEDE",
      archivistName: "JEKEN COURT",
      script: [
        { text: "Counsel, step forward...", delay: 800 },
        { text: "All exhibits have been examined. Testimonies reviewed. Evidence weighed.", delay: 800 },
        { text: "The Court now delivers its final ruling.", delay: 800 },
        { text: "The anonymous literary artifact is hereby identified as:", delay: 800 },
        { text: "THE SON OF THE HOUSE", isHighlight: true, isBig: true, sound: "boom", delay: 1500 },
        { text: "The origin of transmission has been established.", delay: 800 },
        { text: "BEDE", isHighlight: true, sound: "success", delay: 1200 },
        { text: "The Court hereby authorizes immediate retrieval of Exhibit A.", delay: 800 },
        { text: "Custody lies with Officer Jeken.", delay: 1200 },
        { text: "This case is hereby closed.", delay: 800 },
        { text: "Case File No. 001 is concluded.", delay: 800 },
        { text: "Counsel has demonstrated satisfactory investigative ability.", delay: 800 },
        { text: "The Court acknowledges this as your first brief. Proceed with confidence.", delay: 1000 },
        { text: "Court stands adjourned.", sound: "final_stamp", delay: 1500 }
      ]
    },
    exhibits: {
      A: {
        id: "A",
        title: "Exhibit A — Item Classification",
        ledgerLabel: "Classification",
        correctAnswers: ["BOOK", "A BOOK"],
        openingMsg: "Exhibit A is hereby admitted. Counsel is required to establish the classification of the item before this Court.",
        hintMsg: "The Court reminds Counsel that evidence may take many forms, not all of them physical. It has pages, yet is not a calendar.",
        successMsg: "Classification confirmed. The Court records this as a Literary Artifact. Proceed to the next exhibit.",
        clueLines: [
          "Item 01: “It contains many voices, yet speaks with only one.”",
          "Item 02: “It travels through time, yet never takes a step.”",
          "Item 03: “It may be opened, but it is not a door.”"
        ]
      },
      B: {
        id: "B",
        title: "Exhibit B — Author Identification",
        ledgerLabel: "Author",
        correctAnswers: ["CHELUCHI ONYEMELUKWE-ONUOBIA", "CHELUCHI ONYEMELUKWE ONUOBIA"],
        openingMsg: "The Court now turns to matters of authorship. Counsel must identify the creator of the submitted work.",
        hintMsg: "The Court notes: authorship is often reflected in profession, origin, and thematic intent. Look for a Nigerian author with initials C.O.O. from the South-Eastern region.",
        successMsg: "Author identity established beyond reasonable doubt. Record updated: Cheluchi Onyemelukwe-Onuobia.",
        clueLines: [
          "Nationality: Nigerian",
          "Academic Origin: Professor of Law",
          "Institution: Babcock University",
          "Thematic Focus: Hidden Truths, Women, Family History",
          "Dossier Initials: C.O.O.",
          "Region: South-Eastern"
        ]
      },
      C: {
        id: "C",
        title: "Exhibit C — Title Reconstruction",
        ledgerLabel: "Title",
        correctAnswers: ["THE SON OF THE HOUSE"],
        openingMsg: "The Court now examines the structure of the title. Counsel is to reconstruct the full title from the evidence provided.",
        hintMsg: "Titles, like testimony, often reveal their meaning through structure. Five words. Starts with 'THE', ends with 'HOUSE'.",
        successMsg: "The literary title has been conclusively identified. Entry recorded: THE SON OF THE HOUSE.",
        clueLines: [
          "Total Title Structure: Five words.",
          "Bounds: Starts with 'THE', finishes with 'HOUSE'.",
          "Thematic note: The central subject is neither a king nor a father."
        ]
      },
      D: {
        id: "D",
        title: "Exhibit D — False Accusation Analysis",
        ledgerLabel: "Accused",
        correctAnswers: ["NOT GUILTY"],
        openingMsg: "The Court has reviewed the interrogation transcript and supporting verification report. Counsel is hereby directed to identify the findings which support the accused's claim of innocence. Select all findings supported by the evidence.",
        hintMsg: "The Court directs Counsel to review the interrogation record. Select only findings directly corroborated by the text.",
        successMsg: "The Court finds the selected findings consistent with the evidence presented. The accused demonstrates a documented preference for non-fiction material, exhibits limited familiarity with fantasy literature, and lacks any verified connection to the anonymous transmission. Reasonable doubt has therefore been established. The accused is discharged from suspicion.",
        clueLines: []
      },
      E: {
        id: "E",
        title: "Exhibit E — Sender Identification",
        ledgerLabel: "Sender",
        correctAnswers: ["BEDE"],
        openingMsg: "A matter of origin now comes before the Court. Counsel must identify the source of the transmission.",
        hintMsg: "The Court notes patterns of proximity, association, and prior conduct. He supports Chelsea FC, works in Abuja, and knows Abigail.",
        successMsg: "Identity of the sender has been established. The Court records this name into the case file.",
        clueLines: [
          "Location context: Based in Abuja capital district.",
          "Sports details: Fanatical Chelsea FC supporter.",
          "Association: Co-worker in same school system TBRA.",
          "Mutual Acquaintance: Abigail.",
          "Observed behavior: Has blue blood and is deeply linked with King Leo of Argentina (10)."
        ]
      },
      F: {
        id: "F",
        title: "Exhibit F — Custodian Identification",
        ledgerLabel: "Custodian",
        correctAnswers: ["JEKEN"],
        openingMsg: "The Court now addresses custody of the evidence. Counsel must determine who holds the artifact.",
        hintMsg: "Custody is not ownership. Custody is responsibility. The custodian is younger than the defendant and lives in the same household.",
        successMsg: "Custodial authority confirmed. Retrieval is hereby authorized.",
        clueLines: [
          "“The book is in safe custody.”",
          "“The custodian lives in the same household as the Counsel.”",
          "“The custodian is younger than the Counsel.”"
        ]
      }
    }
  },
  "002": {
    id: "002",
    number: "No. 002",
    title: "The Gilded Ledger",
    description: "A mysterious double-ledger containing transactions from an offshore account. Audit access pending senior partner approval.",
    clientName: "Audit Officer",
    briefing: [
      {
        speaker: "client",
        text: "Counsel, I am glad you responded. The senior board is preparing to press charges against our primary treasury auditor for diverting corporate funds offshore."
      },
      {
        speaker: "lawyer",
        text: "Corporate audits are usually cut and dry. What is the irregularity that caused you to call me?"
      },
      {
        speaker: "client",
        text: "They show a double ledger containing offshore deposits totaling 8 million dollars. The files claim the transactions were manually authorized by the suspect."
      },
      {
        speaker: "lawyer",
        text: "And the suspect denies authorization?"
      },
      {
        speaker: "client",
        text: "Completely. Furthermore, the authorization timestamps match a period when the suspect was on a transatlantic flight with no connectivity. I suspect the ledger is forged."
      },
      {
        speaker: "lawyer",
        text: "Interesting. A physical impossibility is a solid defense. What exhibits do we have?"
      },
      {
        speaker: "client",
        text: "The Gilded Ledger documents, signature authorization sheets, and IP route logs to the offshore destination shell companies."
      },
      {
        speaker: "lawyer",
        text: "We must check the asset discrepancy, identify the tax haven abbreviation, unmask the beneficiary alias, check signature integrity, and locate the backup drives."
      },
      {
        speaker: "client",
        text: "If we can prove the signature was forged and trace the actual perpetrator, we can clear the suspect's name."
      },
      {
        speaker: "lawyer",
        text: "We will establish the facts. Let's begin the review of the ledger logs."
      },
      {
        speaker: "client",
        text: "The brief is ready, Counsel. Proceedings are starting."
      },
      {
        speaker: "lawyer",
        text: "Let's begin."
      }
    ],
    verdict: {
      bookCoverKey: "002",
      certificateTitle: "Certified Forensic Auditor",
      certificateDescription: "This document certifies that the named Counsel has successfully audited the Gilded Ledger, traced the diverted offshore assets to the British Virgin Islands, exposed the secret beneficiary alias MIDAS, and apprehended the rogue accountant.",
      judgeName: "CHIEF JUSTICE VANCE",
      archivistName: "MARCUS TRUSTEE",
      script: [
        { text: "Counsel, step forward...", delay: 800 },
        { text: "All transaction logs and offshore ledgers have been audited. Flow of funds traced.", delay: 800 },
        { text: "The Court now delivers its final ruling on the offshore diversion.", delay: 800 },
        { text: "The secret beneficiary account alias is hereby unmasked as:", delay: 800 },
        { text: "MIDAS", isHighlight: true, isBig: true, sound: "boom", delay: 1500 },
        { text: "The tax haven destination has been established.", delay: 800 },
        { text: "BRITISH VIRGIN ISLANDS (BVI)", isHighlight: true, sound: "success", delay: 1200 },
        { text: "The Court hereby orders the immediate arrest of the rogue accountant.", delay: 800 },
        { text: "Suspect identity: Percy Smith.", delay: 1200 },
        { text: "This case is hereby closed.", delay: 800 },
        { text: "Case File No. 002 is concluded.", delay: 800 },
        { text: "Counsel has demonstrated exemplary auditing and investigative ability.", delay: 800 },
        { text: "The Court commends your execution under corporate secrecy pressure.", delay: 1000 },
        { text: "Court stands adjourned.", sound: "final_stamp", delay: 1500 }
      ]
    },
    exhibits: {
      A: {
        id: "A",
        title: "Exhibit A — Asset Discrepancy",
        ledgerLabel: "Asset Discrepancy",
        correctAnswers: ["8 MILLION", "8,000,000", "8000000"],
        openingMsg: "The Court requests Counsel to examine the ledger balance sheets. Establish the discrepancy between declared assets (50,000,000) and actual bank deposits (42,000,000).",
        hintMsg: "A simple subtraction of actual deposits from declared assets will reveal the diverted sum.",
        successMsg: "Asset discrepancy confirmed at 8 Million. Discrepancy logged into official records.",
        clueLines: [
          "Declared Assets on sheet: 50,000,000.",
          "Actual Vault bank deposits: 42,000,000.",
          "Deduction: Calculate the difference to find the missing funds."
        ]
      },
      B: {
        id: "B",
        title: "Exhibit B — Offshore Haven Identification",
        ledgerLabel: "Offshore Haven",
        correctAnswers: ["BVI", "BRITISH VIRGIN ISLANDS"],
        openingMsg: "The Court directs Counsel to trace the shell corporation's region initials 'V.I.G.' referenced in the invoice.",
        hintMsg: "This tax haven is a classic British Overseas Territory in the Caribbean, commonly abbreviated as BVI.",
        successMsg: "Destination confirmed: British Virgin Islands (BVI). Shell register locked.",
        clueLines: [
          "Incorporation stamp initials: V.I.G.",
          "Region: British Overseas Territory in the Caribbean.",
          "Common abbreviation is 3 letters."
        ]
      },
      C: {
        id: "C",
        title: "Exhibit C — Owner Alias Extraction",
        ledgerLabel: "Owner Alias",
        correctAnswers: ["MIDAS"],
        openingMsg: "The Court requests Counsel to identify the secret beneficiary alias uncovered in the ledger metadata.",
        hintMsg: "The alias refers to a legendary king whose touch turned everything to gold. Five letters.",
        successMsg: "Alias identified: MIDAS. Beneficiary identity added to the indictment briefing.",
        clueLines: [
          "Offshore account beneficial title: Restricted.",
          "Registry metadata author tag: 'Everything I touch turns to gold.'",
          "Enter the 5-letter legendary Greek king name."
        ]
      },
      D: {
        id: "D",
        title: "Exhibit D — Authorization Integrity Analysis",
        ledgerLabel: "Authorization Status",
        correctAnswers: ["FORGED", "NOT AUTHORIZED"],
        openingMsg: "The Court directs Counsel to verify the transaction authorization signatures. Was it authorized or forged?",
        hintMsg: "Review the logs: the client was on a transatlantic flight at the time of execution. Look for signs of tampering.",
        successMsg: "The Court agrees that transaction authorization was physically impossible and thus forged. The suspect is cleared of direct transfer authorization.",
        clueLines: [
          "Signature stamp timestamp: 14:30 GMT.",
          "Client whereabouts: Flight UA-72 over the Atlantic (no internet/offline status).",
          "Question: Is the transaction record AUTHORIZED or FORGED?"
        ]
      },
      E: {
        id: "E",
        title: "Exhibit E — Rogue Accountant Identification",
        ledgerLabel: "Rogue Accountant",
        correctAnswers: ["PERCY", "PERCY SMITH"],
        openingMsg: "The Court requests the identity of the rogue accountant with initials 'P.S.' who created the offshore registry.",
        hintMsg: "His first name starts with P and ends with y. Often associated with Jackson in popular lore.",
        successMsg: "Rogue accountant identified as Percy. Arrest warrant authorized.",
        clueLines: [
          "Registry header creator: P.S. (Senior Corporate Accountant).",
          "Initials match suspect Percy Smith.",
          "First name starts with P and ends with y (5 letters)."
        ]
      },
      F: {
        id: "F",
        title: "Exhibit F — Ledger Drive Custodian",
        ledgerLabel: "Ledger Custodian",
        correctAnswers: ["MARCUS"],
        openingMsg: "The Court requires Counsel to identify the custodian holding the safe deposit keys containing the backup drive.",
        hintMsg: "The custodian is the chief bank manager. His name starts with M and ends with s. Six letters.",
        successMsg: "Custodial key authorized. Chief Manager Marcus has been summoned to release the drives.",
        clueLines: [
          "Drives are locked inside the safe deposit vault.",
          "Keyholder: Chief Bank Manager of the Swiss branch.",
          "Name starts with M and ends with s (6 letters)."
        ]
      }
    }
  },
  "003": {
    id: "003",
    number: "No. 003",
    title: "The Midnight Alibi",
    description: "Physical evidence logs recovered from a safehouse. Verify forensic details to build defense pleadings.",
    clientName: "Marcus",
    briefing: [
      {
        speaker: "client",
        text: "Counsel, thank goodness. My brother has been arrested for a shooting that took place downtown near midnight. The police have a witness who swears they talked to him at the scene."
      },
      {
        speaker: "lawyer",
        text: "What does the forensic timeline say?"
      },
      {
        speaker: "client",
        text: "That's the key. The coroner's autopsy establishes the time of death at exactly 11:30 PM. There is no way the victim was alive at midnight."
      },
      {
        speaker: "lawyer",
        text: "So the witness statement is physically impossible, indicating perjury or a fabricated alibi. What materials has the forensics lab recovered?"
      },
      {
        speaker: "client",
        text: "We have ballistics reports, blood splatter dispersion velocities, and the cellular GPS tower tracking logs for that night."
      },
      {
        speaker: "lawyer",
        text: "Excellent. Forensic ballistics and cellular records do not lie under pressure. If we can disprove the alibi, the case will collapse."
      },
      {
        speaker: "client",
        text: "Please examine the files carefully. The rival firm has deep pockets and the instigator might be one of their executives."
      },
      {
        speaker: "lawyer",
        text: "We will check the bullet caliber, splatter mist velocity, tower location, perjury elements, and identify the mastermind. Rest assured."
      },
      {
        speaker: "client",
        text: "Thank you, Counsel. The Court is preparing the files."
      },
      {
        speaker: "lawyer",
        text: "Let's review the forensics."
      }
    ],
    verdict: {
      bookCoverKey: "003",
      certificateTitle: "Criminal Defense Advocate",
      certificateDescription: "This document certifies that the named Counsel has successfully dismantled the fabricated witness alibi, verified ballistics and autopsy parameters, and identified the true instigator and security custodian.",
      judgeName: "HONORABLE G. BRASS",
      archivistName: "GARRISON ARCHIVES",
      script: [
        { text: "Counsel, step forward...", delay: 800 },
        { text: "All crime scene ballistics, forensic splatter models, and GPS tower logs have been weighed.", delay: 800 },
        { text: "The Court now delivers its final ruling on the Midnight Alibi.", delay: 800 },
        { text: "The witness's alibi has been conclusively demolished by cellular records at:", delay: 800 },
        { text: "DOWNTOWN CELL TOWER", isHighlight: true, isBig: true, sound: "boom", delay: 1500 },
        { text: "The corporate rival behind the conspiracy has been identified.", delay: 800 },
        { text: "VICTOR VANCE", isHighlight: true, sound: "success", delay: 1200 },
        { text: "The Court orders the seizure of all unedited CCTV logs.", delay: 800 },
        { text: "Custodian of evidence: Officer Garrison.", delay: 1200 },
        { text: "This case is hereby closed.", delay: 800 },
        { text: "Case File No. 003 is concluded.", delay: 800 },
        { text: "Counsel has defended truth and established absolute reasonable doubt.", delay: 800 },
        { text: "Pleadings filed. Defense rests.", delay: 1000 },
        { text: "Court stands adjourned.", sound: "final_stamp", delay: 1500 }
      ]
    },
    exhibits: {
      A: {
        id: "A",
        title: "Exhibit A — Ballistics Classification",
        ledgerLabel: "Weapon Category",
        correctAnswers: ["38 CALIBER", "REVOLVER", "38 REVOLVER"],
        openingMsg: "The Court requests ballistics classification of the weapon recovered at the scene.",
        hintMsg: "A classic six-shot handgun firing .38 caliber rounds.",
        successMsg: "Handgun identified as a .38 Revolver. Weapon log updated.",
        clueLines: [
          "Bullet casing diameter: 9mm (.38 inches).",
          "Weapon type: Rotating 6-chamber cylinder.",
          "Identify the gun category."
        ]
      },
      B: {
        id: "B",
        title: "Exhibit B — Forensics Splatter Velocity",
        ledgerLabel: "Spatter Velocity",
        correctAnswers: ["HIGH VELOCITY", "HIGH"],
        openingMsg: "The Court requests forensic classification of the blood spatter pattern found at the crime scene.",
        hintMsg: "Splatter pattern sizes under 1mm suggest a high energy impact, such as a gunshot.",
        successMsg: "Pattern confirmed as High Velocity impact. Forensic timeline adjusted.",
        clueLines: [
          "Impact mist droplet size: < 1mm.",
          "Dispersion pattern: Fast aerosolized projection.",
          "Is this a HIGH or LOW velocity spatter?"
        ]
      },
      C: {
        id: "C",
        title: "Exhibit C — GPS Cell Tower Location",
        ledgerLabel: "GPS Location",
        correctAnswers: ["DOWNTOWN"],
        openingMsg: "The Court directs Counsel to trace the phone's tower registration at 11:30 PM.",
        hintMsg: "The tower covers the business district, located in the central part of the city. Starts with D.",
        successMsg: "GPS location verified: Downtown Tower. Alibi claims dismantled.",
        clueLines: [
          "SIM card registration node: Sector 4.",
          "Location node covers the corporate bank skyscraper district.",
          "Enter location (starts with D, e.g. Downtown)."
        ]
      },
      D: {
        id: "D",
        title: "Exhibit D — Autopsy Time Inconsistency",
        ledgerLabel: "Autopsy Timeline",
        correctAnswers: ["PERJURY", "LYING WITNESS"],
        openingMsg: "The Court requires analysis of the coroner's timeline. What crime did the witness commit?",
        hintMsg: "Coroner estimated death at 11:30 PM. Witness claims they had a conversation at midnight.",
        successMsg: "Witness statement ruled inconsistent due to physical impossibility. Perjury charges filed.",
        clueLines: [
          "Autopsy report: Rigor mortis began at 11:30 PM.",
          "Witness statement: 'I talked to him at 12:05 AM in the bar.'",
          "What crime is committed when a witness lies under oath?"
        ]
      },
      E: {
        id: "E",
        title: "Exhibit E — Instigator Identification",
        ledgerLabel: "Instigator",
        correctAnswers: ["VICTOR", "VICTOR VANCE"],
        openingMsg: "The Court requests the identity of the competitor who hired the rogue accountant.",
        hintMsg: "His name starts with V and ends with r. Six letters. Sounds like a winner.",
        successMsg: "Instigator identified: Victor. Conspiracy charges added.",
        clueLines: [
          "Conspiracy dossier wire origin: Victor Vance.",
          "Rival firm CEO behind the frame-up.",
          "First name starts with V and ends with r (6 letters)."
        ]
      },
      F: {
        id: "F",
        title: "Exhibit F — Escrow Security Custodian",
        ledgerLabel: "Security Custodian",
        correctAnswers: ["GARRISON"],
        openingMsg: "The Court requires Counsel to identify the security guard holding the unedited security footage tapes.",
        hintMsg: "The guard's name starts with G and ends with n. Double r in the middle. Eight letters.",
        successMsg: "Evidence admitted. Gavel sounds. Case closed.",
        clueLines: [
          "Clue: Custody guard holds CCTV files.",
          "Last name starts with G, ends with n, double r in the middle (8 letters)."
        ]
      }
    }
  },
  "004": {
    id: "004",
    number: "No. 004",
    title: "The Patents War",
    description: "A tech company's source code for a revolutionary AI assistant has been leaked. Trace the IP theft and identify the developer.",
    clientName: "Dr. Ada",
    briefing: [
      {
        speaker: "client",
        text: "Counsel, our server security has been breached. Someone has exfiltrated the source code repository of our core AI assistant project, 'Antigravity'."
      },
      {
        speaker: "lawyer",
        text: "Has the code been leaked, or is it an internal competitor trade threat?"
      },
      {
        speaker: "client",
        text: "It was uploaded to a server linked directly to our main rival, Halo Corp. The access logs show my personal SSH key was used to authorize the exfiltration."
      },
      {
        speaker: "lawyer",
        text: "But you did not authorize it?"
      },
      {
        speaker: "client",
        text: "No! I was in California. The server tracking logs show the key was used from an IP address in Russia within the same minute."
      },
      {
        speaker: "lawyer",
        text: "So we have a compromised developer key. We need to prove the key theft and trace the destination server coordinates."
      },
      {
        speaker: "client",
        text: "Exactly. I've prepared the exfiltration packets, network IP routing blocks, and SSH key logs for your analysis."
      },
      {
        speaker: "lawyer",
        text: "We will establish the exfiltrated artifact type, verify the target IP, identify the repository name, confirm key compromise, and find the safehouse admin."
      },
      {
        speaker: "client",
        text: "The future of our company depends on securing these patents. Thank you for taking this brief."
      },
      {
        speaker: "lawyer",
        text: "We will protect your trade secrets. Let's begin the review."
      }
    ],
    verdict: {
      bookCoverKey: "004",
      certificateTitle: "IP Litigation Specialist",
      certificateDescription: "This document certifies that the named Counsel has successfully resolved the Patent Infringement dispute, tracked the unauthorized server uploads, unmasked HALO CORP, and secured the Antigravity codebase.",
      judgeName: "JUSTICE A. TURING",
      archivistName: "ADA LOVELACE",
      script: [
        { text: "Counsel, step forward...", delay: 800 },
        { text: "All network packet traces and SSH key logs have been analyzed.", delay: 800 },
        { text: "The Court now delivers its final ruling on the Patents War.", delay: 800 },
        { text: "The destination server IP address has been verified as:", delay: 800 },
        { text: "192.168.1.100", isHighlight: true, isBig: true, sound: "boom", delay: 1500 },
        { text: "The corporate rival receiving the leaked assets has been identified.", delay: 800 },
        { text: "HALO CORP", isHighlight: true, sound: "success", delay: 1200 },
        { text: "The Court directs immediate recovery of the backup encryption key.", delay: 800 },
        { text: "Key custodian identity: Silas.", delay: 1200 },
        { text: "This case is hereby closed.", delay: 800 },
        { text: "Case File No. 004 is concluded.", delay: 800 },
        { text: "Counsel has successfully protected trade secrets and established security breaches.", delay: 800 },
        { text: "Patents secured. Case closed.", delay: 1000 },
        { text: "Court stands adjourned.", sound: "final_stamp", delay: 1500 }
      ]
    },
    exhibits: {
      A: {
        id: "A",
        title: "Exhibit A — IP Classification",
        ledgerLabel: "Artifact Type",
        correctAnswers: ["SOURCE CODE", "CODE", "ALGORITHM"],
        openingMsg: "The Court requests classification of the leaked intellectual property.",
        hintMsg: "It is written in high-level programming syntax, compiled but not executable as physical hardware. Under 11 letters.",
        successMsg: "IP classified: Source Code. Leak context updated.",
        clueLines: [
          "Leaked assets contain raw python code scripts.",
          "The files are human-readable commands for logic execution.",
          "Identify the asset class (2 words, e.g. Source Code)."
        ]
      },
      B: {
        id: "B",
        title: "Exhibit B — Target Server IP",
        ledgerLabel: "Server IP",
        correctAnswers: ["192.168.1.100"],
        openingMsg: "Counsel must identify the destination server where the code was uploaded.",
        hintMsg: "A standard IPv4 private network range address starting with 192.168.1. and ending with 100.",
        successMsg: "Server IP verified: 192.168.1.100. Server location locked.",
        clueLines: [
          "Exfiltration route IP packets traced.",
          "Private local class C subnet used.",
          "IPv4 address format starts with 192.168.1. and ends in 100."
        ]
      },
      C: {
        id: "C",
        title: "Exhibit C — Leaked Repository Name",
        ledgerLabel: "Repository Name",
        correctAnswers: ["ANTIGRAVITY", "PROJECT ANTIGRAVITY"],
        openingMsg: "Establish the internal project codename of the stolen AI assistant repository.",
        hintMsg: "Starts with ANTI- and relates to defeating gravity. 12 letters.",
        successMsg: "Repository name confirmed: ANTIGRAVITY.",
        clueLines: [
          "Internal codebase codename details.",
          "Project name represents floatation or zero gravity.",
          "Starts with ANTI- and ends with GRAVITY (12 letters)."
        ]
      },
      D: {
        id: "D",
        title: "Exhibit D — Developer Access Integrity",
        ledgerLabel: "Integrity Finding",
        correctAnswers: ["COMPROMISED KEY", "COMPROMISED SSH KEY"],
        openingMsg: "Analyze the SSH access logs. Identify the findings concerning the developer's credentials. Was it secure or compromised?",
        hintMsg: "Look at the logs: the SSH key was used from an IP address in Russia, while the developer was checking in from California.",
        successMsg: "The Court agrees that the developer's credentials were compromised via credential theft. Perjury or bad faith is ruled out.",
        clueLines: [
          "Developer login log: 10:15 AM from Mountain View, CA.",
          "SSH upload log: 10:16 AM from Moscow, Russia.",
          "Question: Is the developer key SECURE or COMPROMISED?"
        ]
      },
      E: {
        id: "E",
        title: "Exhibit E — Recipient Competitor Name",
        ledgerLabel: "Recipient",
        correctAnswers: ["HALO", "HALO CORP"],
        openingMsg: "A competitor funded the exfiltration. Counsel must identify the corporate recipient.",
        hintMsg: "A four-letter name representing a ring of light, or the popular Sci-Fi game name.",
        successMsg: "Corporate recipient confirmed: HALO. Investigation file updated.",
        clueLines: [
          "Offshore shell trust sponsor code: 'Angels Light'.",
          "Recipient is a rival tech developer.",
          "Enter name (4 letters, refers to a glowing ring of light)."
        ]
      },
      F: {
        id: "F",
        title: "Exhibit F — Safehouse Custodian",
        ledgerLabel: "Safehouse Custodian",
        correctAnswers: ["SILAS"],
        openingMsg: "Identify the safehouse server administrator holding the backup encryption key.",
        hintMsg: "The admin's name starts with S and ends with s. Five letters. Sounds like Silas.",
        successMsg: "Admin identity established. Backup key retrieval authorized.",
        clueLines: [
          "Key server is administered by a local tech director.",
          "Administrator name starts with S and ends with s (5 letters)."
        ]
      }
    }
  },
  "005": {
    id: "005",
    number: "No. 005",
    title: "The Crimson Contract",
    description: "A high-profile real estate transfer deed is suspected of forgery. Audit the transaction and verify signature integrity.",
    clientName: "Evelyn",
    briefing: [
      {
        speaker: "client",
        text: "Counsel, my family is about to lose our historic estate. A developer has produced a Quitclaim deed transferring our entire lot to their subsidiary."
      },
      {
        speaker: "lawyer",
        text: "Do you suspect signature forgery, or did they use an invalid notary?"
      },
      {
        speaker: "client",
        text: "Both. The notary registration seal is faint and looks fake, and the signature on the deed shows heavy tremor lines, suggesting it was carbon traced."
      },
      {
        speaker: "lawyer",
        text: "A carbon-traced signature is a forensic smoking gun. Who is the closing escrow officer?"
      },
      {
        speaker: "client",
        text: "They are refusing to let us contact the closing clerk. We have the registry records, notary stamps, and signature comparison maps."
      },
      {
        speaker: "lawyer",
        text: "We will audit the Crimson Contract. If the notary ID is invalid and the signature is traced, the deed is legally null and void."
      },
      {
        speaker: "client",
        text: "Please help us stop this fraudulent conveyance. They are trying to evict us tomorrow."
      },
      {
        speaker: "lawyer",
        text: "We will identify the deed type, verify the lot number, calculate the notary ID, prove signature forgery, and locate the escrow officer. Let's start immediately."
      },
      {
        speaker: "client",
        text: "The Court of Equity has called our brief. We are ready."
      },
      {
        speaker: "lawyer",
        text: "Let's begin."
      }
    ],
    verdict: {
      bookCoverKey: "005",
      certificateTitle: "Distinguished Title Examiner",
      certificateDescription: "This document certifies that the named Counsel has successfully audited the Crimson Contract forgery, verified notary and property coordinates, and protected the rightful owners from fraudulent transfers.",
      judgeName: "CHANCELLOR KENT",
      archivistName: "REALTY REGISTRY",
      script: [
        { text: "Counsel, step forward...", delay: 800 },
        { text: "All property deeds, signature strokes, and notary stamp seals have been audited.", delay: 800 },
        { text: "The Court now delivers its final ruling on the Crimson Contract.", delay: 800 },
        { text: "The notary registration ID has been verified as:", delay: 800 },
        { text: "9900", isHighlight: true, isBig: true, sound: "boom", delay: 1500 },
        { text: "The fraudulent beneficiary of the forged transfer has been identified.", delay: 800 },
        { text: "ELIAS", isHighlight: true, sound: "success", delay: 1200 },
        { text: "The Court orders the immediate cancellation of the transfer deed.", delay: 800 },
        { text: "Escrow handler summoned to testify: Phebe.", delay: 1200 },
        { text: "This case is hereby closed.", delay: 800 },
        { text: "Case File No. 005 is concluded.", delay: 800 },
        { text: "Counsel has preserved property rights and exposed forensic document tampering.", delay: 800 },
        { text: "Registry updated. Defense rests.", delay: 1000 },
        { text: "Court stands adjourned.", sound: "final_stamp", delay: 1500 }
      ]
    },
    exhibits: {
      A: {
        id: "A",
        title: "Exhibit A — Deed Classification",
        ledgerLabel: "Deed Type",
        correctAnswers: ["QUITCLAIM DEED", "QUITCLAIM", "QUIT CLAIM"],
        openingMsg: "Establish the legal classification of the real estate deed.",
        hintMsg: "A type of deed where the grantor transfers any interest they have in the property without warranties. Starts with Q.",
        successMsg: "Deed type classified: Quitclaim Deed. Title register updated.",
        clueLines: [
          "Transfer of property rights executed without covenant/warranty checks.",
          "Property title transfer deed is a simple waiver document.",
          "Name starts with Q (starts with Quitclaim...)."
        ]
      },
      B: {
        id: "B",
        title: "Exhibit B — Target Property Lot",
        ledgerLabel: "Property Lot",
        correctAnswers: ["LOT 45", "45", "LOT45"],
        openingMsg: "Identify the block or lot number under dispute.",
        hintMsg: "A two-digit number. The sum of the digits is 9, and the first digit is one less than the second.",
        successMsg: "Property lot identified: Lot 45. Deed map updated.",
        clueLines: [
          "Block description: Lot number is under dispute.",
          "Clue: Two-digit number where the sum is 9 and the first digit is 1 less than the second (e.g. 45)."
        ]
      },
      C: {
        id: "C",
        title: "Exhibit C — Notary Seal Stamp ID",
        ledgerLabel: "Stamp ID",
        correctAnswers: ["9900", "9900A"],
        openingMsg: "Deduce the notary's license registration number from the faint seal imprint.",
        hintMsg: "A four-digit number where the first two digits are the square of 3, and the last two are double zero.",
        successMsg: "Notary Stamp ID confirmed: 9900. Verification recorded.",
        clueLines: [
          "Faint seal imprint numbers analyzed.",
          "Four-digit license code.",
          "Clue: First two digits are square of 3, and last two digits are double zero (e.g. 9900)."
        ]
      },
      D: {
        id: "D",
        title: "Exhibit D — Signature Discrepancy Analysis",
        ledgerLabel: "Verification Result",
        correctAnswers: ["FORGED SIGNATURE", "FORGERY"],
        openingMsg: "Analyze handwriting velocity and stroke pressure. Was the signature real or forged?",
        hintMsg: "The strokes show high tremor, suggesting tracing, whereas the grantor had a smooth signature.",
        successMsg: "The Court finds the signature to be a tracing forgery. The real estate transfer is declared void.",
        clueLines: [
          "Handwriting stroke analysis: Slow, high pressure, localized tremor points.",
          "Overlay comparison: 100% vector match to donor sample (indicates carbon tracing).",
          "Identify the signature status (REAL or FORGERY)."
        ]
      },
      E: {
        id: "E",
        title: "Exhibit E — Beneficiary Name",
        ledgerLabel: "Beneficiary",
        correctAnswers: ["ELIAS"],
        openingMsg: "Identify the beneficiary who stands to gain from this fraudulent deed.",
        hintMsg: "His name is five letters, starts with E and ends with s. Sounds like Elias.",
        successMsg: "Beneficiary name recorded: Elias.",
        clueLines: [
          "Fraudulent deed grantee beneficiary name.",
          "First name is 5 letters, starts with E and ends with s (Elias)."
        ]
      },
      F: {
        id: "F",
        title: "Exhibit F — Escrow Officer Name",
        ledgerLabel: "Escrow Officer",
        correctAnswers: ["PHEBE"],
        openingMsg: "Identify the escrow officer who handled the transaction files.",
        hintMsg: "Her name starts with P and ends with e. Five letters. Spelled P-H-E-B-E.",
        successMsg: "Officer Phebe summoned to testify. Verdict ready.",
        clueLines: [
          "Deed closing registry signature is P-H-E-B-E.",
          "Enter the closing escrow officer name (5 letters)."
        ]
      }
    }
  }
};

const createInitialProgress = () => {
  const progress = {};
  Object.keys(CASE_DATA).forEach((id, index) => {
    const defaultExhibits = CASE_DATA[id].exhibits;
    const firstExhibitId = Object.keys(defaultExhibits)[0];
    const initialAnswers = {};
    Object.keys(defaultExhibits).forEach(exId => {
      initialAnswers[exId] = "";
    });
    progress[id] = {
      currentExhibitId: firstExhibitId,
      completedExhibits: [],
      answers: initialAnswers,
      errorCount: 0,
      caseStatus: index === 0 ? "OPEN" : "LOCKED",
      judgeMessage: defaultExhibits[firstExhibitId].openingMsg
    };
  });
  return progress;
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
      currentCaseId: "001",
      currentExhibitId: "A",
      completedExhibits: [],
      answers: { A: "", B: "", C: "", D: "", E: "", F: "" },
      errorCount: 0,
      caseStatus: "OPEN",
      judgeMessage: CASE_DATA["001"].exhibits.A.openingMsg,
      isMuted: false,
      volumeAmbience: 0.25,
      volumeSFX: 0.5,
      isAmbiencePlaying: true,
      playerName: "",
      playerGender: "",
      caseProgress: createInitialProgress(),

      setPlayerInfo: (name, gender) => {
        set({ playerName: name, playerGender: gender });
      },

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

      selectCase: (caseId) => {
        const state = get();
        if (!CASE_DATA[caseId]) return;

        let progress = state.caseProgress ? { ...state.caseProgress } : createInitialProgress();

        const caseKeys = Object.keys(CASE_DATA);
        const currentIndex = caseKeys.indexOf(caseId);
        if (currentIndex > 0) {
          const prevCaseId = caseKeys[currentIndex - 1];
          if (progress[prevCaseId]?.caseStatus === "CLOSED" && progress[caseId]?.caseStatus === "LOCKED") {
            progress[caseId].caseStatus = "OPEN";
          }
        }

        const caseData = progress[caseId];

        set({
          currentCaseId: caseId,
          currentExhibitId: caseData.currentExhibitId,
          completedExhibits: caseData.completedExhibits,
          answers: caseData.answers,
          errorCount: caseData.errorCount,
          caseStatus: caseData.caseStatus,
          judgeMessage: caseData.judgeMessage,
          caseProgress: progress
        });
      },

      submitAnswer: (exhibitId, answerText) => {
        const state = get();
        const caseId = state.currentCaseId || "001";
        const caseObj = CASE_DATA[caseId];
        const data = caseObj.exhibits[exhibitId];
        
        if (!data) return { success: false };

        const normalizedInput = answerText.trim().toUpperCase();
        const isCorrect = data.correctAnswers.some(ans => normalizedInput === ans);

        if (isCorrect) {
          soundManager.playSuccess();

          const updatedCompleted = state.completedExhibits.includes(exhibitId)
            ? state.completedExhibits
            : [...state.completedExhibits, exhibitId];

          const updatedAnswers = { ...state.answers, [exhibitId]: answerText.trim() };

          const exhibitKeys = Object.keys(caseObj.exhibits);
          const currentIndex = exhibitKeys.indexOf(exhibitId);
          const nextIndex = currentIndex + 1;
          const nextExhibitId = exhibitKeys[nextIndex] || null;

          let nextExhibitState = {};
          let statusOfCase = state.caseStatus;

          if (nextExhibitId) {
            nextExhibitState = {
              completedExhibits: updatedCompleted,
              answers: updatedAnswers,
              judgeMessage: data.successMsg,
            };

            setTimeout(() => {
              const nextData = caseObj.exhibits[nextExhibitId];
              set((s) => {
                const nextProgress = {
                  ...s.caseProgress,
                  [caseId]: {
                    ...s.caseProgress[caseId],
                    currentExhibitId: nextExhibitId,
                    completedExhibits: updatedCompleted,
                    answers: updatedAnswers,
                    judgeMessage: nextData.openingMsg,
                  }
                };
                return {
                  currentExhibitId: nextExhibitId,
                  judgeMessage: nextData.openingMsg,
                  caseProgress: nextProgress
                };
              });
              soundManager.playRustle();
            }, 3200);
          } else {
            statusOfCase = "CLOSED";
            nextExhibitState = {
              completedExhibits: updatedCompleted,
              answers: updatedAnswers,
              judgeMessage: data.successMsg,
              caseStatus: "CLOSED"
            };
          }

          set((s) => {
            const nextProgress = {
              ...s.caseProgress,
              [caseId]: {
                ...s.caseProgress[caseId],
                completedExhibits: updatedCompleted,
                answers: updatedAnswers,
                caseStatus: statusOfCase,
                judgeMessage: data.successMsg,
              }
            };
            
            const caseKeys = Object.keys(CASE_DATA);
            const currentCaseIndex = caseKeys.indexOf(caseId);
            const nextCaseId = caseKeys[currentCaseIndex + 1];
            if (nextCaseId && statusOfCase === "CLOSED" && nextProgress[nextCaseId]) {
              nextProgress[nextCaseId].caseStatus = "OPEN";
            }

            return {
              ...nextExhibitState,
              caseProgress: nextProgress
            };
          });

          return { success: true };
        } else {
          soundManager.playError();

          const randomObjection = OBJECTIONS[Math.floor(Math.random() * OBJECTIONS.length)];
          
          set((s) => {
            const nextErrorCount = s.errorCount + 1;
            const nextProgress = {
              ...s.caseProgress,
              [caseId]: {
                ...s.caseProgress[caseId],
                errorCount: nextErrorCount,
                judgeMessage: randomObjection
              }
            };
            return {
              errorCount: nextErrorCount,
              judgeMessage: randomObjection,
              caseProgress: nextProgress
            };
          });

          setTimeout(() => {
            if (get().currentExhibitId === exhibitId) {
              let hint = caseObj.exhibits[exhibitId].hintMsg;
              if (exhibitId === "F") {
                const name = get().playerName || "Counsel";
                hint = hint.replace("the defendant", `Counsel ${name}`).replace("the accused", `Counsel ${name}`);
              }
              set((s) => {
                const nextProgress = {
                  ...s.caseProgress,
                  [caseId]: {
                    ...s.caseProgress[caseId],
                    judgeMessage: hint
                  }
                };
                return {
                  judgeMessage: hint,
                  caseProgress: nextProgress
                };
              });
            }
          }, 3500);

          return { success: false };
        }
      },

      setCurrentExhibit: (exhibitId) => {
        const state = get();
        const caseId = state.currentCaseId || "001";
        const caseObj = CASE_DATA[caseId];
        const completed = state.completedExhibits;
        const currentIdx = Object.keys(caseObj.exhibits).indexOf(exhibitId);
        
        const isFirstUnlocked = completed.length === currentIdx;
        const isCompleted = completed.includes(exhibitId);

        if (isCompleted || isFirstUnlocked) {
          const targetMsg = caseObj.exhibits[exhibitId].openingMsg;
          set((s) => {
            const nextProgress = {
              ...s.caseProgress,
              [caseId]: {
                ...s.caseProgress[caseId],
                currentExhibitId: exhibitId,
                judgeMessage: targetMsg
              }
            };
            return {
              currentExhibitId: exhibitId,
              judgeMessage: targetMsg,
              caseProgress: nextProgress
            };
          });
          soundManager.playRustle();
        }
      },

      resetCase: (caseId) => {
        set((s) => {
          const defaultExhibits = CASE_DATA[caseId].exhibits;
          const firstExhibitId = Object.keys(defaultExhibits)[0];
          const initialAnswers = {};
          Object.keys(defaultExhibits).forEach(exId => {
            initialAnswers[exId] = "";
          });
          
          const caseKeys = Object.keys(CASE_DATA);
          const isFirstCase = caseKeys.indexOf(caseId) === 0;

          const nextProgress = {
            ...s.caseProgress,
            [caseId]: {
              currentExhibitId: firstExhibitId,
              completedExhibits: [],
              answers: initialAnswers,
              errorCount: 0,
              caseStatus: isFirstCase ? "OPEN" : "LOCKED",
              judgeMessage: defaultExhibits[firstExhibitId].openingMsg
            }
          };

          if (s.currentCaseId === caseId) {
            return {
              currentExhibitId: firstExhibitId,
              completedExhibits: [],
              answers: initialAnswers,
              errorCount: 0,
              caseStatus: isFirstCase ? "OPEN" : "LOCKED",
              judgeMessage: defaultExhibits[firstExhibitId].openingMsg,
              caseProgress: nextProgress
            };
          }
          return { caseProgress: nextProgress };
        });
        soundManager.playRustle();
      },

      resetGame: () => {
        const state = get();
        const caseId = state.currentCaseId || "001";
        state.resetCase(caseId);
      },

      resetAllGames: () => {
        const initialProgress = createInitialProgress();
        const firstCaseId = Object.keys(CASE_DATA)[0];
        const firstCaseExhibits = CASE_DATA[firstCaseId].exhibits;
        const firstExhibitId = Object.keys(firstCaseExhibits)[0];

        set({
          currentCaseId: firstCaseId,
          currentExhibitId: firstExhibitId,
          completedExhibits: [],
          answers: initialProgress[firstCaseId].answers,
          errorCount: 0,
          caseStatus: "OPEN",
          judgeMessage: firstCaseExhibits[firstExhibitId].openingMsg,
          caseProgress: initialProgress
        });
        soundManager.playRustle();
      }
    }),
    {
      name: "law-firm-game-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentCaseId: state.currentCaseId,
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
        caseProgress: state.caseProgress
      }),
    }
  )
);

export { CASE_DATA };
