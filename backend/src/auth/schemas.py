from pydantic import BaseModel, ConfigDict, Field


class SsoTokenIssueRequest(BaseModel):
  model_config = ConfigDict(populate_by_name=True, extra="ignore")

  provider: str = Field(min_length=1, max_length=80)
  callback_token: str = Field(alias="callbackToken", min_length=1)
  cookie_domain: str | None = Field(default=None, alias="cookieDomain")
