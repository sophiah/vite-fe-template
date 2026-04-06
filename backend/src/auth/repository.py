import json
from typing import Any

from database import get_connection


def upsert_user_with_identity(
  *,
  email: str,
  provider: str,
  provider_subject: str,
  display_name: str | None,
  avatar_url: str | None,
  provider_email: str | None,
  profile: dict[str, Any]
) -> None:
  with get_connection() as connection:
    with connection.cursor() as cursor:
      cursor.execute(
        """
        INSERT INTO users (email, display_name, avatar_url, created_at, updated_at, last_login_at)
        VALUES (%s, %s, %s, NOW(), NOW(), NOW())
        ON CONFLICT (email)
        DO UPDATE SET
          display_name = COALESCE(EXCLUDED.display_name, users.display_name),
          avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
          updated_at = NOW(),
          last_login_at = NOW()
        """,
        (email, display_name, avatar_url)
      )

      cursor.execute(
        """
        INSERT INTO user_sso_identities (
          provider,
          provider_subject,
          user_email,
          provider_email,
          profile_json,
          created_at,
          updated_at,
          last_login_at
        )
        VALUES (%s, %s, %s, %s, %s::jsonb, NOW(), NOW(), NOW())
        ON CONFLICT (provider, provider_subject)
        DO UPDATE SET
          user_email = EXCLUDED.user_email,
          provider_email = EXCLUDED.provider_email,
          profile_json = EXCLUDED.profile_json,
          updated_at = NOW(),
          last_login_at = NOW()
        """,
        (provider, provider_subject, email, provider_email, json.dumps(profile))
      )

    connection.commit()
