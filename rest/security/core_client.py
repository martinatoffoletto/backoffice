import httpx
from typing import Dict, Any

CORE_API_URL = "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com"


class CoreAuthClient:
    
    def __init__(self, base_url: str = CORE_API_URL):
        self.base_url = base_url.rstrip("/")
        self.timeout = 30.0
    
    async def verify_token(self, token: str, kind: str = "access") -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/auth/verify-jwt",
                headers={"Authorization": f"Bearer {token}"},
                json={"kind": kind, "token": token}
            )
            response.raise_for_status()
            return response.json()
    
    async def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/auth/refresh",
                json={"refreshToken": refresh_token}
            )
            response.raise_for_status()
            return response.json()
    
    async def get_me(self, access_token: str) -> Dict[str, Any]:
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                f"{self.base_url}/api/auth/me",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            response.raise_for_status()
            return response.json()



core_client = CoreAuthClient()
