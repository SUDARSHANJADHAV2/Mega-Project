import os
import itertools
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class KeyRotator:
    def __init__(self):
        keys = []
        for i in range(1, 6):
            key = os.getenv(f"GEMINI_API_KEY_{i}")
            if key and key.strip():
                keys.append(key.strip())
        
        self.keys = keys
        self.cycle: typing.Iterable[Optional[str]]
        if not self.keys:
            logger.warning("No GEMINI_API_KEY_* found in environment.")
            self.cycle = itertools.cycle([None])
        else:
            self.cycle = itertools.cycle(self.keys)
            
        self.groq_key = os.getenv("GROQ_API_KEY")

        # Start on the first key
        self.current_key_idx: int = 0 if self.keys else -1

    def get_current_key(self) -> Optional[str]:
        if not self.keys:
            return None
        return self.keys[self.current_key_idx]

    def rotate_key(self) -> Optional[str]:
        if not self.keys:
            return None
        old_idx = self.current_key_idx
        self.current_key_idx = (self.current_key_idx + 1) % len(self.keys)
        logger.warning(f"Gemini key {old_idx + 1} exhausted, rotating to key {self.current_key_idx + 1}.")
        return self.keys[self.current_key_idx]
        
    def get_groq_key(self) -> Optional[str]:
        return self.groq_key

key_rotator = KeyRotator()
