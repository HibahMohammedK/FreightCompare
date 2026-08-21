import json

from django.conf import settings
from groq import Groq

from .prompts import TRANSPORT_SEARCH_PROMPT


client = Groq(
    api_key=settings.GROQ_API_KEY,
)

MAX_CONTENT_LENGTH = 1500


def summarize_transport(
    *,
    source,
    destination,
    transport_type,
    search_results,
):

    formatted_results = ""

    for index, result in enumerate(
        search_results,
        start=1,
    ):

        title = result.get("title", "")
        url = result.get("url", "")
        content = result.get("content", "")

        if not content:
            continue

        formatted_results += f"""
Result {index}

Title:
{title}

URL:
{url}

Content:
{content[:MAX_CONTENT_LENGTH]}

----------------------------------------
"""

    user_prompt = f"""
Requested Route

Source:
{source}

Destination:
{destination}

Transport Type:
{transport_type}

========================================

SUPPLIED WEB RESULTS

{formatted_results}

========================================

Analyze the supplied results.

Return ONLY the JSON object requested by the system prompt.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        temperature=0,
        response_format={
            "type": "json_object",
        },
        messages=[
            {
                "role": "system",
                "content": TRANSPORT_SEARCH_PROMPT,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError(
            "Groq returned an empty response."
        )

    try:
        return json.loads(content)

    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Groq returned invalid JSON: {content}"
        ) from exc