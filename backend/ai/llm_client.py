import json

from django.conf import settings
from groq import Groq

from .prompts import TRANSPORT_SEARCH_PROMPT


client = Groq(
    api_key=settings.GROQ_API_KEY,
)


def summarize_transport(
    *,
    source,
    destination,
    transport_type,
    search_results,
):
    formatted_results = ""

    for index, result in enumerate(search_results, start=1):
        formatted_results += f"""
Result {index}

Title:
{result.get("title")}

URL:
{result.get("url")}

Content:
{result.get("content")}

----------------------------------------
"""

    user_prompt = f"""
Requested Transport

Source:
{source}

Destination:
{destination}

Transport Type:
{transport_type}

========================================

Web Search Results

{formatted_results}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
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

    return json.loads(
        response.choices[0].message.content
    )