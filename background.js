// Background Service Worker for PlayEntry URL Safety Check

chrome.runtime.onInstalled.addListener(() => {
  console.log('PlayEntry URL Safety Check 확장 프로그램이 설치되었습니다.');
});

// 메시지 리스너 (필요시 content script와 통신)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkURL') {
    // 백그라운드에서 URL 검사 처리 (필요시)
    sendResponse({ status: 'received' });
  }
});