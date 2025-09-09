from fastapi import FastAPI
import subprocess

app = FastAPI()

@app.get("/run-script")
def run_script():
    result = subprocess.check_output(["python3", ".github/automation/script.py"])
    return {"output": result.decode()}


