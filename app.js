const drives = [
  { name: 'Drive 01', media: 'LTO-9 · Tape ARC-1042', state: 'Writing', detail: '284 MB/s · ETA 01:18', progress: 68 },
  { name: 'Drive 02', media: 'LTO-8 · Tape FIN-2201', state: 'Idle', detail: 'Ready for mount', progress: 0 },
  { name: 'Drive 03', media: 'LTO-9 · Tape VM-9007', state: 'Restoring', detail: '196 MB/s · ETA 00:42', progress: 41 },
  { name: 'Drive 04', media: 'No cartridge', state: 'Cleaning due', detail: 'Last cleaned 113 hours ago', progress: 0 }
];

const jobs = [
  { name: 'Archive /data/projects/film', type: 'Write', target: 'ARC-1042', eta: '01h 18m', throughput: '284 MB/s', progress: 68 },
  { name: 'Restore finance/q4-ledger', type: 'Restore', target: 'FIN-2201', eta: '00h 42m', throughput: '196 MB/s', progress: 41 },
  { name: 'Catalog scan TAPE-7781', type: 'Scan', target: 'Slot 42', eta: '00h 12m', throughput: 'Metadata only', progress: 86 },
  { name: 'Archive /render/finals', type: 'Write', target: 'Queue', eta: '02h 33m', throughput: 'Waiting for drive', progress: 12 }
];

const tree = [
  { path: '/data/projects/film', items: '4.8 TB · 218,401 files', checked: true },
  { path: '/data/projects/audio', items: '1.1 TB · 84,120 files', checked: false },
  { path: '/data/projects/vfx/cache', items: '2.9 TB · 31,992 files', checked: true },
  { path: '/data/projects/docs/contracts', items: '120 GB · 14,482 files', checked: false },
  { path: '/data/projects/dailies/week-12', items: '3.6 TB · 198,245 files', checked: true }
];

const slots = Array.from({ length: 18 }, (_, index) => {
  const number = index + 1;
  if (number % 5 === 0) return { label: `S${number}`, state: 'Reserved', className: 'slot--reserved' };
  if (number % 3 === 0) return { label: `S${number}`, state: 'Scratch', className: '' };
  return { label: `S${number}`, state: `ARC-${1000 + number}`, className: 'slot--loaded' };
});

const driveList = document.getElementById('drive-list');
const jobList = document.getElementById('job-list');
const fileTree = document.getElementById('file-tree');
const slotGrid = document.getElementById('slot-grid');

function renderDrives() {
  driveList.innerHTML = drives
    .map(
      (drive) => `
        <article class="drive-card">
          <div class="drive-card__top">
            <div>
              <strong>${drive.name}</strong>
              <div class="meta">${drive.media}</div>
            </div>
            <div>
              <span class="status-pill ${drive.state === 'Cleaning due' ? 'status-pill--warning' : 'status-pill--info'}">${drive.state}</span>
            </div>
          </div>
          <div class="meta">${drive.detail}</div>
          <div class="progress"><span style="width: ${drive.progress}%"></span></div>
        </article>
      `
    )
    .join('');
}

function renderJobs() {
  jobList.innerHTML = jobs
    .map(
      (job) => `
        <article class="job-card">
          <div class="job-card__top">
            <div>
              <strong>${job.name}</strong>
              <small>${job.type} · ${job.target}</small>
            </div>
            <span class="status-pill status-pill--info">ETA ${job.eta}</span>
          </div>
          <div class="progress"><span style="width: ${job.progress}%"></span></div>
          <div class="job-card__stats">
            <span>${job.progress}% complete</span>
            <span>${job.throughput}</span>
          </div>
        </article>
      `
    )
    .join('');
}

function renderTree() {
  fileTree.innerHTML = tree
    .map(
      (node) => `
        <label class="file-tree__item">
          <div class="checkbox">
            <input type="checkbox" ${node.checked ? 'checked' : ''} />
            <div>
              <strong>${node.path}</strong>
              <small>${node.items}</small>
            </div>
          </div>
          <span class="pill">Eligible</span>
        </label>
      `
    )
    .join('');
}

function renderSlots() {
  slotGrid.innerHTML = slots
    .map(
      (slot) => `
        <div class="slot ${slot.className}">
          <strong>${slot.label}</strong>
          <span>${slot.state}</span>
        </div>
      `
    )
    .join('');
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tabs__item');
  const panels = document.querySelectorAll('.workflow-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.remove('tabs__item--active'));
      panels.forEach((panel) => panel.classList.remove('active'));
      tab.classList.add('tabs__item--active');
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`)?.classList.add('active');
    });
  });
}

renderDrives();
renderJobs();
renderTree();
renderSlots();
setupTabs();
