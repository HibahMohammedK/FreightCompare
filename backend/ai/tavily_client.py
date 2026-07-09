from django.conf import settings

from tavily import TavilyClient


client = TavilyClient(
    api_key=settings.TAVILY_API_KEY
)


def search_transport(
    source,
    destination,
    transport_type,
):
    """
    Search the web for freight information
    using Tavily.
    """

    query = f"""
        Find official {transport_type} freight companies operating from {source} to {destination}.

        Return information about:

        - freight company
        - cargo operator
        - logistics provider
        - transport price
        - transit duration
        - booking page

Prioritize official company websites.
"""                      

    response = client.search(
        query=query,
        search_depth="advanced",
        max_results=10,
    )

    return response