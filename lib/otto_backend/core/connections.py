from redis import Redis


# Redis connection
redis_client = Redis(host="redis", port=6379, decode_responses=True)