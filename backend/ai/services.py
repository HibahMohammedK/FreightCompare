from .tavily_client import search_transport
from .llm_client import summarize_transport


def filter_search_results(
    *,
    source,
    destination,
    transport_type,
    results,
):
    filtered = []

    for result in results:

        text = (
            f"{result.get('title', '')} "
            f"{result.get('content', '')}"
        ).lower()

        if source.lower() not in text:
            continue

        if destination.lower() not in text:
            continue

        if transport_type.lower() not in text:
            continue

        filtered.append(result)

    return filtered


def search_transport_ai(data):

    tavily_response = search_transport(
        source=data["source"],
        destination=data["destination"],
        transport_type=data["transport_type"],
    )

    filtered_results = filter_search_results(
        source=data["source"],
        destination=data["destination"],
        transport_type=data["transport_type"],
        results=tavily_response["results"],
    )

    return summarize_transport(
        source=data["source"],
        destination=data["destination"],
        transport_type=data["transport_type"],
        search_results=tavily_response["results"],
    )