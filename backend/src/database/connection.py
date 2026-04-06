import psycopg

from config import DATABASE_URL


class DatabaseConfigurationError(RuntimeError):
  pass


def get_connection() -> psycopg.Connection:
  if not DATABASE_URL:
    raise DatabaseConfigurationError("DATABASE_URL is not configured")

  return psycopg.connect(DATABASE_URL)
