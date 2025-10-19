const { shell } = require('electron');

const tabsContainer = document.getElementById('tabs');
const viewsContainer = document.getElementById('views');
const addTabBtn = document.getElementById('add-tab-btn');

let tabs = [];
let activeTabId = null;
let tabCounter = 0;

function createTab(url) {
  tabCounter++;
  const tabId = `tab-${Date.now()}`;

  const tabEl = document.createElement('div');
  tabEl.className = 'tab';
  tabEl.dataset.id = tabId;

  const titleEl = document.createElement('span');
  titleEl.className = 'tab-title';
  titleEl.textContent = `Tab ${tabCounter}`;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-tab-btn';
  closeBtn.innerHTML = '&times;';

  tabEl.appendChild(titleEl);
  tabEl.appendChild(closeBtn);
  tabsContainer.appendChild(tabEl);

  const webview = document.createElement('webview');
  webview.dataset.id = tabId;
  webview.src = url;
  webview.partition = 'persist:discord';
  viewsContainer.appendChild(webview);

  const tabData = { id: tabId, el: tabEl, view: webview, title: titleEl };
  tabs.push(tabData);

  webview.addEventListener('new-window', (e) => {
    shell.openExternal(e.url);
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(tabId);
  });

  tabEl.addEventListener('click', () => {
    activateTab(tabId);
  });

  activateTab(tabId);
}

function closeTab(tabId) {
  const tabIndex = tabs.findIndex(t => t.id === tabId);
  if (tabIndex === -1) return;

  const [tabToClose] = tabs.splice(tabIndex, 1);
  tabToClose.el.remove();
  tabToClose.view.remove();

  if (activeTabId === tabId) {
    if (tabs.length > 0) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      activateTab(tabs[newActiveIndex].id);
    } else {
      activeTabId = null;
    }
  }
}

function activateTab(tabId) {
  if (activeTabId === tabId) return;
  activeTabId = tabId;

  tabs.forEach(tab => {
    const isActive = tab.id === tabId;
    tab.el.classList.toggle('active', isActive);
    tab.view.classList.toggle('visible', isActive);
  });
}

addTabBtn.addEventListener('click', () => {
  createTab('https://discord.com/app');
});

createTab('https://discord.com/app');
