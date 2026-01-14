chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-urdu",
    title: "Get Meaning (Urdu ↔ English)",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate-urdu") {
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["sweetalert2.all.min.js"]
    }, () => {
      
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectTranslationScript,
        args: [info.selectionText] 
      });
    });
  }
});

function injectTranslationScript(selectedText) {
 
  function detectLanguage(text) {
    const urduRegex = /^[\u0600-\u06FF\s]+$/;
    return urduRegex.test(text.trim()) ? "ur" : "en";
  }

  
  let translationInProgress = false;

  
  function showTranslationPopup(selectedText) {
    if (translationInProgress) return;  
    translationInProgress = true;

    const sourceLang = detectLanguage(selectedText);
    const targetLang = sourceLang === 'ur' ? 'en' : 'ur';

    Swal.fire({
      title: 'Translating...',
      timer: 300,
      showConfirmButton: false,
      allowOutsideClick: false,
      width: '300px',
      showClass: { popup: '' },
      hideClass: { popup: '' },
      willClose: () => {
        translationInProgress = false;  
      }
    });

    
    fetch("http://127.0.0.1:5000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText, source: sourceLang, target: targetLang })
    })
      .then(res => res.json())
      .then(data => {
        if (data.meaning) {
          displayPopup(selectedText, data.meaning);
        } else {
          Swal.fire({
            title: 'Translation Failed',
            text: 'No translation found',
            icon: 'error'
          });
        }
      })
      .catch(err => {
        Swal.fire({
          title: 'Translation Failed',
          text: err.message,
          icon: 'error'
        });
      });
  }

 
  function displayPopup(word, meaning) {
    Swal.fire({
      title: '🌐 Urdu Sukhan',
      html: `
        <div style="text-align: left; font-family: 'Segoe UI', sans-serif; font-size: 22px;">
          <p><strong style="color:#003366;">Word:</strong> <span id="word-text">${word}</span>
            <button id="speak-word" style="background:none; border:none; cursor:pointer; font-size: 18px;">🔊</button>
          </p>
          <p><strong style="color:#003366;">Meaning:</strong> <span id="meaning-text">${meaning}</span>
            <button id="speak-meaning" style="background:none; border:none; cursor:pointer; font-size: 18px;">🔊</button>
          </p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '💾 Save',
      cancelButtonText: '❌ Close',
      showCloseButton: true,
      background: '#f0f4ff',
      color: '#333',
      width: 420,
      customClass: {
        popup: 'rounded-xl shadow-lg',
        confirmButton: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700',
        cancelButton: 'bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400'
      },
      didOpen: () => {
        document.getElementById("speak-word").addEventListener("click", () => {
          speakText(word, detectLanguage(word));
        });

        document.getElementById("speak-meaning").addEventListener("click", () => {
          speakText(meaning, detectLanguage(meaning));
        });
      },
      willClose: () => {
        translationInProgress = false;  // Reset translation state when popup closes
      }
    }).then(result => {
      if (result.isConfirmed) {
        fetch("http://127.0.0.1:5000/save_note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: word, meaning: meaning })
        })
          .then(res => res.json())
          .then(data => {
            Swal.fire({
              title: '✅ Saved!',
              text: 'Word and meaning saved to backend.',
              icon: 'success',
              timer: 1200,
              showConfirmButton: false
            });
          })
          .catch(err => {
            Swal.fire({
              title: '❌ Save Failed',
              text: 'Could not save to backend.',
              icon: 'error'
            });
          });
      }
    });
  }

 
  function speakText(text, lang) {
    fetch("http://127.0.0.1:5000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang })
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'TTS Error',
          text: err.message
        });
      });
  }

  
  if (selectedText) {
    showTranslationPopup(selectedText);
  }
}
