import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Challenge, EvaluationResult } from "../types";

// Initialize Gemini
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const SYLLABUS_TOPICS = [
  "Introduction to 'C': Constants, variables and data types, Operators and expressions.",
  "Managing input/output operations: printf and scanf usage.",
  "Decision making and branching: if, if-else, switch case.",
  "Decision making and looping: while, do-while, for loops.",
  "Unconditional control statements: break and continue.",
  "Basics of functions: definition, declaration, and calling.",
  "Function parameter passing: call by value.",
  "Introduction to Recursion.",
  "One-dimensional arrays: declaration and initialization.",
  "Two-dimensional arrays: basic usage.",
  "Character arrays and basic String operations."
];

/**
 * Generates a C programming challenge for first-year students.
 */
export const generateChallenge = async (): Promise<Challenge> => {
  const model = "gemini-3-flash-preview";
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      buggyCode: { 
        type: Type.STRING, 
        description: "The C code snippet with 2 to 3 errors. MUST be properly indented with standard newlines. NO COMMENTS pointing out errors." 
      },
      expectedOutput: { 
        type: Type.STRING, 
        description: "The exact output the code produces AFTER all errors are fixed." 
      },
      description: { 
        type: Type.STRING, 
        description: "What the program is intended to do." 
      },
      difficulty: { type: Type.STRING, enum: ["Easy", "Medium"] }
    },
    required: ["buggyCode", "expectedOutput", "description", "difficulty"]
  };

  const selectedTopic = SYLLABUS_TOPICS[Math.floor(Math.random() * SYLLABUS_TOPICS.length)];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `You are a C Programming Instructor at Indira College of Engineering and Management. 
      Generate a C programming challenge for a First-Year Engineering TAE 2 Exam.
      
      TOPIC: ${selectedTopic}.
      DIFFICULTY: Easy to Medium (Appropriate for 1st year students).
      
      CRITICAL RULES:
      1. CODE STRUCTURE: You MUST provide the code with standard C indentation (4 spaces) and clear line breaks after every semicolon, bracket, or block. Do NOT return the code as a single line or a paragraph. It must look like a real .c source file.
      2. ERRORS: Include at least TWO to THREE (2-3) distinct subtle logical or syntax errors. 
      3. NO HINTS: Absolutely NO comments in the code explaining or pointing out where the errors are. No "// fix this" or "// error".
      4. CONTENT: Use standard C features from the first-year syllabus.
      5. FORMAT: Ensure the buggyCode field in your JSON response contains the full code with newlines (\\n).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Challenge;
    }
    throw new Error("No text response");
  } catch (error) {
    console.error("Error generating challenge:", error);
    // Fallback if API fails
    return {
      buggyCode: "#include <stdio.h>\n\nint main() {\n    int i\n    for (i = 1; i <= 5; i++) {\n        if (i = 3)\n            printf(\"%d \", i);\n    }\n    return 0;\n}",
      expectedOutput: "1 2 3 4 5",
      description: "A loop intended to print numbers from 1 to 5.",
      difficulty: "Easy"
    };
  }
};

/**
 * Evaluates the student's fix.
 */
export const evaluateSubmission = async (
  originalChallenge: Challenge,
  studentCode: string
): Promise<EvaluationResult> => {
  const model = "gemini-3-flash-preview";

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isCorrect: { type: Type.BOOLEAN },
      score: { type: Type.INTEGER },
      feedback: { type: Type.STRING }
    },
    required: ["isCorrect", "score", "feedback"]
  };

  try {
    const prompt = `
      Evaluate this C code for a First-Year TAE 2 Exam.
      Goal: ${originalChallenge.description}
      Expected Output: ${originalChallenge.expectedOutput}
      
      Student Submission:
      ${studentCode}
      
      Task: Determine if the student fixed all the errors to produce the exact expected output. 
      Score out of 15. Award points based on how many of the 2-3 errors were found and fixed.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as EvaluationResult;
    }
    throw new Error("Evaluation error");
  } catch (error) {
    return { isCorrect: false, score: 0, feedback: "Evaluation failed. Faculty review required." };
  }
};