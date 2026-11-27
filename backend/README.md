# RAG API

Run these commands in the VS Code PowerShell terminal from the project root:

```powershell
cd .\backend
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`. Send a `POST` request to
`/api/ask` with JSON such as `{"question":"What is the program?"}`. Interactive
API documentation is at `http://127.0.0.1:8000/docs`.
