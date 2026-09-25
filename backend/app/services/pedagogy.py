def get_pedagogy_profile(
    class_level: str,
    subject: str,
    language: str,
) -> dict:

    class_number = _extract_class_number(class_level)

    if class_number <= 3:
        level = "very simple"

        instruction = (
            "Use very short sentences and very simple vocabulary. "
            "Explain one idea at a time. "
            "Use familiar everyday examples. "
            "Avoid technical terminology unless absolutely necessary."
        )

    elif class_number <= 5:
        level = "simple"

        instruction = (
            "Use simple sentences and familiar vocabulary. "
            "Introduce basic subject terminology only when useful "
            "and explain it in simple words. "
            "Use school-level examples."
        )

    elif class_number <= 8:
        level = "moderate"

        instruction = (
            "Give a moderately detailed explanation. "
            "Use appropriate subject terminology but explain difficult "
            "terms in simple language. "
            "Include reasoning and a relevant example."
        )

    else:
        level = "advanced school"

        instruction = (
            "Give a detailed school-level explanation. "
            "Use appropriate academic terminology and explain important "
            "concepts and reasoning clearly."
        )

    return {
        "level": level,
        "instruction": instruction,
        "class_level": class_level,
        "subject": subject,
        "language": language,
    }


def _extract_class_number(class_level: str) -> int:

    digits = ""

    for character in class_level:

        if character.isdigit():
            digits += character

    if digits:
        return int(digits)

    return 5