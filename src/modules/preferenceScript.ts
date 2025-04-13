import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { getPref, setPref } from "../utils/prefs";
import { ColumnOptions } from "zotero-plugin-toolkit";

/**
 * Register scripts for the preferences window
 * @param _window The preferences window
 */
export async function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/content/preferences.xhtml onpaneload
  if (!addon.data.prefs) {
    // Add empty arrays required by type definitions
    addon.data.prefs = {
      window: _window,
      columns: [] as Array<ColumnOptions>,
      rows: [] as Array<{ [dataKey: string]: string }>
    };
  } else {
    addon.data.prefs.window = _window;
  }
  updatePrefsUI();
  bindPrefEvents();
}

/**
 * Update the preferences UI
 */
async function updatePrefsUI() {
  if (addon.data.prefs?.window == undefined) return;
  
  // Initialize input field with current maxTabs setting
  try {
    const maxTabsInput = addon.data.prefs.window.document?.querySelector(
      `#zotero-prefpane-${config.addonRef}-maxTabs`
    ) as HTMLInputElement;
    
    if (maxTabsInput) {
      const currentMaxTabs = getPref("maxTabs");
      maxTabsInput.value = currentMaxTabs ? currentMaxTabs.toString() : "10";
      ztoolkit.log(`Initialized maxTabs input with value: ${maxTabsInput.value}`);
    }
  } catch (e) {
    ztoolkit.log(`Error initializing maxTabs input: ${e}`, "error");
  }
}

/**
 * Bind event listeners to preferences elements
 */
function bindPrefEvents() {
  // Add event listener for maxTabs setting
  const maxTabsInput = addon.data.prefs!.window.document?.querySelector(
    `#zotero-prefpane-${config.addonRef}-maxTabs`
  );
  
  if (maxTabsInput) {
    maxTabsInput.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const newValue = parseInt(target.value);
      
      // Validation
      if (isNaN(newValue) || newValue < 1) {
        addon.data.prefs!.window.alert("Minimum number of tabs must be at least 1.");
        target.value = "1";
        setPref("maxTabs", 1);
        return;
      }
      
      // Save setting
      setPref("maxTabs", newValue);
      ztoolkit.log(`Max tabs setting changed to ${newValue}`);
      
      // Show notification
      addon.data.prefs!.window.alert(
        `Maximum number of tabs set to ${newValue}. If the current number of tabs exceeds this limit, the oldest tabs will be closed automatically.`
      );
    });
  }
}
