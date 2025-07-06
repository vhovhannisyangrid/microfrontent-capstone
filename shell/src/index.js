const app = document.getElementById("app");
const remoteLoaded = {};

function injectRemote(remoteName, remoteUrl) {
  if (remoteLoaded[remoteName]) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = remoteUrl;
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      console.log(`${remoteName} loaded`);
      remoteLoaded[remoteName] = true;
      resolve();
    };
    script.onerror = () => reject(new Error(`failed ${remoteUrl}`));
    document.head.appendChild(script);
  });
}

async function loadMFE(name) {
  const remotes = {
    mfe1: "http://localhost:3001/remoteEntry.js",
    mfe2: "http://localhost:3002/remoteEntry.js",
  };

  try {
    await injectRemote(name, remotes[name]);

    const container = window[name];
    if (!container) throw new Error(`${name} is not available on window`);

    await __webpack_init_sharing__("default");
    await container.init(__webpack_share_scopes__.default);

    const factory = await container.get("./App");
    const module = factory();

    const content = module.render?.();
    if (!(content instanceof HTMLElement)) {
      throw new Error(`Failed HTML`);
    }

    app.innerHTML = "";
    app.appendChild(content);
    console.log(`Loaded ${name}`);
  } catch (err) {
    console.error(`Failed ${name}`, err);
    app.innerHTML = `failed: ${err.message}`;
  }
}

document.getElementById("btn-mfe1").onclick = () => loadMFE("mfe1");
document.getElementById("btn-mfe2").onclick = () => loadMFE("mfe2");
