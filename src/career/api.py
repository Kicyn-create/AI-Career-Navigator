import asyncio
import hmac
import os
import time
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from .models import Profile
from .sources import SourceStore, SourceUnavailable
from .matching import rank_roles
from .inference import RunPod, InferenceError

ROOT=Path(__file__).resolve().parents[2]
load_dotenv(ROOT/'.env')

@asynccontextmanager
async def lifespan(app):
    async with httpx.AsyncClient(follow_redirects=False, headers={'User-Agent':'AI-Career-Navigator/0.2 educational research'}) as client:
        app.state.sources=SourceStore(client)
        app.state.inference=RunPod(client)
        app.state.busy=False
        app.state.calls=[]
        app.state.last_inference=None
        yield

app=FastAPI(title='AI Career Navigator',version='0.2.0',lifespan=lifespan,docs_url=None,redoc_url=None,openapi_url=None)

@app.middleware('http')
async def guard(request, call_next):
    # Bounded body even for chunked requests; never log or persist the profile.
    if request.method=='POST':
        body=b''
        async for chunk in request.stream():
            body+=chunk
            if len(body)>18000: return JSONResponse({'detail':'Request too large.'},status_code=413)
        request._body=body
    response=await call_next(request)
    response.headers['Cache-Control']='no-store'
    response.headers['X-Content-Type-Options']='nosniff'
    response.headers['Referrer-Policy']='no-referrer'
    response.headers['Content-Security-Policy']="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"
    return response

@app.exception_handler(RequestValidationError)
async def invalid_profile(request, exc):
    # FastAPI's default response can echo user input; return only field names.
    return JSONResponse({'detail':'Use a complete fictional profile, 1–40 hours per week, and confirm synthetic data.',
                         'fields':list({str(e['loc'][-1]) for e in exc.errors()})},status_code=422)

@app.get('/api/health')
async def health():
    configured=app.state.inference.configured and bool(os.getenv('DEMO_ACCESS_CODE'))
    return {'status':'ok','inference_configured':configured,'inference_verified':bool(app.state.last_inference),
            'last_successful_inference_at':app.state.last_inference,
            'model':app.state.inference.model,'mode':'real-ai' if configured else 'setup-required',
            'note':'Configuration does not prove inference health. A successful report is required.'}

@app.get('/api/radar')
async def radar(refresh: bool=False):
    try: return await app.state.sources.get(refresh=refresh)
    except SourceUnavailable as exc: raise HTTPException(503,str(exc)) from exc

@app.post('/api/analyze')
async def analyze(profile: Profile, request: Request):
    provider=app.state.inference
    access=os.getenv('DEMO_ACCESS_CODE','')
    if not provider.configured or not access:
        raise HTTPException(503,'Real AI is not connected yet. Configure RunPod and a demo access code; no mock analysis will be substituted.')
    if not hmac.compare_digest(request.headers.get('X-Demo-Code',''),access):
        raise HTTPException(401,'Enter the demo access code supplied by the team.')
    now=time.monotonic()
    app.state.calls=[t for t in app.state.calls if now-t<86400]
    if app.state.busy or len(app.state.calls)>=int(os.getenv('MAX_DAILY_ANALYSES','20')):
        raise HTTPException(429,'Analysis capacity reached. Please try later or contact the team.')
    app.state.busy=True
    app.state.calls.append(now)
    try:
        async with asyncio.timeout(280):
            snapshot=await app.state.sources.get()
            if not snapshot['research']:
                raise SourceUnavailable('AI research signals are unavailable. Retry when the feed returns; no unsourced AI trend analysis was generated.')
            ranked=rank_roles(profile,snapshot['roles'])
            report,meta=await provider.analyze(profile,snapshot,ranked)
            app.state.last_inference=datetime.now(timezone.utc).isoformat()
            return {'mode':'real-ai','analysis':report.model_dump(),'ranking':ranked,'evidence':snapshot,
                    'inference':meta,'report_id':str(uuid.uuid4()),'generated_at':datetime.now(timezone.utc).isoformat(),
                    'limitations':['Model inferences are hypotheses, not verified competence or hiring advice.',
                                   'Citations identify context; semantic support requires human review.',
                                   'US occupational data does not establish Malaysian demand.',
                                   'Matching is an English lexical heuristic over five reference occupations, not a calibrated suitability probability.']}
    except (SourceUnavailable, InferenceError) as exc: raise HTTPException(503,str(exc)) from exc
    except TimeoutError as exc: raise HTTPException(504,'Analysis exceeded the time limit. Retry later.') from exc
    finally: app.state.busy=False

@app.post('/api/match')
async def match(profile: Profile):
    """A useful non-LLM feature; never presented as AI inference."""
    try:
        snapshot=await app.state.sources.get()
        return {'mode':'source-matching','ranking':rank_roles(profile,snapshot['roles']), 'evidence':snapshot,
                'note':'Source-based lexical matching only. No AI model was called.'}
    except SourceUnavailable as exc: raise HTTPException(503,str(exc)) from exc

@app.get('/')
async def index(): return FileResponse(ROOT/'prototype/index.html')

@app.get('/{filename}')
async def asset(filename: str):
    # Serve only explicit frontend assets, never repository files, secrets or tests.
    if filename not in {'app.js','data.js','logic.js','live.js','styles.css'}: raise HTTPException(404)
    return FileResponse(ROOT/'prototype'/filename)
