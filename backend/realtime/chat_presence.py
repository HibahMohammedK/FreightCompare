import uuid

from django.core.cache import cache


CHAT_PRESENCE_TIMEOUT = 120


def _presence_key(conversation_id, user_id):
    return (
        f"chat_presence:"
        f"{conversation_id}:"
        f"{user_id}"
    )


def add_chat_connection(
    conversation_id,
    user_id,
):
    """
    Register one active WebSocket connection
    for a user inside a conversation.
    """

    connection_id = str(uuid.uuid4())

    key = _presence_key(
        conversation_id,
        user_id,
    )

    connections = cache.get(
        key,
        set(),
    )

    connections = set(connections)

    connections.add(connection_id)

    cache.set(
        key,
        connections,
        timeout=CHAT_PRESENCE_TIMEOUT,
    )

    return connection_id


def remove_chat_connection(
    conversation_id,
    user_id,
    connection_id,
):
    """
    Remove one WebSocket connection.
    """

    key = _presence_key(
        conversation_id,
        user_id,
    )

    connections = cache.get(
        key,
        set(),
    )

    connections = set(connections)

    connections.discard(
        connection_id
    )

    if connections:

        cache.set(
            key,
            connections,
            timeout=CHAT_PRESENCE_TIMEOUT,
        )

    else:

        cache.delete(key)


def is_user_in_chat(
    conversation_id,
    user_id,
):
    """
    Return True when the user currently has
    an active WebSocket connection to this
    conversation.
    """

    key = _presence_key(
        conversation_id,
        user_id,
    )

    connections = cache.get(
        key,
        set(),
    )

    return bool(connections)