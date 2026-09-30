"""
Hariprasath VS - portfolio website (Flask).

Everything you see on the page comes from the SITE dictionary below.
Edit the text, links, projects and roles here; no HTML changes needed.

Run:
    pip install -r requirements.txt
    python app.py
Then open http://127.0.0.1:5000
"""

import json
import re
import time
from pathlib import Path

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

MESSAGES_FILE = Path(__file__).parent / "messages.jsonl"

SITE = {
    "name": "Hariprasath VS",
    "title": "Multi cloud and AI Engineer",
    "tagline": (
        "I design cloud platforms that run across AWS, Azure and Google Cloud, "
        "and put AI to work on top of them."
    ),
    "email": "hariprasath120597@gmail.com",
    "links": [
        {"label": "GitHub", "url": "https://github.com/hariprasath-vs-12"},
        {"label": "LinkedIn", "url": "https://www.linkedin.com/in/hariprasath-vs-560a4b1a6/"},
    ],
    "about": [
        "I work where cloud infrastructure meets machine learning. Most of my time "
        "goes into making systems that are portable across providers, cheap to "
        "run, and calm to operate.",
        "I like turning a rough AI idea into something that ships: a clean data "
        "path, a model behind a reliable API, and the automation around it so "
        "nobody has to babysit it.",
    ],
    "facts": [
        {"label": "Focus", "value": "Multi cloud architecture and applied AI"},
        {"label": "Language", "value": "Python first"},
        {"label": "Style", "value": "Automated, observable, low drama"},
    ],
    # Skill groups are shown as three columns. Edit freely.
    "stack": [
        {
            "group": "Cloud",
            "tone": "blue",
            "note": "Build once, run on any provider.",
            "items": ["AWS", "Microsoft Azure", "Google Cloud", "Terraform",
                      "Kubernetes", "Docker"],
        },
        {
            "group": "AI",
            "tone": "indigo",
            "note": "From experiment to a service people rely on.",
            "items": ["Python", "LLM apps and RAG", "PyTorch", "scikit-learn",
                      "MLOps", "Vector search"],
        },
        {
            "group": "Platform",
            "tone": "purple",
            "note": "The glue that keeps it steady.",
            "items": ["CI/CD", "GitHub Actions", "Observability", "FinOps",
                      "Cloud security", "Linux"],
        },
    ],
    # Sample projects - replace with your own.
    "projects": [
        {
            "title": "Multi cloud landing zone",
            "summary": "One Terraform codebase that sets up networking, identity and "
                       "guardrails on AWS, Azure and Google Cloud.",
            "detail": "Reusable modules, a shared naming and tagging scheme, and "
                      "policy checks that run before anything is deployed.",
            "tags": ["Terraform", "AWS", "Azure", "GCP"],
            "link": "",
        },
        {
            "title": "Document Q&A assistant",
            "summary": "A retrieval-augmented chat service that answers questions "
                       "from a team's own documents.",
            "detail": "Python API, vector store for search, and an evaluation set "
                      "that scores answers whenever the prompt or model changes.",
            "tags": ["Python", "RAG", "LLM", "FastAPI"],
            "link": "",
        },
        {
            "title": "Model deployment pipeline",
            "summary": "Push a trained model to Git and it is tested, packaged and "
                       "released to Kubernetes on its own.",
            "detail": "Container builds, canary rollouts, and dashboards that show "
                      "latency, cost and drift in one place.",
            "tags": ["MLOps", "Kubernetes", "CI/CD", "Observability"],
            "link": "",
        },
    ],
    # Sample roles - replace with your real history.
    "path": [
        {
            "period": "Now",
            "role": "Multi cloud and AI Engineer",
            "place": "Company name",
            "text": "Building cloud platforms and AI services that work across providers.",
        },
        {
            "period": "Before",
            "role": "Cloud Engineer",
            "place": "Company name",
            "text": "Automated infrastructure and deployments on a single cloud.",
        },
        {
            "period": "Started",
            "role": "Your first role or degree",
            "place": "Company or college",
            "text": "Where the interest in cloud and AI began.",
        },
    ],
}


@app.get("/")
def index():
    return render_template("index.html", **SITE)


@app.post("/contact")
def contact():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    # Hidden field that real visitors never fill in.
    if data.get("website"):
        return jsonify(ok=True)

    if not name or not message:
        return jsonify(ok=False, error="Add your name and a message."), 400
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify(ok=False, error="Enter a valid email address."), 400
    if len(message) > 2000:
        return jsonify(ok=False, error="Keep the message under 2000 characters."), 400

    entry = {"time": time.strftime("%Y-%m-%d %H:%M:%S"), "name": name,
             "email": email, "message": message}
    with MESSAGES_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    return jsonify(ok=True)


if __name__ == "__main__":
    app.run(debug=True)
