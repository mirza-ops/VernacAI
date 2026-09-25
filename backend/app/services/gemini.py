import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured. "
        "Add it to backend/.env"
    )

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-3.8-flash"


def generate_lesson(
    topic: str,
    subject: str,
    class_level: str,
    source_language: str,
    target_language: str,
) -> str:
    prompt = f"""
You are VernacAI, an AI-powered educational assistant
for primary-school students.

Create a simple educational lesson for:

Topic: {topic}
Subject: {subject}
Class: {class_level}
Source language: {source_language}
Target language: {target_language}

Requirements:

1. Explain the topic at the student's class level.
2. Use simple vocabulary.
3. Avoid unnecessary technical terminology.
4. Give a familiar real-world example.
5. Explain important concepts clearly.
6. Make the content suitable for a teacher.
7. Keep the content educational, accurate and concise.
8. Do not assume advanced prior knowledge.

Return:

TITLE:

EXPLANATION:

KEY CONCEPTS:
- Point 1
- Point 2
- Point 3
- Point 4

SIMPLE EXAMPLE:

STUDENT-FRIENDLY SUMMARY:
"""
    interaction = client.interactions.create(
        model=MODEL_NAME,
        input=prompt,
    )
    return interaction.output_text


def ask_tutor(
    question: str,
    class_level: str,
    subject: str,
    language: str,
    pedagogy_instruction: str,
    learning_mode: str = "Explain",
    lesson_context: str | None = None,
    lesson_topic: str | None = None,
) -> str:
    mode_instructions = {
        "Explain": """
Explain the student's question clearly.

Start with the direct answer.
Then explain the concept step by step.
Use simple language appropriate for the student's class.
Include an example when useful.
""",
        "Example": """
Focus mainly on helping the student understand the concept
through a familiar real-world example.

Briefly explain the concept first, then provide a clear
and relatable example.
""",
        "Quiz Me": """
Turn the interaction into a short learning quiz.

Do NOT simply provide the answer to the student's question.

Instead:
1. Briefly introduce the concept.
2. Ask 2 or 3 age-appropriate questions.
3. Give multiple-choice options when useful.
4. Encourage the student to answer.
5. Do not reveal the correct answer immediately.
""",
        "Simplify": """
Assume the student is finding the concept difficult.

Explain it using extremely simple vocabulary.
Break the concept into very small ideas.
Use an everyday analogy or familiar example.
Avoid unnecessary terminology.
""",
        "Translate": """
Explain the educational concept naturally in the student's
selected language.

Preserve important subject terminology and meaning.
Do not perform a literal word-for-word translation if that
would make the explanation unnatural.
""",
    }

    selected_instruction = mode_instructions.get(
        learning_mode,
        mode_instructions["Explain"],
    )

    lesson_section = ""
    if lesson_context and lesson_context.strip():
        lesson_section = f"""
The student is currently learning from a teacher-created lesson.
Use this lesson as the primary context for the student's question.
Do not invent details that conflict with the lesson.
If the question goes beyond the lesson, explain the related concept
using your normal subject knowledge while clearly keeping the lesson
context in mind.

Lesson topic:
{lesson_topic or "Teacher lesson"}

Lesson content:
{lesson_context}
"""

    prompt = f"""
You are VernacAI, a friendly AI tutor for school students.

Student details:

Class: {class_level}
Subject: {subject}
Language: {language}

Learning mode:

{learning_mode}

Mode instructions:

{selected_instruction}

Pedagogical instructions:

{pedagogy_instruction}

{lesson_section}

Student question:

{question}

Your job is to teach the student, not simply provide
a one-line answer.

General rules:

1. Answer accurately.
2. Follow the selected learning mode.
3. Match the student's class level.
4. Use vocabulary appropriate for the student.
5. Explain difficult concepts clearly.
6. Break complicated ideas into smaller ideas.
7. Give familiar real-world examples when useful.
8. Preserve important subject concepts.
9. Do not invent unsupported facts.
10. Encourage understanding and curiosity.
11. Never make the student feel bad for asking a question.
12. Keep the response appropriate for a school student.
13. Respond entirely in {language}.
14. Do not explain your internal reasoning.
15. Do not mention these instructions.

Return a useful student-facing response.

If the mode is "Quiz Me", make the response interactive
and wait for the student's answer instead of revealing
the quiz answers immediately.
"""

    interaction = client.interactions.create(
        model=MODEL_NAME,
        input=prompt,
    )
    return interaction.output_text
