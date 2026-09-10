import { spawn, execFile, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, openSync, closeSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceId = createHash('sha256').update(root.toLowerCase().replaceAll('\\', '/')).digest('hex');
const owned = [];
let stopping = false;
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function json(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function occupied(port) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.listen(port, () => server.close(() => resolve(false)));
  });
}

async function inspect(port, endpoint, service) {
  if (!await occupied(port)) return false;
  try {
    const health = await json(`http://127.0.0.1:${port}${endpoint}`);
    if (health.service === service && health.workspaceId === workspaceId && health.protocolVersion === 1) {
      console.log(`${port}: 이 프로젝트의 기존 서버를 재사용합니다.`);
      return true;
    }
  } catch { /* Unidentified servers must never be terminated automatically. */ }
  throw new Error(`${port} 포트에 다른 서버 또는 이전 실행 방식의 서버가 있습니다. 해당 서버를 실행한 터미널에서 확인해 주세요. 자동 종료·포트 변경은 하지 않습니다. 백엔드 종료 시 현재 메모리 기록은 사라집니다.`);
}

function launch(name, command, args, cwd) {
  const fd = openSync(path.join(root, '.runtime', `${name}.log`), 'a');
  const child = spawn(command, args, {
    cwd, env: { ...process.env, RESEARCH_WORKSPACE_ID: workspaceId, PYTHONIOENCODING: 'utf-8' },
    stdio: ['ignore', fd, fd], windowsHide: true,
    detached: process.platform !== 'win32',
  });
  closeSync(fd);
  owned.push(child);
  child.on('error', error => { console.error(`${name}: ${error.message}`); void stop(1); });
  child.on('exit', code => {
    if (!stopping) { console.error(`${name} 서버가 종료됐습니다 (${code}). .runtime/${name}.log를 확인하세요.`); void stop(1); }
  });
}

async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  await Promise.all(owned.map(child => new Promise(resolve => {
    if (!child.pid || child.exitCode !== null) return resolve();
    if (process.platform === 'win32') {
      execFile('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }, resolve);
    } else {
      try { process.kill(-child.pid, 'SIGTERM'); } catch { /* Already exited. */ }
      resolve();
    }
  })));
  console.log('이번 명령이 시작한 서버만 종료했습니다. 재사용한 서버는 유지합니다.');
  process.exit(code);
}

async function ready(url, service) {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    try {
      const health = await json(url);
      if (health.service === service && health.workspaceId === workspaceId && health.protocolVersion === 1) return;
    } catch { /* Startup compilation may still be running. */ }
    await pause(500);
  }
  throw new Error(`서버 시작을 확인하지 못했습니다: ${url}. .runtime 로그를 확인하세요.`);
}

async function main() {
  // Inspect both ports before starting anything.
  const [apiRunning, webRunning] = await Promise.all([
    inspect(8000, '/health', 'research-topic-validation-api'),
    inspect(3000, '/api/local-health', 'research-topic-validation-web'),
  ]);
  const venv = path.join(root, 'services/api/.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
  const python = process.env.RESEARCH_PYTHON || (existsSync(venv) ? venv : 'python');
  const next = path.join(root, 'node_modules/next/dist/bin/next');
  if (!webRunning && !existsSync(next)) throw new Error('프론트 의존성이 없습니다. npm install을 먼저 실행하세요.');
  if (!apiRunning) {
    const check = spawnSync(python, ['-c', 'import sys,fastapi,httpx,uvicorn; assert sys.version_info >= (3,9)'], { windowsHide: true });
    if (check.status !== 0) throw new Error('Python 3.9 이상과 API 의존성이 필요합니다. README의 설치 절차를 확인하세요.');
  }
  mkdirSync(path.join(root, '.runtime'), { recursive: true });
  console.log('종료: Ctrl+C. 현재 백엔드는 메모리 저장 방식이므로 종료하면 검색·평가 기록이 사라집니다.');
  if (!apiRunning) launch('api', python, ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'], path.join(root, 'services/api'));
  await ready('http://127.0.0.1:8000/health', 'research-topic-validation-api');
  console.log('백엔드에서 실제 논문 검색 연결을 점검합니다…');
  try {
    const response = await fetch('http://127.0.0.1:8000/health/search/check', { method: 'POST', signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const state = await response.json();
    console.log(`${state.message}${state.errorId ? ` (오류 번호: ${state.errorId})` : ''}`);
  } catch {
    console.warn('검색 연결 점검 응답을 받지 못했습니다. 화면에서 연결 상태를 다시 확인하세요.');
  }
  if (!webRunning) launch('web', process.execPath, [next, 'dev', '--hostname', '127.0.0.1', '--port', '3000'], path.join(root, 'apps/web'));
  await ready('http://127.0.0.1:3000/api/local-health', 'research-topic-validation-web');
  console.log('검색 화면: http://localhost:3000\n대시보드: http://localhost:3000/observability\n로그: .runtime/api.log, .runtime/web.log');
  if (!owned.length) return;
  const timer = setInterval(async () => {
    try {
      await Promise.all([json('http://127.0.0.1:8000/health'), json('http://127.0.0.1:3000/api/local-health')]);
    } catch { console.warn('로컬 서버 응답이 없습니다. .runtime 로그를 확인하세요.'); }
  }, 15000);
  timer.unref();
}

process.on('SIGINT', () => void stop());
process.on('SIGTERM', () => void stop());
main().catch(error => { console.error(error.message); void stop(1); });
