from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.bomfim"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    bomfim_database_url: str = ""
    bomfim_brevo_api_key: str = ""
    bomfim_from_email: str = ""
    bomfim_from_name: str = "Bomfim Cargas"
    bomfim_leads_email: str = "apolo@4lia.com.br"
    bomfim_test_email: str = "apolo+cliente@4lia.com.br"
    bomfim_site_origin: str = ""

    host: str = "0.0.0.0"
    port: int = 5183


@lru_cache
def get_settings() -> Settings:
    return Settings()