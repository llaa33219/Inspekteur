// PlayEntry.org 외부 리다이렉트 URL 안전성 검사 Content Script

const _0x4c8f60=_0x1d7e;(function(_0x28ef5b,_0xe221b2){const _0x3d6c22=_0x1d7e,_0x478a9e=_0x28ef5b();while(!![]){try{const _0x4c131f=-parseInt(_0x3d6c22(0xba))/0x1*(-parseInt(_0x3d6c22(0xb7))/0x2)+-parseInt(_0x3d6c22(0xb6))/0x3+-parseInt(_0x3d6c22(0xbc))/0x4*(-parseInt(_0x3d6c22(0xc1))/0x5)+-parseInt(_0x3d6c22(0xc2))/0x6*(-parseInt(_0x3d6c22(0xbe))/0x7)+parseInt(_0x3d6c22(0xb8))/0x8*(-parseInt(_0x3d6c22(0xb9))/0x9)+parseInt(_0x3d6c22(0xbd))/0xa*(parseInt(_0x3d6c22(0xbf))/0xb)+-parseInt(_0x3d6c22(0xc0))/0xc;if(_0x4c131f===_0xe221b2)break;else _0x478a9e['push'](_0x478a9e['shift']());}catch(_0x2704ef){_0x478a9e['push'](_0x478a9e['shift']());}}}(_0x54ce,0x1d47e));const SAFE_BROWSING_API_KEY=_0x4c8f60(0xbb);function _0x1d7e(_0x50b763,_0x316489){const _0x54cec6=_0x54ce();return _0x1d7e=function(_0x1d7eb5,_0x2e294a){_0x1d7eb5=_0x1d7eb5-0xb6;let _0x54b5db=_0x54cec6[_0x1d7eb5];return _0x54b5db;},_0x1d7e(_0x50b763,_0x316489);}function _0x54ce(){const _0x29e588=['130361yhuSMU','1245168xFCmyg','593755GSKQxj','564312zdNuIT','65991KJVolz','1754QRfjQg','101360EXVXDE','135EysApL','38NKJIZL','AIzaSyBMeqeSmhPo7_YpC6BAvIPvzwdYndXs8ng','4SCkmux','160trYAYt','7VnKfsI'];_0x54ce=function(){return _0x29e588;};return _0x54ce();} // API 키를 여기에 입력하세요
const REDIRECT_URL_PATTERN = /^https:\/\/playentry\.org\/redirect\?external=(.+)$/;



// URL 디코딩 함수
function decodeURL(encodedURL) {
  try {
    return decodeURIComponent(encodedURL);
  } catch (e) {
    return encodedURL;
  }
}


// Google Safe Browsing API 호출
async function checkURLSafety(url) {
  const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`;
  
  const requestBody = {
    client: {
      clientId: "playentry-safety-check",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: [
        "MALWARE", 
        "SOCIAL_ENGINEERING", 
        "UNWANTED_SOFTWARE", 
        "POTENTIALLY_HARMFUL_APPLICATION",
        "SUSPICIOUS",
        "THREAT_TYPE_UNSPECIFIED"
      ],
      platformTypes: ["ANY_PLATFORM", "WINDOWS", "LINUX", "OSX", "ANDROID", "IOS"],
      threatEntryTypes: ["URL", "EXECUTABLE"],
      threatEntries: [
        { url: url }
      ]
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    // 위험한 사이트인지 확인
    if (data.matches && data.matches.length > 0) {
      return {
        safe: false,
        threat: data.matches[0].threatType,
        type: 'malware'
      };
    } else {
      return {
        safe: true,
        threat: null,
        type: 'safe'
      };
    }
  } catch (error) {
    console.error('Safe Browsing API 호출 실패:', error);
    return {
      safe: null,
      threat: null,
      type: 'unknown',
      error: error.message
    };
  }
}


// CSS 스타일 업데이트 함수
function updateSecurityIndicator(result) {
  const targetElement = document.querySelector('.css-11aguhf:before');
  
  if (!targetElement) {
    // 가상 요소를 직접 수정할 수 없으므로 CSS 규칙을 추가
    const style = document.createElement('style');
    document.head.appendChild(style);
    
    if (result.safe === true) {
      // 안전한 사이트
      style.sheet.insertRule(`
        .css-11aguhf:before {
          background-image: url('https://playentry.org/uploads/sl/xd/slxdtvswkm4fphxy003hf51f2b254xiy.svg') !important;
          background-size: auto !important;
        }
      `);
    } else if (result.safe === false) {
      // 위험한 사이트
      style.sheet.insertRule(`
        .css-11aguhf:before {
          background-image: url('https://playentry.org/img/imgWarningRedirect.svg') !important;
          background-size: auto !important;
        }
      `);
    } else {
      // 검사 실패 또는 알 수 없음
      style.sheet.insertRule(`
        .css-11aguhf:before {
          background-image: url('https://playentry.org/uploads/vg/dg/vgdgdxdpkxidtvos1a57292ed05nti82.svg') !important;
          background-size: auto !important;
        }
      `);
    }
  }
}

// 텍스트 내용 업데이트 함수
function updateTextContent(result) {
  const targetDiv = document.querySelector('.css-11aguhf.e3z3cws2');
  
  if (targetDiv) {
    const paragraphElement = targetDiv.querySelector('p');
    
    if (paragraphElement) {
      if (result.safe === true) {
        // 안전한 사이트
        paragraphElement.innerHTML = '지금 이동하려는 페이지는 엔트리가 아닌 외부 페이지입니다.<br>안전한 페이지로 판단되었지만 한번 더 확인해 주세요.';
      } else if (result.safe === false) {
        // 위험한 사이트
        paragraphElement.innerHTML = `지금 이동하려는 페이지는 엔트리가 아닌 외부 페이지입니다.<br>위험한 페이지(${result.threat || '보안 위험'})로 판단되었으니 이동하지 않는걸 권장합니다.`;
      } else {
        // 검사 실패 또는 알 수 없음
        paragraphElement.innerHTML = '지금 이동하려는 페이지는 엔트리가 아닌 외부 페이지입니다.<br>페이지 안전성 검사에 실패하였으니 안전한 페이지가 맞는지 다시 한번 확인해 주세요.';
      }
    }
  }
}

// 메인 함수
async function checkCurrentURL() {
  const currentURL = window.location.href;
  
  // playentry.org/redirect?external= 패턴 확인
  const match = currentURL.match(REDIRECT_URL_PATTERN);
  
  if (match) {
    const encodedExternalURL = match[1];
    const externalURL = decodeURL(encodedExternalURL);
    
    console.log('외부 리다이렉트 URL 감지:', externalURL);
    
    // Google Safe Browsing API로 안전성 검사
    const safetyResult = await checkURLSafety(externalURL);
    
    console.log('안전성 검사 결과:', safetyResult);
    
    // CSS 스타일 업데이트
    updateSecurityIndicator(safetyResult);
    
    // 텍스트 내용 업데이트
    updateTextContent(safetyResult);
    
    // 결과에 따른 추가 처리
    if (safetyResult.safe === false) {
      console.warn('위험한 사이트 감지:', externalURL, '위험 유형:', safetyResult.threat);
    } else if (safetyResult.safe === true) {
      console.log('안전한 사이트 확인:', externalURL);
    } else {
      console.log('안전성 검사 실패 또는 알 수 없음:', safetyResult.error);
    }
  }
}

// 페이지 로드 시 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkCurrentURL);
} else {
  checkCurrentURL();
}

// URL 변경 감지 (SPA 대응)
let currentURL = window.location.href;
const observer = new MutationObserver(() => {
  if (currentURL !== window.location.href) {
    currentURL = window.location.href;
    checkCurrentURL();
  }
});

observer.observe(document, { childList: true, subtree: true });
