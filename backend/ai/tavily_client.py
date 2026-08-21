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

    if transport_type == "sea":

        query = f"""
Find commercial sea freight services from {source} to {destination}.

Search specifically for real freight services and current service information.

Look for:

- shipping lines
- freight forwarders
- FCL services
- LCL services
- container shipping
- 20ft container
- 40ft container
- 40HC container
- freight rates
- container rates
- rate per container
- transit time
- sailing schedule
- departure frequency
- port of loading
- port of discharge
- booking or quotation page

Prioritize official shipping lines, freight forwarders,
cargo booking platforms and established logistics companies.

Avoid generic articles, logistics guides and unrelated content.

The source and destination must both be relevant to the requested route.
"""

    else:

        query = f"""
Find commercial air freight services from {source} to {destination}.

Search specifically for real air cargo and freight services.

Look for:

- airlines
- airline cargo services
- air cargo operators
- freight forwarders
- air freight services
- freight rates
- price per kg
- minimum charge
- chargeable weight
- currency
- transit time
- direct service
- connecting service
- flight frequency
- departure information
- booking or quotation page

Prioritize official airline cargo websites,
freight forwarders, cargo booking platforms
and established logistics companies.

Avoid generic articles, logistics guides and unrelated content.

The source and destination must both be relevant to the requested route.
"""

    return client.search(
        query=query,
        search_depth="advanced",
        max_results=5,
        chunks_per_source=1,
    )