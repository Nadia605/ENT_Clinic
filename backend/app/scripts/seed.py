"""Entry point used by scripts/setup.ps1: `python -m app.scripts.seed`."""

import asyncio

from seeds.run_all import main

if __name__ == "__main__":
    asyncio.run(main())
