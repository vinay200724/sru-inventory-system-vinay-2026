#!/usr/bin/env python
import sys
import os
import uvicorn.main

port = os.getenv("PORT", "8000")
if not port.isdigit():
    port = "8000"

clean_args = []
for a in sys.argv[1:]:
    if a in ("$PORT", "${PORT}"):
        clean_args.append(port)
    elif a.startswith("--port=$PORT") or a.startswith("--port=${PORT}"):
        clean_args.append(f"--port={port}")
    else:
        clean_args.append(a)

sys.argv = [sys.argv[0]] + clean_args
uvicorn.main.main()
