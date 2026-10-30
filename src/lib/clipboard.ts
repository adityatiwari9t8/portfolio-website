/** Copy with a legacy fallback, returning success only when a browser API confirms it. */
export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const previous = document.activeElement as HTMLElement | null;
    const field = document.createElement('textarea');
    field.value = text;
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    // Keep the fallback inside the active dialog so inert backgrounds cannot block focus.
    (previous?.closest('[role="dialog"]') ?? document.body).appendChild(field);
    field.select();
    try { return document.execCommand('copy'); }
    catch { return false; }
    finally { field.remove(); previous?.focus(); }
  }
}
