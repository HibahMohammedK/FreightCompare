from .tavily_client import search_transport
from .llm_client import summarize_transport


def search_transport_ai(data):

    source = data["source"]
    destination = data["destination"]
    transport_type = data["transport_type"]

    tavily_response = search_transport(
        source=source,
        destination=destination,
        transport_type=transport_type,
    )

    search_results = tavily_response.get(
        "results",
        []
    )

    if not search_results:
        return {
            "route": {
                "source": source,
                "destination": destination,
                "transport_type": transport_type,
            },
            "summary": (
                f"No relevant {transport_type} freight information "
                f"was found for {source} to {destination}."
            ),
            "recommendations": [],
        }

    return summarize_transport(
        source=source,
        destination=destination,
        transport_type=transport_type,
        search_results=search_results,
    )