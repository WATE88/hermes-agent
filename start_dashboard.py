import os, sys, traceback
os.environ["PYTHONIOENCODING"] = "utf-8"
os.environ["HERMES_WEB_DIST"] = r"C:\Users\Admin\.qclaw\workspace-agent-5ae09493\hermes-agent\hermes_cli\web_dist"
os.chdir(r"C:\Users\Admin\.qclaw\workspace-agent-5ae09493\hermes-agent")
sys.path.insert(0, os.getcwd())
try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except:
    pass

import uvicorn
from hermes_cli.web_server import app

print("=" * 50, flush=True)
print("  Hermes Dashboard", flush=True)
print("  http://127.0.0.1:9119", flush=True)
print("=" * 50, flush=True)
uvicorn.run(app, host="127.0.0.1", port=9119, log_level="info")
