#!/usr/bin/env python3
"""
Neon Dreams Theme Showcase - Python
A concise Python example showcasing various syntax elements.
"""

import asyncio
import json
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum, auto
from typing import Dict, List, Optional, Protocol, Callable

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# Enums and Protocols
class UserRole(Enum):
    ADMIN = auto()
    USER = auto()
    GUEST = auto()


class Serializable(Protocol):
    def to_dict(self) -> Dict[str, any]: ...


# Dataclass with type hints
@dataclass
class User:
    id: int
    username: str
    email: str
    role: UserRole = UserRole.USER
    metadata: Dict[str, any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)

    def __str__(self) -> str:
        return f"User(id={self.id}, username='{self.username}')"

    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN

    def to_dict(self) -> Dict[str, any]:
        """Convert user to dictionary representation."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role.name,
            "created_at": self.created_at.isoformat(),
            "metadata": self.metadata,
        }


# Abstract base class
class BaseRepository(ABC):
    """Abstract repository pattern implementation."""

    def __init__(self):
        self._cache: Dict[int, User] = {}

    @abstractmethod
    async def find_by_id(self, user_id: int) -> Optional[User]:
        """Find user by ID."""
        pass


# Service implementation
class UserService(BaseRepository):
    """User service with caching and validation."""

    async def find_by_id(self, user_id: int) -> Optional[User]:
        """Find user by ID with caching."""
        if user_id in self._cache:
            logger.debug(f"Cache hit for user {user_id}")
            return self._cache[user_id]

        # Simulate database lookup
        await asyncio.sleep(0.1)

        if user_id == 1:
            user = User(1, "admin", "admin@neondreams.dev", UserRole.ADMIN)
            self._cache[user_id] = user
            return user

        return None

    async def create_user(self, username: str, email: str, **metadata) -> User:
        """Create new user with validation."""
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters")

        if "@" not in email:
            raise ValueError("Invalid email format")

        user = User(
            id=hash(username) % 10000, username=username, email=email, metadata=metadata
        )

        self._cache[user.id] = user
        logger.info(f"Created user: {user}")
        return user


# Decorator example
def cache_result(ttl_seconds: int = 300):
    """Cache function result for specified time."""

    def decorator(func: Callable) -> Callable:
        cache = {}

        async def wrapper(*args, **kwargs):
            key = str(args) + str(sorted(kwargs.items()))
            if key in cache:
                logger.debug(f"Cache hit for {func.__name__}")
                return cache[key]
            result = await func(*args, **kwargs)
            cache[key] = result
            return result

        return wrapper

    return decorator


# Main application
async def main():
    """Main entry point with error handling."""
    service = UserService()

    try:
        # Create and retrieve users
        admin = await service.create_user(
            "admin", "admin@neondreams.dev", role="administrator"
        )
        user = await service.find_by_id(1)

        if user and user.is_admin:
            logger.info(f"Found admin user: {user.username}")

        # Demonstrate f-strings and list comprehension
        users = [admin, user] if user else [admin]
        user_names = [u.username for u in users if u is not None]
        logger.info(f"Active users: {', '.join(user_names)}")

    except ValueError as e:
        logger.error(f"Validation error: {e}")
    except Exception as e:
        logger.critical(f"Unexpected error: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
