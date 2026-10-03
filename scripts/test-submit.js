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
  // submit form
  const form = dom.window.document.getElementById('contact-form');
  if(form){
    form.dispatchEvent(new dom.window.Event('submit',{ bubbles:true, cancelable:true }));
    await new Promise(r=>setTimeout(r,500));
    const msg = dom.window.document.getElementById('form-message');
    console.log('form-message text:', msg ? msg.textContent.trim().slice(0,300) : 'NOT FOUND');
  } else {
    console.log('Form not found');
  }
})();