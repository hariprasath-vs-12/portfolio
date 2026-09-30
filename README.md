# Hariprasath VS - Portfolio

Flask portfolio site. All content lives in the `SITE` dictionary in `app.py`.

## Run
```
pip install -r requirements.txt
python app.py
```
Open http://127.0.0.1:5000

Contact form messages are saved to `messages.jsonl` next to `app.py`.

## Customise
- Text, links, projects, roles: edit `SITE` in `app.py` (look for TODO).
- Colours: CSS variables at the top of `static/style.css`.
- Hero animation: `static/script.js`.
