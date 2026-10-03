const { JSDOM } = require('jsdom');
const fs = require('fs');
(async ()=>{
  const html = fs.readFileSync('dist/index.html','utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost' });
  // wait for scripts to load
  await new Promise(r=>setTimeout(r,500));
  // stub fetch
  dom.window.fetch = async ()=>({ json: async ()=>({ success: true }) });
  // fill form fields
  const name = dom.window.document.getElementById('name'); if(name) name.value='Test User';
  const email = dom.window.document.getElementById('email'); if(email) email.value='test@example.com';
  const message = dom.window.document.getElementById('message'); if(message) message.value='Hello from test.';
  // ensure fallback is satisfied so submit proceeds
  const a = dom.window.document.getElementById('turnstile-fallback');
  const i = dom.window.document.getElementById('fallback-answer');
  const d = dom.window.document.getElementById('fallback-ts');
  if(a){ a.classList.remove('hidden'); a.dataset.expected = 'j'; }
  if(i){ i.value = 'Japan'; }
  if(d){ d.value = String(Date.now() - 5000); }

  // quick manual invocation of s() to test showMessage
  if(typeof dom.window.s === 'function'){
    dom.window.s('Manual check: success', 'success');
    await new Promise(r=>setTimeout(r,100));
    const manualMsg = dom.window.document.getElementById('form-message');
    console.log('after manual s():', manualMsg ? JSON.stringify(manualMsg.textContent) : 'NOT FOUND');
  } else {
    console.log('s() not available');
  }

  // submit form
  const form = dom.window.document.getElementById('contact-form');
  if(form){
    form.dispatchEvent(new dom.window.Event('submit',{ bubbles:true, cancelable:true }));
    await new Promise(r=>setTimeout(r,500));
    const msg = dom.window.document.getElementById('form-message');
    console.log('form-message raw:', msg ? JSON.stringify(msg.textContent) : 'NOT FOUND');
    console.log('form-message trimmed slice:', msg ? msg.textContent.trim().slice(0,300) : 'NOT FOUND');
  } else {
    console.log('Form not found');
  }
})();